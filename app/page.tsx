import { Hero } from "@/components/site/hero"
import { TrendingStories } from "@/components/site/trending"
import { AllTimeHits } from "@/components/site/all-time-hits"
import { PremiumSection } from "@/components/site/premium"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <section className="container mx-auto px-4 py-10">
        <TrendingStories />
      </section>
      <section className="container mx-auto px-4 py-10">
        <AllTimeHits />
      </section>
      <section className="container mx-auto px-4 py-10">
        <PremiumSection />
      </section>
    </main>
  )
}
