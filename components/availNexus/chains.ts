export const SUPPORTED_CHAINS_IDS = [
  // Mainnet
  1,       // Ethereum
  10,      // Optimism
  137,     // Polygon
  42161,   // Arbitrum
  43114,   // Avalanche
  8453,    // Base
  534352,  // Scroll
  50104,   // Sophon
  8217,    // Kaia
  56,      // BNB
  999,     // HyperEVM

  // Testnet
  11155420, // Optimism Sepolia
  80002,    // Polygon Amoy
  421614,   // Arbitrum Sepolia
  84532,    // Base Sepolia
  11155111, // Sepolia
  10143,    // Monad Testnet
] as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS_IDS)[number];