import { Listing, Message } from "./supabase";

declare global {
  var __MARKETPLACE_LISTINGS__: Listing[] | undefined;
  var __MARKETPLACE_MESSAGES__: Message[] | undefined;
}

if (!global.__MARKETPLACE_LISTINGS__) {
  global.__MARKETPLACE_LISTINGS__ = [];
}

if (!global.__MARKETPLACE_MESSAGES__) {
  global.__MARKETPLACE_MESSAGES__ = [];
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
