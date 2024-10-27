import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from '@clerk/nextjs/server'


export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  // Ensure filename and file data exist
  if (!filename || !request.body) {
    return NextResponse.json({ error: "Filename and file data are required" }, { status: 400 });
  }

  // Get the authenticated user's ID
  const { userId } = await auth(); // Replace with your auth provider’s method if different

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    // Upload the file to blob storage with public access
    const blob = await put(filename, request.body, { access: "public" });
    const url = blob.url;

    // Save file details to Supabase
    const { error: dbError } = await supabase
        .from("costumes")
        .insert({ user_id: userId, url });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save costume in database" }, { status: 500 });
    }

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
