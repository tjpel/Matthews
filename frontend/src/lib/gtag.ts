declare global {
  interface Window {
    gtag(command: string, ...params: any[]): void;
  }
}

export const step = (i: number) =>
  window.gtag("event", "valuation_step", {
    "step": i
  })

export const search = (address: string) =>
  window.gtag("event", "search", {
    "search_term": address
  })
