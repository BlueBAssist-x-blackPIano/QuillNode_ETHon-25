import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto px-4 py-8 grid gap-4 md:flex md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wattpad on Chain. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <Link className="text-sm hover:underline" href="https://twitter.com" target="_blank" rel="noreferrer">
            Twitter
          </Link>
          <Link className="text-sm hover:underline" href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </Link>
          <Link className="text-sm hover:underline" href="https://discord.com" target="_blank" rel="noreferrer">
            Discord
          </Link>
          <Link className="text-sm hover:underline" href="/support">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  )
}
