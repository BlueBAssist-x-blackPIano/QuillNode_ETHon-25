export const CONTRACTS = {
  DEPLOYER: "0x6Cf4207cd5CFD107718e22A46E66B1b12ec5f81c",
  STORY_NFT: process.env.NEXT_PUBLIC_STORY_NFT_ADDRESS || "0x82018421063d7c0eFE8a362638bF0D35bA7C0C0d",
  PLAGIARISM_COURT: process.env.NEXT_PUBLIC_PLAGIARISM_COURT_ADDRESS || "0xfbe38a67F463d989E1b7398578dE52E8FbE5c7e5",
  REPUTATION_SYSTEM: process.env.NEXT_PUBLIC_REPUTATION_SYSTEM_ADDRESS || "0x96AAB2B7C4cAdFbc0bf8fE784eB093aaEa4a53B2",
} as const

export const CHAIN_CONFIG = {
  chainId: 11155111, // Sepolia
  chainName: "Sepolia Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo",
  blockExplorer: "https://sepolia.etherscan.io"
} as const