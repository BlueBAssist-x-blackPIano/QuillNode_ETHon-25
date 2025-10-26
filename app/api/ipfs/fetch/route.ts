import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cid = searchParams.get("cid")

    if (!cid) {
      return NextResponse.json(
        { error: "CID parameter is required" },
        { status: 400 }
      )
    }
    console.log("Fetching ", cid)
    // Fetch from Pinata gateway
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`
    const response = await fetch(gatewayUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("IPFS Fetch successful")

    return NextResponse.json({
      success: true,
      data,
      cid,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("IPFS Fetch Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch from IPFS", details: error.message|| "Unknown error" },
      { status: 500 }
    )
  }
}