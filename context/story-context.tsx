"use client"

import type React from "react"

import { createContext, useContext, useMemo, useState } from "react"
import { stories as initialStories, categories as initialCategories } from "@/data/stories"

type StoryContextType = {
  stories: any[]
  categories: string[]
  filters: { category?: string }
  setFilters: (f: { category?: string }) => void
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<{ category?: string }>({})
  const value = useMemo(
    () => ({
      stories: initialStories,
      categories: initialCategories,
      filters,
      setFilters,
    }),
    [filters],
  )
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
}

export function useStories() {
  const ctx = useContext(StoryContext)
  if (!ctx) throw new Error("useStories must be used within StoryProvider")
  return ctx
}
