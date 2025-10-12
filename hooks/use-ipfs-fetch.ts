"use client"

export function useIPFSFetch<T = any>(cidOrUrl: string | null) {
  // TODO: Add IPFS fetch logic (e.g., via ipfs.io gateway or Helia client)
  // For now, return null and rely on /api routes + mock data
  return { data: null as T | null, isLoading: false, error: null as any }
}
