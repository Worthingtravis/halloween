'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Costume {
    id: string
    url: string
}

interface VoteCounts {
    [costumeId: string]: number
}

interface UserVotes {
    [category: string]: { costumeId: string }
}

export default function CostumeVoting({ costumes, voteCategories }: { costumes: Costume[], voteCategories: string[] }) {
    const [voteCounts, setVoteCounts] = useState<VoteCounts>({})
    const [userVotes, setUserVotes] = useState<UserVotes>({})

    const handleVote = (costumeId: string, category: string) => {
        setUserVotes((prev) => ({
            ...prev,
            [category]: { costumeId },
        }))
        setVoteCounts((prev) => ({
            ...prev,
            [costumeId]: (prev[costumeId] || 0) + 1,
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {costumes.map((costume) => (
                    <Card key={costume.id} className="overflow-hidden">
                        <div className="relative aspect-square">
                            <Image
                                src={costume.url}
                                alt="Costume"
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <CardContent className="p-4">
                            <Badge variant="secondary" className="mb-2">
                                Votes: {voteCounts[costume.id] || 0}
                            </Badge>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-2 w-full">
                                {voteCategories.map((category) => {
                                    const isSelected = userVotes[category]?.costumeId === costume.id;
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
    )
}
