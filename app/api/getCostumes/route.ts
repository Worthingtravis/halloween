import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch costumes from the Supabase database
    // eslint-disable-next-line prefer-const
    let { data, error } = await supabase
      .from("costumes")
      .select("*")
      .order("created_at", { ascending: false });


    if (data)
      data = data?.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.user_id === value.user_id),
      );


    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to load costumes from database" },
        { status: 500 },
      );
    }

    return NextResponse.json({ costumes: data });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to load costumes" },
      { status: 500 },
    );
  }
}
