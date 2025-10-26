import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Toaster } from "sonner"
import { UserProvider } from "@/context/user-context"
import { StoryProvider } from "@/context/story-context"
import { Suspense } from "react"
import Providers from "./privyProvider"
import { NexusProvider } from '@avail-project/nexus-widgets';

export const metadata: Metadata = {
  title: "QuillNode",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserProvider>
              <StoryProvider>
                        <Suspense fallback={<div>Loading...</div>}>
                          <SiteHeader />
                          {children}
                          <SiteFooter />
                        </Suspense>
                        <Toaster position="top-right" richColors />
              </StoryProvider>
            </UserProvider>
          </ThemeProvider>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
