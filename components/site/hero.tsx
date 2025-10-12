import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-balance text-4xl md:text-5xl font-semibold">
          Come for the story. Stay for the connection.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Discover original stories from writers around the world. Explore trending tales and timeless hits.
        </p>
        <div className="mt-6">
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
