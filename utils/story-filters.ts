export function filterByCategory(stories: any[], category?: string) {
  if (!category) return stories
  return stories.filter((s) => s.category === category)
}
