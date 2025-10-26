import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto px-4 py-8">
        {/* Copyright and Powered By Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wattpad on Chain. All rights reserved.
          </p>
          
          {/* Powered By Section */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold">Powered by</span>
            <a 
              href="https://availproject.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline flex items-center gap-1"
            >
              Avail <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a 
              href="https://pinata.cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline flex items-center gap-1"
            >
              Pinata <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a 
              href="https://privy.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline flex items-center gap-1"
            >
              Privy <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a 
              href="https://ethereum.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline flex items-center gap-1"
            >
              Ethereum <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Built with Love */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Built with <span className="text-red-500">❤️</span> for ETHOnline 2025 by Team eTheRealSteel 
          </p>
        </div>
      </div>
    </footer>
  )
} 