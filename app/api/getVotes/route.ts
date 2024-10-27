import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {

  try {
    // Fetch votes with explicit grouping and aggregation
    const { data, error } = await supabase
      .from("votes")
      .select("*");

    if (error) {
      console.error("Supabase error during vote fetch:", error);
      return NextResponse.json(
        { error: "Failed to load votes from database" },
        { status: 500 },
      );
    }

    console.log("Vote data successfully retrieved:", data);
    return NextResponse.json({ votes: data });
  } catch (error) {
    console.error("Unexpected API route error:", error);
    return NextResponse.json(
      { error: "Failed to load votes" },
      { status: 500 },
    );
  }
}
