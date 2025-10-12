"use client"

import { useState } from "react"
import useSWR from "swr"
import { useDebounce } from "@/hooks/use-debounce"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SearchInput() {
  const [q, setQ] = useState("")
  const dq = useDebounce(q, 250)
  const { data = [] } = useSWR(dq ? `/api/search?q=${encodeURIComponent(dq)}` : null, fetcher)

  return (
    <div className="relative w-full">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories, authors, tags" />
      {dq && data.length > 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-md border bg-popover p-2">
          <div className="max-h-64 overflow-auto">
            {data.map((s: any) => (
              <Link key={s.id} href={`/story/${s.id}`} className="block px-2 py-1.5 rounded hover:bg-accent">
                <div className="text-sm">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.author}</div>
              </Link>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {/* TODO: Replace mock API with IPFS fetch for search suggestions */}
            Searching mock dataset. // TODO: Add IPFS fetching logic here
          </div>
        </div>
      )}
    </div>
  )
}
