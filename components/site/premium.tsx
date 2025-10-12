"use client"

import { useUser } from "@/context/user-context"
import { StoryCard } from "./story-card"
import useSWR from "swr"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PremiumSection() {
  const { isPremium } = useUser()
  const { data = [] } = useSWR("/api/stories", fetcher)

  if (!isPremium) {
    return (
      <div className="rounded-lg border p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Premium Stories</h2>
        <p className="text-muted-foreground mb-4">Unlock exclusive stories and advanced filters with Premium.</p>
        <Link href="/premium">
          <Button className="bg-primary text-primary-foreground">Go Premium</Button>
        </Link>
      </div>
    )
  }

  // Show only premium stories
  const premiumStories = data.filter((s: any) => s.premium)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Premium Stories</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {premiumStories.map((story: any) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}
