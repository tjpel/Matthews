declare global {
  interface Window {
    gtag(command: string, ...params: any[]): void;
  }
}

export const step = (i: number) =>
  window.gtag("valuation_step", )
