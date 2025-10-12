"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { categories } from "@/data/stories"
import { SearchInput } from "./search-input"
import { useUser } from "@/context/user-context"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { isConnected } = useUser()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu open={open} setOpen={setOpen} />
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder-logo.svg" alt="Logo" width={28} height={28} />
            <span className="font-semibold">Wattpad on Chain</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:inline-flex">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Browse</DropdownMenuLabel>
              {categories.map((c) => (
                <Link key={c} href={`/category/${encodeURIComponent(c)}`}>
                  <DropdownMenuItem className="cursor-pointer">{c}</DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl mx-4">
          <SearchInput />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <WriteMenu />
          <Link href="/premium">
            <Button className="bg-primary text-primary-foreground">Try Premium</Button>
          </Link>
          <AuthButtons />
        </div>
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-3">
                <SearchInput />
                <Link onClick={() => setOpen(false)} href="/premium" className="underline">
                  Try Premium
                </Link>
                <WriteMenu inline />
                <div>
                  <AuthButtons />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mt-6">Categories</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((c) => (
                      <Link
                        key={c}
                        onClick={() => setOpen(false)}
                        href={`/category/${encodeURIComponent(c)}`}
                        className="text-sm hover:underline"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function WriteMenu({ inline = false }: { inline?: boolean }) {
  // simple links; could be dropdown on desktop:
  const content = (
    <div className="flex items-center gap-2">
      <Link href="/write">
        <Button variant="secondary">Create Story</Button>
      </Link>
      <Link href="/signup">
        <Button variant="ghost">My Stories</Button>
      </Link>
    </div>
  )
  if (inline) return content
  return content
}

function AuthButtons() {
  const { isConnected, connectWallet } = useUser()
  if (isConnected) return <Button variant="outline">Connected</Button>
  return (
    <div className="flex items-center gap-2">
      <Link href="/signup">
        <Button variant="outline">Sign Up</Button>
      </Link>
      <Button className="bg-primary text-primary-foreground" onClick={connectWallet}>
        Connect
      </Button>
    </div>
  )
}

function MobileMenu({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return null
}
