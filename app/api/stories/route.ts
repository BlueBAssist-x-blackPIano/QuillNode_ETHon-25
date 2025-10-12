import { NextResponse } from "next/server"
import { stories } from "@/data/stories"

export async function GET() {
  return NextResponse.json(stories)
}
