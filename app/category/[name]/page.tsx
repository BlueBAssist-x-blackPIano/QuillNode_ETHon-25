import { getStoriesByCategory } from "@/data/stories"
import { StoryCard } from "@/components/site/story-card"

export default function CategoryPage({ params }: { params: { name: string } }) {
  const stories = getStoriesByCategory(decodeURIComponent(params.name))
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Category: {decodeURIComponent(params.name)}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </main>
  )
}
