"use client"

import useSWR from "swr"
import { StoryCard } from "./story-card"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AllTimeHits() {
  const { data, isLoading } = useSWR("/api/stories", fetcher)

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">All-Time Hits</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All-Time Hits</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((story: any) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}
