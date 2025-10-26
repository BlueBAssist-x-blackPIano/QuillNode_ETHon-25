"use client"

import { Hero } from "@/components/site/hero"
import { TrendingStories } from "@/components/site/trending"
import { AllTimeHits } from "@/components/site/all-time-hits"
import { PremiumSection } from "@/components/site/premium"
import { useBlockchainStories } from "@/hooks/use-blockchain-stories"
import { StoryCard } from "@/components/site/story-card"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { stories, isLoading, refresh } = useBlockchainStories()

  return (
    <main className="min-h-screen">
      <Hero />
      
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Stories on Blockchain are now your NFTs</h2>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {!isLoading && <span className="text-sm text-muted-foreground">{stories.length} stories</span>}
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading stories from blockchain</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-lg mb-4">No stories published yet</p>
            <p className="text-muted-foreground mb-6">
              Be the first to publish a story as an NFT on blockchain!
            </p>
            <a href="/write">
              <Button className="bg-primary text-primary-foreground">
                Publish Your Story →
              </Button>
            </a>
          </div>
        )}
      </section>
      
      <section className="container mx-auto px-4 py-10">
        <TrendingStories />
      </section>
      <section className="container mx-auto px-4 py-10">
        <AllTimeHits />
      </section>
      <section className="container mx-auto px-4 py-10">
        <PremiumSection />
      </section>
    </main>
  )
}