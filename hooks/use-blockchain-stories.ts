"use client"

import { useEffect, useState } from "react"
import { getAllStoriesFromChain } from "@/lib/contract"

export function useBlockchainStories() {
  const [stories, setStories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true)
      try {
        const chainStories = await getAllStoriesFromChain(0, 100)
        setStories(chainStories)
        console.log(`Loaded ${chainStories.length} stories from blockchain`)
      } catch (err: any) {
        console.error("Error loading stories:", err)
        setError(err)
        setStories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [])

  const refresh = async () => {
    const chainStories = await getAllStoriesFromChain(0, 100)
    setStories(chainStories)
  }

  return { stories, isLoading, error, refresh }
}