export function shortenText(s: string, max = 80) {
  if (s.length <= max) return s
  return s.slice(0, max - 1) + "…"
}
