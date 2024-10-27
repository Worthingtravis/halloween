"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GhostIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Costume {
  id: string;
  url: string;
  user_id: string;
}

interface VoteCount {
  [costumeId: string]: number;
}

interface TotalVotes {
  [category: string]: { [costumeId: string]: number };
}

const voteCategories = ["best", "funniest", "most creative", "worst"];

export default function CostumeContest() {
  const { isSignedIn, user } = useUser();
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCount>({});
  const [totalVotes, setTotalVotes] = useState<TotalVotes>({});
  const [userVotes, setUserVotes] = useState<
    Record<string, { costumeId: string; category: string } | null>
  >({});
  const [votedCostumes, setVotedCostumes] = useState<Set<string>>(new Set());
  const [votedCategories, setVotedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 1000);
    const fetchCostumes = async () => {
      try {
        const response = await fetch("/api/getCostumes");
        if (!response.ok) throw new Error("Failed to load costumes");

        const data = await response.json();
        setCostumes(data.costumes || []);

        const votesResponse = await fetch("/api/getVotes");
        if (!votesResponse.ok) throw new Error("Failed to load votes");

        const votesData = await votesResponse.json();
        const counts: VoteCount = {};
        const allVotes: TotalVotes = {};
        const userVotesData: Record<
          string,
          { category: string; costumeId: string }
        > = {};
        const userVotedCostumes = new Set<string>();
        const userVotedCategories = new Set<string>();

        votesData.votes.forEach(
          (vote: { costume_id: string; category: string; user_id: string }) => {
            counts[vote.costume_id] = (counts[vote.costume_id] || 0) + 1;

            if (!allVotes[vote.category]) {
              allVotes[vote.category] = {};
            }
            allVotes[vote.category][vote.costume_id] =
              (allVotes[vote.category][vote.costume_id] || 0) + 1;

            if (vote.user_id === user?.id) {
              userVotesData[vote.category] = {
                costumeId: vote.costume_id,
                category: vote.category,
              };
              userVotedCostumes.add(vote.costume_id);
              userVotedCategories.add(vote.category);
            }
          },
        );

        setVoteCounts(counts);
        setTotalVotes(allVotes);
        setUserVotes(userVotesData);
        setVotedCostumes(userVotedCostumes);
        setVotedCategories(userVotedCategories);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Could not load costumes and votes.");
      }
    };

    if (isSignedIn) {
      fetchCostumes();
    }
  }, [isSignedIn, user]);

  const handleVote = async (costumeId: string, category: string) => {
    if (!isSignedIn) return alert("Please sign in to vote!");

    const isCostumeAlreadVotedFor = votedCostumes.has(costumeId);
    // if the costume is already voted for, remove the other vote
    if (isCostumeAlreadVotedFor) {
      const previousCategory = Object.keys(userVotes).find(
        (key) => userVotes[key]?.costumeId === costumeId,
      );
      if (previousCategory) {
        setVoteCounts((prevCounts) => ({
          ...prevCounts,
          [costumeId]: Math.max((prevCounts[costumeId] || 1) - 1, 0),
        }));

        setTotalVotes((prevTotalVotes) => ({
          ...prevTotalVotes,
          [previousCategory]: {
            ...prevTotalVotes[previousCategory],
            [costumeId]: Math.max(
              (prevTotalVotes[previousCategory]?.[costumeId] || 1) - 1,
              0,
            ),
          },
        }));

        setUserVotes((prevVotes) => {
          const updatedVotes = { ...prevVotes };
          delete updatedVotes[previousCategory];
          return updatedVotes;
        });

        setVotedCategories((prev) => {
          const updatedCategories = new Set(prev);
          updatedCategories.delete(previousCategory);
          return updatedCategories;
        });
      }
    }

    const isCurrentlySelected = userVotes[category]?.costumeId === costumeId;

    try {
      if (isCurrentlySelected) {
        setVoteCounts((prevCounts) => ({
          ...prevCounts,
          [costumeId]: Math.max((prevCounts[costumeId] || 1) - 1, 0),
        }));

        setTotalVotes((prevTotalVotes) => ({
          ...prevTotalVotes,
          [category]: {
            ...prevTotalVotes[category],
            [costumeId]: Math.max(
              (prevTotalVotes[category]?.[costumeId] || 1) - 1,
              0,
            ),
          },
        }));

        setUserVotes((prevVotes) => {
          const updatedVotes = { ...prevVotes };
          delete updatedVotes[category];
          return updatedVotes;
        });

        setVotedCostumes((prev) => {
          const updatedCostumes = new Set(prev);
          updatedCostumes.delete(costumeId);
          return updatedCostumes;
        });

        setVotedCategories((prev) => {
          const updatedCategories = new Set(prev);
          updatedCategories.delete(category);
          return updatedCategories;
        });
      } else {
        const response = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ costumeId, category }),
        });

        if (!response.ok) throw new Error("Failed to submit vote");

        setVoteCounts((prevCounts) => ({
          ...prevCounts,
          [costumeId]: (prevCounts[costumeId] || 0) + 1,
        }));

        setTotalVotes((prevTotalVotes) => ({
          ...prevTotalVotes,
          [category]: {
            ...prevTotalVotes[category],
            [costumeId]: (prevTotalVotes[category]?.[costumeId] || 0) + 1,
          },
        }));

        setUserVotes((prevVotes) => ({
          ...prevVotes,
          [category]: { costumeId, category },
        }));

        setVotedCostumes((prev) => new Set(prev).add(costumeId));
        setVotedCategories((prev) => new Set(prev).add(category));
      }
    } catch (error) {
      console.error("Error processing vote:", error);
      setError("Failed to process vote. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file || !user) return alert("Please select a file to upload!");

    setUploading(true);
    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: file,
        },
      );

      if (!response.ok) throw new Error("Failed to upload file");

      const data = await response.json();
      setCostumes((prev) => [
        { id: data.filename, url: data.url, user_id: user.id },
        ...prev,
      ]);
      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <GhostIcon size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container @container mx-auto p-4">
      <h1 className="text-6xl font-bold mb-8 text-center">Costume Contest</h1>

      {isSignedIn &&
        !costumes.some((costume) => costume.user_id === user?.id) && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload your costume
              </Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="mb-4"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </CardContent>
          </Card>
        )}

      <h2 className="text-2xl font-bold mb-6 text-center">
        Vote for the Best Costumes
      </h2>

      <VoteProgress
        votedCategories={votedCategories}
        voteCategories={voteCategories}
      />

      <TotalVotesDisplay totalVotes={totalVotes} costumes={costumes} />

      <div className="grid max-w-md grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-6">
        {costumes.map((costume) => (
          <Card key={costume.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={costume.url}
                width={500}
                alt={costume.url}
                height={500}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">
                  Votes: {voteCounts[costume.id] || 0}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <UserIcon size={16} className="mr-1" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2 w-full">
                {voteCategories.map((category) => {
                  const isSelected =
                    userVotes[category]?.costumeId === costume.id;
                  return (
                    <Button
                      key={category}
                      onClick={() => handleVote(costume.id, category)}
                      variant={isSelected ? "secondary" : "default"}
                      className="w-full text-xs sm:text-sm"
                    >
                      {isSelected ? `✓ ${category}` : category}
                    </Button>
                  );
                })}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface VoteProgressProps {
  votedCategories: Set<string>;
  voteCategories: string[];
}

function VoteProgress({ votedCategories, voteCategories }: VoteProgressProps) {
  const remainingCategories = voteCategories.filter(
    (category) => !votedCategories.has(category),
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Voting Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Completed Votes:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(votedCategories).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {votedCategories.size === 0 && (
                <span className="text-sm text-muted-foreground">
                  No votes cast yet
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Remaining Votes:</h3>
            <div className="flex flex-wrap gap-2">
              {remainingCategories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
              {remainingCategories.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  All votes completed!
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TotalVotesDisplayProps {
  totalVotes: TotalVotes;
  costumes: Costume[];
}

function TotalVotesDisplay({ totalVotes, costumes }: TotalVotesDisplayProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Total Votes by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          {voteCategories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium mb-2 capitalize">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {costumes.map((costume) => {
                  const voteCount = totalVotes[category]?.[costume.id] || 0;
                  if (voteCount === 0) return null;
                  return (
                    <Badge
                      key={costume.id}
                      variant="secondary"
                      className="text-xs flex flex-col gap-2"
                    >
                      <Avatar className="size-32">
                        <AvatarImage src={costume.url} height={64} />
                      </Avatar>
                      <span className="text-xl">{voteCount}</span>
                    </Badge>
                  );
                })}
                {!totalVotes[category] ||
                  (Object.keys(totalVotes[category]).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No votes yet
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
