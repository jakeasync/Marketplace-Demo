import { Listing, Message } from "./supabase";
import { INITIAL_LISTINGS } from "./mock-data";

// Global in-memory storage store so items created via API persist during runtime
declare global {
  var __MARKETPLACE_LISTINGS__: Listing[] | undefined;
  var __MARKETPLACE_MESSAGES__: Message[] | undefined;
}

if (!global.__MARKETPLACE_LISTINGS__) {
  global.__MARKETPLACE_LISTINGS__ = [...INITIAL_LISTINGS];
}

if (!global.__MARKETPLACE_MESSAGES__) {
  global.__MARKETPLACE_MESSAGES__ = [
    {
      id: "msg-1",
      listing_id: "1",
      buyer_email: "buyer@example.com",
      seller_email: "alex.tech@example.com",
      message: "Hi, is this iPhone still available? Would you consider $850 for local pickup today?",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];
}

export const inMemoryStore = {
  getListings: (query?: string, category?: string): Listing[] => {
    let results = [...(global.__MARKETPLACE_LISTINGS__ || [])];
    if (category && category.toLowerCase() !== "all") {
      results = results.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }
    return results;
  },

  getListingById: (id: string): Listing | undefined => {
    return (global.__MARKETPLACE_LISTINGS__ || []).find((item) => item.id === id);
  },

  addListing: (listing: Listing): Listing => {
    if (!global.__MARKETPLACE_LISTINGS__) {
      global.__MARKETPLACE_LISTINGS__ = [];
    }
    global.__MARKETPLACE_LISTINGS__.unshift(listing);
    return listing;
  },

  getMessages: (listingId: string): Message[] => {
    return (global.__MARKETPLACE_MESSAGES__ || []).filter(
      (m) => m.listing_id === listingId
    );
  },

  addMessage: (message: Message): Message => {
    if (!global.__MARKETPLACE_MESSAGES__) {
      global.__MARKETPLACE_MESSAGES__ = [];
    }
    global.__MARKETPLACE_MESSAGES__.push(message);
    return message;
  },
};

