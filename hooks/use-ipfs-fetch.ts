"use client"

import { useEffect, useState } from "react"

interface IPFSFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export function useIPFSFetch<T = any>(cid: string | null): IPFSFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Reset state if no CID provided
    if (!cid) {
      setData(null)
      setIsLoading(false)
      setError(null)
      return
    }

    const fetchFromIPFS = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/ipfs/fetch?cid=${encodeURIComponent(cid)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch from IPFS")
        }

        setData(result.data as T)
      } catch (err: any) {
        console.error("IPFS fetch error:", err)
        setError(err instanceof Error ? err : new Error(err.message))
      } finally {
        setIsLoading(false)
      }
    }

    fetchFromIPFS()
  }, [cid])

  return { data, isLoading, error }
}