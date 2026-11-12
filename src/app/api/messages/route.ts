import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { inMemoryStore } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listing_id");

    if (!listingId) {
      return NextResponse.json(
        { error: "listing_id query parameter is required" },
        { status: 400 }
      );
    }

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        return NextResponse.json(data);
      }
    }

    const messages = inMemoryStore.getMessages(listingId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json(
      { error: "Failed to retrieve messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listing_id, buyer_email, seller_email, message } = body;

    if (!listing_id || !buyer_email || !seller_email || !message) {
      return NextResponse.json(
        { error: "Missing required fields (listing_id, buyer_email, seller_email, message)" },
        { status: 400 }
      );
    }

    const newMessage = {
      id: crypto.randomUUID(),
      listing_id: String(listing_id),
      buyer_email: String(buyer_email).trim(),
      seller_email: String(seller_email).trim(),
      message: String(message).trim(),
      created_at: new Date().toISOString(),
    };

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
      const dbMessage = {
        listing_id: String(listing_id),
        buyer_email: String(buyer_email).trim(),
        seller_email: String(seller_email).trim(),
        message: String(message).trim(),
      };

      const { data, error } = await supabase
        .from("messages")
        .insert([dbMessage])
        .select()
        .single();

      if (error) {
        console.error("Supabase message insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (data) {
        inMemoryStore.addMessage(data);
        return NextResponse.json(data, { status: 201 });
      }
    }

    const saved = inMemoryStore.addMessage(newMessage);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/messages:", error);
    return NextResponse.json(
      { error: "Failed to post message" },
      { status: 500 }
    );
  }
}

