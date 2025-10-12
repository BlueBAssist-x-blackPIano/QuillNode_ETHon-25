import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { shortenText } from "@/utils/shorten-text"

export function StoryCard({ story, compact = false }: { story: any; compact?: boolean }) {
  return (
    <Link href={`/story/${story.id}`} className="group">
      <Card className={cn("overflow-hidden")}>
        <div className={cn("relative w-full", compact ? "aspect-[3/4]" : "aspect-[3/4]")}>
          <Image
            alt={`${story.title} cover`}
            src={story.cover || "/placeholder.svg"}
            fill
            className="object-cover transition-transform group-hover:scale-[1.03]"
          />
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium leading-tight">{shortenText(story.title, 48)}</h3>
          <p className="text-xs text-muted-foreground">{shortenText(story.author, 40)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
