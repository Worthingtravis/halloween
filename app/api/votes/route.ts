import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { costumeId, category } = await request.json();

        if (!costumeId || !category) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Delete all votes for this user on the same costume ID across all categories
        const { error: deleteError } = await supabase
            .from("votes")
            .delete()
            .eq("user_id", userId)
            .eq("costume_id", costumeId);

        if (deleteError) {
            console.error("Error deleting previous votes:", deleteError);
            return NextResponse.json({ error: "Failed to delete previous votes" }, { status: 500 });
        }

        // Check if the user has already voted in this category for any costume
        const { data: existingVote, error: checkError } = await supabase
            .from("votes")
            .select("id")
            .eq("user_id", userId)
            .eq("category", category)
            .maybeSingle();

        if (checkError) {
            console.error("Error checking existing vote:", checkError);
            return NextResponse.json({ error: "Error checking existing vote" }, { status: 500 });
        }

        // If a vote exists for this category, update it to the new costumeId
        if (existingVote) {
            const { error: updateError } = await supabase
                .from("votes")
                .update({ costume_id: costumeId })
                .eq("id", existingVote.id);

            if (updateError) {
                console.error("Error updating vote:", updateError);
                return NextResponse.json({ error: "Failed to update vote" }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: "Vote updated to new costume" });
        }

        // If no existing vote in this category, insert a new vote
        const { data: newVote, error: insertError } = await supabase
            .from("votes")
            .insert({
                user_id: userId,
                costume_id: costumeId,
                category,
            })
            .single();

        if (insertError) {
            console.error("Error inserting vote:", insertError);
            return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
        }

        return NextResponse.json({ success: true, vote: newVote });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
