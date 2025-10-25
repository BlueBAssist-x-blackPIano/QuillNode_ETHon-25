import { NextRequest, NextResponse } from "next/server"
import { PinataSDK } from "pinata-web3"

// Pinata will initialize here
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
})

export async function POST(request: NextRequest) {
  try {
    // take the story
    const storyData = await request.json()

    // Validate required fields
    if (!storyData.title || !storyData.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // metadata will be created here
    const metadata = {
      name: `${storyData.title} - QuillNode Story`,
      keyvalues: {
        author: storyData.author || "Anonymous",
        category: storyData.category || "Uncategorized",
        timestamp: new Date().toISOString(),
        platform: "QuillNode",
      },
    }
    console.log("Uploading")
    // Uploading to IPFS
    const upload = await pinata.upload.json(storyData).addMetadata(metadata)

    console.log("IPFS Upload Success:", upload)

    // Return the CID
    return NextResponse.json({
      success: true,
      cid: upload.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
      timestamp: new Date().toISOString(),
      message: "Story successfully uploaded to IPFS",
    })
  } catch (error: any) {
    console.error("IPFS Upload Error:", error)
    return NextResponse.json(
      { error: "Failed to upload to IPFS", details: error.message },
      { status: 500 }
    )
  }
}