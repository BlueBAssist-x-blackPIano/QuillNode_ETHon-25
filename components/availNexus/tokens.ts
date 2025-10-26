export const SUPPORTED_TOKENS = [
  'ETH',   // Ethereum
  'USDC',  // USD Coin
  'USDT',  // Tether USD
] as const;

export type SupportedToken = (typeof SUPPORTED_TOKENS)[number];