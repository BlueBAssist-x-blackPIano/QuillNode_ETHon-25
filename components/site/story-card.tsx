"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { shortenText } from "@/utils/shorten-text"
import { ExternalLink, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { getPlagiarismReportCount } from "@/lib/contract"

export function StoryCard({ story, compact = false }: { story: any; compact?: boolean }) {
  const [reportCount, setReportCount] = useState<number>(0)
  const isNFT = story.id?.toString().startsWith("nft-")
  const tokenId = isNFT ? parseInt(story.id.replace("nft-", "")) : null

  useEffect(() => {
    if (isNFT && tokenId !== null) {
      getPlagiarismReportCount(tokenId)
        .then(count => setReportCount(count))
        .catch(() => setReportCount(0))
    }
  }, [isNFT, tokenId])

  return (
    <Link href={`/story/${story.id}`} className="group">
      <Card className={cn("overflow-hidden")}>
        <div className={cn("relative w-full", compact ? "aspect-[3/4]" : "aspect-[3/4]")}>
          <Image
            alt={`${story.title} cover`}
            src={story.cover || "/placeholder.svg"}
            fill
            className="object-cover transition-transform group-hover:scale-[1.03]"
          />
          {isNFT && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">NFT</Badge>
            </div>
          )}
          {reportCount > 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {reportCount} Report{reportCount > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium leading-tight">{shortenText(story.title, 48)}</h3>
          <p className="text-xs text-muted-foreground">{shortenText(story.author, 40)}</p>
          {isNFT && tokenId !== null && (
            <a
              href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_STORY_NFT_ADDRESS}?a=${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              View on Etherscan
            </a>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}