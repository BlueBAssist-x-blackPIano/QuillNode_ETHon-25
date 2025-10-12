"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/data/stories"

export default function WritePage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Add IPFS upload + on-chain storage (Avail Nexus/DA)
    alert("Story submission placeholder. // TODO: upload to IPFS + write metadata on-chain")
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Create a New Story</h1>
      <form onSubmit={handleSubmit} className="grid gap-5 max-w-3xl">
        <div className="grid gap-2">
          <Label htmlFor="cover">Cover Image URL</Label>
          <Input id="cover" placeholder="https://..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" rows={5} />
        </div>
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select>
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
            <Label>Tags (comma separated)</Label>
            <Input placeholder="romance, adventure" />
          </div>
          <div className="grid gap-2">
            <Label>Language</Label>
            <Input defaultValue="English" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Target Audience (age)</Label>
            <Input placeholder="13+" />
          </div>
          <div className="grid gap-2">
            <Label>Premium</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Is this premium?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
          {loading ? "Submitting..." : "Submit"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {/* TODO: Add copyright, rating (mature), and characters fields to the form, and persist to IPFS */}
          This is a hackathon-ready form. // TODO: extend with full metadata and persistence
        </p>
      </form>
    </main>
  )
}
