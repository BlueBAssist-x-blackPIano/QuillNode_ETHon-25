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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { categories } from "@/data/stories"
import { SearchInput } from "./search-input"
import { useUser } from "@/context/user-context"
import { LogIn, UserPlus, LogOut, Wallet } from 'lucide-react'

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
  // NOTE: Ensure useUser provides all these properties/functions
  const { isConnected, connectWallet, disconnectWallet, address } = useUser()

  // Helper to format the wallet address for display in the "Connected" state
  const displayAddress = address ? `${address.substring(0, 6)}...` : 'Wallet';

  const handleWalletAction = () => {
    if (isConnected && disconnectWallet) {
      // If connected, attempt to disconnect
      disconnectWallet();
    } else {
      // If not connected, attempt to connect
      connectWallet();
    }
  }

  // The main button that triggers the dropdown
  const triggerButton = isConnected ? (
    <Button variant="outline" className="flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        {displayAddress}
    </Button>
  ) : (
    <Button className="bg-primary text-primary-foreground">
        Sign Up
    </Button>
  );

  return (
    <DropdownMenu>
      {/* 1. Dropdown Trigger: The primary header button */}
      <DropdownMenuTrigger asChild>
        {triggerButton}
      </DropdownMenuTrigger>
      
      {/* 2. Dropdown Content: The menu with options */}
      <DropdownMenuContent className="w-56" align="end">
        
        {/* Option 1: Sign Up/In with Email (Navigates to Signup Page) */}
        <Link href="/signup" passHref>
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign Up/In with Email
          </DropdownMenuItem>
        </Link>

        {/* Separator for visual grouping */}
        <DropdownMenuSeparator />

        {/* Option 2: Connect/Disconnect Wallet */}
        <DropdownMenuItem 
          onClick={handleWalletAction}
          className={`cursor-pointer flex items-center gap-2 ${isConnected ? 'text-red-600' : 'text-primary'}`}
        >
          {isConnected ? (
            <>
              <LogOut className="w-4 h-4" />
              Disconnect Wallet
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect Metamask
            </>
          )}
        </DropdownMenuItem>
        
        {/* Display connected address if wallet is active */}
        {isConnected && (
            <DropdownMenuItem className="text-xs text-muted-foreground break-words pointer-events-none">
              <span className="font-semibold mr-1">Active:</span> {address}
            </DropdownMenuItem>
        )}
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function MobileMenu({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return null
}
