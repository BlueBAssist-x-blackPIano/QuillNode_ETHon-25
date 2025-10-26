import { ethers } from "ethers"
import { CONTRACTS, CHAIN_CONFIG } from "./contracts/addresses"
import StoryNFTABI from "./contracts/StoryNFT.json"
import ReputationSystemABI from "./contracts/ReputationSystem.json"
import PlagiarismCourtABI from "./contracts/PlagiarismCount.json"

// Get StoryNFT contract instance
export function getStoryNFTContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    CONTRACTS.STORY_NFT,
    StoryNFTABI.abi,
    signerOrProvider
  )
}

// Get provider
export function getProvider() {
  return new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl)
}

// this is to get signer from MetaMask
export async function getSigner() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask not installed")
  }
  
  const provider = new ethers.BrowserProvider((window as any).ethereum)
  await provider.send("eth_requestAccounts", [])
  return provider.getSigner()
}

// Mints story
export async function mintStoryNFT(
  signer: ethers.Signer,
  ipfsCID: string,
  title: string,
  category: string,
  isPremium: boolean
) {
  const contract = getStoryNFTContract(signer)
  
  console.log("Minting Story NFT")
  const tx = await contract.mintStory(ipfsCID, title, category, isPremium)
  
  console.log("Waiting for confirmation")
  const receipt = await tx.wait()
  
  // Find the StoryMinted event to get token ID
  const event = receipt.logs.find((log: any) => {
    try {
      const parsed = contract.interface.parseLog(log)
      return parsed?.name === "StoryMinted"
    } catch {
      return false
    }
  })
  
  let tokenId = 0
  if (event) {
    const parsed = contract.interface.parseLog(event)
    tokenId = Number(parsed?.args.tokenId || 0)
  }
  
  console.log("Story NFT minted! Token ID:", tokenId)
  
  return {
    tokenId,
    txHash: receipt.hash,
    blockExplorer: `${CHAIN_CONFIG.blockExplorer}/tx/${receipt.hash}`
  }
}

// Get all stories from blockchain
export async function getAllStoriesFromChain(offset = 0, limit = 100) {
  const provider = getProvider()
  const contract = getStoryNFTContract(provider)
  
  try {
    const totalSupply = await contract.totalSupply()
    const total = Number(totalSupply)
    
    if (total === 0) return []
    
    // Adjust limit if it exceeds total
    const actualLimit = Math.min(limit, total - offset)
    if (actualLimit <= 0) return []
    
    const stories = await contract.getAllStories(offset, actualLimit)
    
    return stories.map((story: any) => ({
      id: `nft-${story.tokenId}`,
      tokenId: Number(story.tokenId),
      ipfsCID: story.ipfsCID,
      title: story.title,
      category: story.category,
      author: story.author,
      isPremium: story.isPremium,
      premium: story.isPremium,
      timestamp: new Date(Number(story.timestamp) * 1000).toISOString(),
      cover: "/placeholder.svg",
      description: "Stored on blockchain as NFT - Click to read from IPFS",
      tags: [story.category]
    }))
  } catch (error) {
    console.error("Error fetching stories:", error)
    return []
  }
}


export async function getStoryByTokenId(tokenId: number) {
  const provider = getProvider()
  const contract = getStoryNFTContract(provider)
  
  const metadata = await contract.getStoryMetadata(tokenId)
  const owner = await contract.ownerOf(tokenId)
  
  return {
    tokenId,
    ipfsCID: metadata.ipfsCID,
    title: metadata.title,
    category: metadata.category,
    isPremium: metadata.isPremium,
    timestamp: new Date(Number(metadata.timestamp) * 1000).toISOString(),
    author: owner
  }
}
export async function getUserReputation(userAddress: string): Promise<{ xp: number; level: number }> {
  try {
    const provider = getProvider()
    const contract = new ethers.Contract(
      CONTRACTS.REPUTATION_SYSTEM,
      ReputationSystemABI.abi,
      provider
    )
    
    const [xp, level] = await contract.getReputation(userAddress)
    
    return {
      xp: Number(xp),
      level: Number(level)
    }
  } catch (error) {
    console.error("Error fetching reputation:", error)
    throw error
  }
}
export async function getPlagiarismReportCount(tokenId: number): Promise<number> {
  try {
    const provider = getProvider()
    const contract = new ethers.Contract(
      CONTRACTS.PLAGIARISM_COURT,
      PlagiarismCourtABI.abi,
      provider
    )
    
    const count = await contract.getReportCount(tokenId)
    return Number(count)
  } catch (error) {
    console.error("Error fetching plagiarism reports:", error)
    return 0
  }
}