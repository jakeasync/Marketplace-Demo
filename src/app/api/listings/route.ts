import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { inMemoryStore } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Attempt Supabase fetch if real credentials are provided
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
      let query = supabase.from("listings").select("*").order("created_at", { ascending: false });

      if (category && category.toLowerCase() !== "all") {
        query = query.ilike("category", category);
      }
      if (search && search.trim() !== "") {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json(data);
      }
    }

    // High performance fallback using the built-in memory store
    const listings = inMemoryStore.getListings(search || undefined, category || undefined);
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error in GET /api/listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, category, location, seller_email, seller_name, image_url } = body;

    // Strict validation
    if (!title || !description || price === undefined || !category || !location || !seller_email) {
      return NextResponse.json(
        { error: "Missing required fields (title, description, price, category, location, seller_email)" },
        { status: 400 }
      );
    }

    const newListing = {
      id: crypto.randomUUID(),
      title: String(title).trim(),
      description: String(description).trim(),
      price: Number(price),
      category: String(category).trim(),
      seller_email: String(seller_email).trim(),
      seller_name: seller_name ? String(seller_name).trim() : "Marketplace Seller",
      image_url:
        image_url ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      location: location ? String(location).trim() : "Palo Alto, CA",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If Supabase configured, attempt remote insert
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
      // Create db payload matching exact columns in supabase listings table
      const dbPayload = {
        title: String(title).trim(),
        description: String(description).trim(),
        price: Number(price),
        category: String(category).trim(),
        seller_email: String(seller_email).trim(),
        image_url:
          image_url ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        location: location ? String(location).trim() : "Palo Alto, CA",
      };

      const { data, error } = await supabase.from("listings").insert([dbPayload]).select().single();
      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (data) {
        inMemoryStore.addListing(data);
        return NextResponse.json(data, { status: 201 });
      }
    }

    // Add to in-memory store
    const saved = inMemoryStore.addListing(newListing);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/listings:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

