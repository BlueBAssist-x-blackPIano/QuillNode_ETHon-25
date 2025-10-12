import { type NextRequest, NextResponse } from "next/server"
import { stories } from "@/data/stories"

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase().trim()
  const results = !q
    ? []
    : stories.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      )
  return NextResponse.json(results.slice(0, 8))
}
