"use client";

declare global {
  interface Window {
    gtag(command: string, ...args: any[]): void;
  }
}

export const valuationStep = (step: number) =>
  window.gtag("event", "valuation_step", { step })

export const search = (address: string) => {
  console.log("gtag search: ", address);
  window.gtag('event', 'search', {
    search_term: address
  });
}
