export type Story = {
  id: string
  title: string
  author: string
  description: string
  category: string
  tags: string[]
  premium: boolean
  cover: string
}

export const categories = ["Romance", "Fantasy", "Adventure", "Mystery", "Horror", "Sci-Fi", "Drama", "Comedy"]

export const stories: Story[] = [
  {
    id: "1",
    title: "Whispers of the Ember City",
    author: "A. K. Moreno",
    description: "In a city fueled by embers, a courier discovers a conspiracy that could extinguish its last light.",
    category: "Fantasy",
    tags: ["magic", "city", "conspiracy"],
    premium: false,
    cover: "/fantasy-book-cover.png",
  },
  {
    id: "2",
    title: "Letters from the Edge of Tomorrow",
    author: "Naomi Park",
    description: "Time-bent letters reconnect two strangers across decades as they unravel a paradox.",
    category: "Sci-Fi",
    tags: ["time", "romance"],
    premium: true,
    cover: "/sci-fi-book-cover.png",
  },
  {
    id: "3",
    title: "The Last Library",
    author: "Hassan El-Fayed",
    description: "A young archivist must protect the remnants of human stories from a regime that forgets by force.",
    category: "Drama",
    tags: ["dystopia", "books"],
    premium: false,
    cover: "/drama-book-cover.jpg",
  },
  {
    id: "4",
    title: "Midnight Bargains",
    author: "C. W. Lark",
    description: "A deal with a night market broker spirals into a web of debts and desires.",
    category: "Romance",
    tags: ["market", "deal"],
    premium: true,
    cover: "/romance-book-cover.png",
  },
  {
    id: "5",
    title: "The Painted Door",
    author: "Evelyn Cho",
    description: "A muralist discovers her art is a portal to places she’s only dreamed of.",
    category: "Adventure",
    tags: ["portal", "art"],
    premium: false,
    cover: "/adventure-book-cover.png",
  },
  {
    id: "6",
    title: "Shadow Ledger",
    author: "Raj Mehta",
    description: "An accountant turned sleuth tracks missing millions through a labyrinth of shell companies.",
    category: "Mystery",
    tags: ["crime", "finance"],
    premium: false,
    cover: "/mystery-book-cover.png",
  },
  {
    id: "7",
    title: "Echoes in the Pines",
    author: "Mira Valdez",
    description: "Hikers vanish in a forest that remembers more than it should.",
    category: "Horror",
    tags: ["forest", "missing"],
    premium: true,
    cover: "/horror-book-cover.png",
  },
  {
    id: "8",
    title: "Stage Left",
    author: "Jonah Rees",
    description: "A washed-up comedian finds a second act in the unlikeliest of clubs.",
    category: "Comedy",
    tags: ["comedy", "redemption"],
    premium: false,
    cover: "/comedy-book-cover.jpg",
  },
]

export function getStoryById(id: string) {
  return stories.find((s) => s.id === id)
}

export function getStoriesByCategory(name: string) {
  return stories.filter((s) => s.category.toLowerCase() === name.toLowerCase())
}
