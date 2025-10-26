# 📚 QuillNode - Wattpad on Chain
quill-node-ethonline25.vercel.app
<div align="center">

![QuillNode Banner](https://img.shields.io/badge/ETHOnline_2025-Hackathon_Project-blueviolet?style=for-the-badge)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-blue?style=for-the-badge&logo=ethereum)](https://ethereum.org/)

**A decentralized storytelling platform where stories become NFTs, stored permanently on IPFS, with built-in plagiarism detection and author reputation systems.**

[ GitHub](https://github.com/ParthSinghPS/QuillNode_ETHon-25)

</div>

---

## The Problem We Solve

Traditional storytelling platforms like Wattpad and Medium have critical issues:
-  **No True Ownership** - Platforms control your content, not you
-  **Censorship Risk** - Stories can be deleted without consent
-  **Plagiarism Rampant** - No community-driven detection mechanism
-  **High Platform Fees** - 30-50% cut from authors
-  **Privacy Concerns** - User data tracked and sold

## Our Solution

**QuillNode** is a Web3 storytelling platform where:

 **Stories are NFTs** - ERC-721 tokens give authors true ownership  
 **Permanent IPFS Storage** - Content lives forever via Pinata  
 **Easy Web3 Onboarding** - Privy social logins + embedded wallets  
 **Reputation System** - Authors earn XP and levels  
 **Community Moderation** - Stake-based plagiarism voting  
 **Fully Transparent** - All data on Ethereum Sepolia testnet

---

## Sponsor Integrations

### Avail

**Status:**  SDK Installed & Configured

**Packages:**
- `@avail-project/nexus` (v1.1.0)
- `@avail-project/nexus-core` (v0.0.2)
- `@avail-project/nexus-widgets` (v0.0.6)

**How We Use It:**
This guarantees:
- Metadata retrievable even if Ethereum nodes go offline
- Cross-chain interoperability for future multi-chain expansion
- Reduced gas costs for large metadata storage
- Cryptographic proofs for data integrity

```typescript
// components/availNexus/chains.ts
import { createConfig } from "@avail-project/nexus"

export const availConfig = createConfig({
  chains: [sepolia],
  // Avail DA configuration for cross-chain data availability
})
```

---

###  Pinata (IPFS Storage & Gateway)

**Status:** Fully Integrated & Production-Ready

**Package:** `pinata-web3` (v0.5.4)

**Why Pinata?**
Raw IPFS has challenges (unpinning, gateway reliability, complex APIs). Pinata solves this with:
-  Permanent content pinning
-  Global CDN gateway (fast worldwide access)
-  Simple SDK for uploads
-  Metadata tagging & searchability

**Implementation:**

```typescript
// Story Upload API (app/api/ipfs/upload/route.ts)
import { PinataSDK } from "pinata-web3"

const pinata = new PinataSDK({ pinataJwt: process.env.PINATA_JWT! })

export async function POST(request: Request) {
  const storyData = await request.json()
  
  const upload = await pinata.upload.json(storyData).addMetadata({
    name: `Story: ${storyData.title}`,
    keyValues: { author: storyData.author, category: storyData.category }
  })
  
  return Response.json({ success: true, cid: upload.IpfsHash })
}
```

**Data Flow:**
```
Write Story → Upload to Pinata → Get CID → Store CID on-chain → Readers fetch from Pinata gateway
```

---

###  Privy (Authentication & Wallet Management)

**Status:**  Fully Integrated with Embedded Wallets

**Package:** `@privy-io/react-auth` (v3.3.0)

**Why Privy?**
Traditional Web3 onboarding is the #1 adoption barrier (MetaMask installation, seed phrases, gas fees). Privy enables:
-  Social logins (Google, Twitter, Email)
-  Embedded wallets (no MetaMask needed!)
-  Progressive Web3 onboarding
-  Familiar Web2 UX with Web3 benefits

**Implementation:**

```typescript
// app/privyProvider.tsx
import { PrivyProvider } from '@privy-io/react-auth'

export default function PrivyProviderWrapper({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Magic! ✨
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
```

**User Journey:**
```
Click "Sign Up" → Choose Google → Privy creates wallet automatically → User mints NFTs (without knowing it's Web3!)
```

**Impact:** 10x easier onboarding than traditional Web3 apps

---

###  Ethereum (Blockchain Layer)

**Network:** Sepolia Testnet (Chain ID: 11155111)  
**Integration:** Ethers.js v6.15.0 for blockchain interactions

**Why Ethereum?**
- Industry-standard smart contract platform
- Mature tooling (Foundry, Ethers.js)
- ERC-721 NFT standard
- Transparent, immutable history

---

##  Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     QuillNode Platform                       │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
     ┌──────────┐      ┌──────────┐     ┌──────────┐
     │ Frontend │◄────►│  APIs    │◄───►│Blockchain│
     │ Next.js  │      │ (Pinata) │     │ Sepolia  │
     └──────────┘      └──────────┘     └──────────┘
          │                  │                 │
          └──────────────────┼─────────────────┘
                             ▼
                      ┌──────────┐
                      │  Privy   │
                      │ + IPFS   │
                      └──────────┘
```

### Smart Contract Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  StoryNFT   │◄────►│ Reputation   │◄────►│ Plagiarism  │
│ (ERC-721)   │      │   System     │      │    Court    │
└─────────────┘      └──────────────┘      └─────────────┘
      │                     │                      │
      ▼                     ▼                      ▼
Mint Stories          Track XP/Levels      Voting & Disputes
Store CID             Reputation Score     Stake Distribution
```

---

## Smart Contracts

### 1. StoryNFT.sol
**Purpose:** Core NFT contract for story ownership

**Key Functions:**
```solidity
// Mint new story as NFT
function mintStory(string memory ipfsCID, string memory title, 
                   string memory category, bool isPremium) 
    external returns (uint256 tokenId)

// Get story metadata
function getStoryMetadata(uint256 tokenId) 
    external view returns (StoryMetadata memory)

// List all stories (paginated)
function getAllStories(uint256 offset, uint256 limit) 
    external view returns (StoryMetadata[] memory)
```


---

### 2. ReputationSystem.sol
**Purpose:** Track author XP, levels, and reputation

**Key Functions:**
```solidity
// Add XP to user
function addXP(address user, uint256 amount) external onlyAuthorized

// Reduce XP (plagiarism penalty)
function reduceXP(address user, uint256 amount) external onlyAuthorized

// Get user's reputation
function getReputation(address user) 
    external view returns (uint256 xp, uint256 level)
```

**XP Rules:**
- Mint story: +50 XP
- Win plagiarism dispute: +20 XP
- Lose plagiarism dispute: -100 XP
- Level Up: Every 100 XP


---

### 3. PlagiarismCourt.sol
**Purpose:** Decentralized dispute resolution

**Key Functions:**
```solidity
// Report plagiarism (requires 0.001-0.5 ETH stake)
function reportPlagiarism(uint256 tokenId, string memory proofHash) 
    external payable

// Vote on report (free, one vote per address)
function vote(uint256 tokenId, uint256 reportIndex, bool voteYes) 
    external

// Finalize after 24h voting period
function finalizeReport(uint256 tokenId, uint256 reportIndex) 
    external
```

**Economics:**
- Reporter wins: 60% stake back + 40% from author
- Reporter loses: Loses entire stake → distributed to voters
- 24-hour community voting period



---

##  Tech Stack

**Frontend:** Next.js 15.2.4 • React 18.3.1 • TypeScript 5 • Tailwind CSS 4 • shadcn/ui  
**Backend:** Next.js API Routes • Pinata SDK  
**Blockchain:** Solidity 0.8.28 • Foundry • Ethers.js 6.15.0 • OpenZeppelin  
**Authentication:** Privy 3.3.0 • MetaMask  
**Storage:** IPFS via Pinata  
**Interoperability:** Avail Nexus SDK

---

##  Setup & Installation

### Prerequisites
- Node.js 18+, npm, Git
- MetaMask browser extension

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ParthSinghPS/QuillNode_ETHon-25.git
cd QuillNode_ETHon-25

# 2. Install dependencies
npm install

# 3. Create .env.local file
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_STORY_NFT_ADDRESS=0x82018421063d7c0eFE8a362638bF0D35bA7C0C0d
NEXT_PUBLIC_REPUTATION_SYSTEM_ADDRESS=0x96AAB2B7C4cAdFbc0bf8fE784eB093aaEa4a53B2
NEXT_PUBLIC_PLAGIARISM_COURT_ADDRESS=0xfbe38a67F463d989E1b7398578dE52E8FbE5c7e5
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo

# 4. Run development server
npm run dev
```

**Get API Keys:**
- **Privy:** [privy.io](https://privy.io)
- **Pinata:** [pinata.cloud](https://pinata.cloud)

**MetaMask Setup:**
1. Add Sepolia Testnet
2. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
3. Connect to QuillNode

---

##  Why QuillNode Matters

**For Authors:**  
 True ownership •  No platform fees •  Verifiable reputation •  Censorship-resistant

**For Readers:**  
 Permanent library •  Privacy-first •  Community governance •  Collectible stories

**For the Ecosystem:**  
 Open protocol •  Composable •  Transparent •  Scalable

---

## Acknowledgments

Special thanks to **Avail**, **Pinata**, **Privy**, **Ethereum Foundation**, **OpenZeppelin**, and **Foundry** for making this project possible.



<div align="center">

Built with ❤️ by Team eTheRealSteel:

- **P S S Darshan**  - **Parth Singh**   - **Ayush Verma**


</div>
