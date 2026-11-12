import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Size limit check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    // Attempt upload to Supabase Storage if remote project configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data, error } = await supabase.storage
        .from("listing-images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
      }
    }

    // Fallback: convert file to a base64 Data URL for standalone instant preview & persistence
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;

    return NextResponse.json({ url: dataUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/upload:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

