"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { StoryCard } from "./story-card"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TrendingStories() {
  const { data, isLoading } = useSWR("/api/stories", fetcher)

  const trending = useMemo(() => {
    if (!data) return []
    return data.slice(0, 8)
  }, [data])

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-36 rounded-md" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Trending</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {trending.map((story: any) => (
          <div key={story.id} className="shrink-0 w-40">
            <StoryCard story={story} compact />
          </div>
        ))}
      </div>
    </div>
  )
}
