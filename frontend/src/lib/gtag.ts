"use client";

export const search = (address: string) =>
  window.gtag("event", "search", {
    search_term: address
  });
