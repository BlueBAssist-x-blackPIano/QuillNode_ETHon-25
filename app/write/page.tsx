"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/data/stories"
import { toast } from "sonner"
import { ExternalLink, Copy, CheckCircle } from "lucide-react"

export default function WritePage() {
  const [loading, setLoading] = useState(false)
  const [ipfsCid, setIpfsCid] = useState<string | null>(null)
  const [category, setCategory] = useState<string>("")
  const [premium, setPremium] = useState<string>("false")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("CID copied to clipboard!")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // TODO: on-chain storage (Avail Nexus/DA)
    alert("Story submission placeholder. //upload to IPFS(done) + write metadata on-chain(TODO)")
    
    setIpfsCid(null)

    try {
      // Get form data
      const formData = new FormData(e.currentTarget)
      
      const storyData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        author: formData.get("author") as string || "Anonymous",
        category: category || "Uncategorized",
        tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
        cover: formData.get("cover") as string || "/placeholder.svg",
        language: formData.get("language") as string || "English",
        targetAge: formData.get("targetAge") as string || "13+",
        premium: premium === "true",
        createdAt: new Date().toISOString(),
      }

      // Validate required fields
      if (!storyData.title || !storyData.content) {
        toast.error("Title and content are required!")
        setLoading(false)
        return
      }

      console.log("Uploading story", storyData.title)

      // Upload to IPFS via our API route
      const response = await fetch("/api/ipfs/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      // Success!
      setIpfsCid(result.cid)
      toast.success("Story uploaded successfully!")
      
      console.log("Upload Result:", result)
      
      // TODO: Next step - Store CID on blockchain
      // For now, the story is permanently on IPFS!

    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload story")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Create a New Story</h1>
      <p className="text-muted-foreground mb-6">
        Your story will be uploaded to IPFS (decentralized storage) and stored permanently.
      </p>
      
      {ipfsCid && (
        <div className="mb-6 p-6 bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-bold text-green-800 dark:text-green-200 text-lg mb-2">
                Story Uploaded Successfully!
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                    Content Identifier (CID):
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-green-100 dark:bg-green-900 px-3 py-2 rounded text-sm font-mono break-all">
                      {ipfsCid}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(ipfsCid)}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-300 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Pinata Gateway
                  </a>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                   <strong>Next step:</strong> Store this CID on the blockchain to enable readers to find your story!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5 max-w-3xl">
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="Enter your story title"
            required 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="author">Author Name</Label>
          <Input 
            id="author" 
            name="author" 
            placeholder="Your name (or leave blank for Anonymous)" 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            rows={3}
            placeholder="A brief summary of your story (optional)"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="content">Story Content *</Label>
          <Textarea 
            id="content" 
            name="content" 
            rows={12} 
            required 
            placeholder="Write your story here... This will be stored on IPFS forever!"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Your story content will be permanently stored on the decentralized storage.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cover">Cover Image URL</Label>
          <Input 
            id="cover" 
            name="cover" 
            placeholder="https://... (optional, will use default if empty)" 
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags"
              name="tags" 
              placeholder="romance, adventure, magic" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Input 
              id="language"
              name="language" 
              defaultValue="English" 
            />
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="targetAge">Target Audience (age)</Label>
            <Input 
              id="targetAge"
              name="targetAge" 
              placeholder="13+" 
            />
          </div>
          <div className="grid gap-2">
            <Label>Premium Content</Label>
            <Select value={premium} onValueChange={setPremium}>
              <SelectTrigger>
                <SelectValue placeholder="Is this premium?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Free (Public)</SelectItem>
                <SelectItem value="true">Premium (Paid)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || !category} 
          className="bg-primary text-primary-foreground text-lg py-6"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Uploading...
            </>
          ) : (
            <>
              Publish 
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          By publishing, your story will be permanently stored on the decentralized storage and your story becomes immutable.
          <br />
          Once uploaded, it cannot be deleted or modified.
        </p>
      </form>
    </main>
  )
}