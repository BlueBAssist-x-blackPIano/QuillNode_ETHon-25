import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getStoryById } from "@/data/stories"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = getStoryById(params.id)
  if (!story) return notFound()

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border">
            <Image
              alt={`${story.title} cover`}
              src={story.cover || "/placeholder.svg"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-semibold">{story.title}</h1>
          <p className="text-sm text-muted-foreground">by {story.author}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{story.category}</Badge>
            {story.tags.map((t) => (
              <Badge key={t} className="bg-accent text-accent-foreground">
                {t}
              </Badge>
            ))}
          </div>
          <p className="leading-relaxed">{story.description}</p>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary">Like</Button>
            <Button variant="secondary">Comment</Button>
            <Button className="bg-primary text-primary-foreground">Add to Library</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {/* TODO: Add IPFS fetch logic for full content; currently serving metadata only */}
            Content stored via IPFS placeholder. // TODO: integrate IPFS fetch with Avail DA
          </p>
          <Link href="/" className="text-sm underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
