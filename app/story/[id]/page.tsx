"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getStoryById } from "@/data/stories"
import { getStoryByTokenId } from "@/lib/contract"
import { useIPFSFetch } from "@/hooks/use-ipfs-fetch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink } from "lucide-react"

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const isNFT = params.id.startsWith("nft-")
  const tokenId = isNFT ? parseInt(params.id.replace("nft-", "")) : null
  
  const { data: ipfsData, isLoading: ipfsLoading } = useIPFSFetch(
    story?.ipfsCID || null
  )

  useEffect(() => {
    const loadStory = async () => {
      if (isNFT && tokenId !== null) {
        try {
          const nftStory = await getStoryByTokenId(tokenId)
          setStory(nftStory)
        } catch (error) {
          console.error("Error loading NFT story:", error)
        }
      } else {
        const mockStory = getStoryById(params.id)
        setStory(mockStory)
      }
      setIsLoading(false)
    }
    
    loadStory()
  }, [params.id, isNFT, tokenId])

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </main>
    )
  }

  if (!story) return notFound()

  return (
    <main className="container mx-auto px-4 py-10">
      {isNFT && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            🎨 Story NFT #{tokenId}
          </Badge>
          <a 
            href={`https://sepolia.etherscan.io/token/0x82018421063d7c0eFE8a362638bF0D35bA7C0C0d?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            View on Etherscan
          </a>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border">
            <Image
              alt={story.title}
              src={story.cover || "/placeholder.svg"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-semibold">{story.title}</h1>
          <p className="text-sm text-muted-foreground">
            by {story.author || "Anonymous"}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{story.category}</Badge>
            {story.tags?.map((t: string) => (
              <Badge key={t} className="bg-accent text-accent-foreground">{t}</Badge>
            ))}
            {story.isPremium && <Badge className="bg-yellow-500">Premium</Badge>}
          </div>

          <p className="leading-relaxed">{story.description}</p>

          {isNFT && ipfsData && (
            <div className="p-6 bg-muted rounded-lg border-2">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                📖 Full Story Content
                {ipfsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </h2>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {ipfsData.content || "Loading from IPFS..."}
              </div>
            </div>
          )}

          {isNFT && story.ipfsCID && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                IPFS CID: 
                <code className="ml-2 bg-muted px-2 py-1 rounded">{story.ipfsCID}</code>
              </p>
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${story.ipfsCID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-primary"
              >
                <ExternalLink className="w-3 h-3" />
                View on IPFS Gateway
              </a>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="secondary">Like</Button>
            <Button variant="secondary">Comment</Button>
            <Button className="bg-primary text-primary-foreground">
              Add to Library
            </Button>
          </div>

          <Link href="/" className="text-sm underline inline-block mt-4">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}