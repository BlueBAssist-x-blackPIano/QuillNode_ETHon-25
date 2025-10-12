"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/context/user-context"

export default function PremiumPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-pretty mb-6">Try Premium</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Great for casual readers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-5 text-sm">
              <li>Access to public stories</li>
              <li>Basic search</li>
              <li>Community features</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Unlock exclusive content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 text-sm">
              <li>Exclusive premium stories</li>
              <li>Advanced filters</li>
              <li>Ad-free experience</li>
            </ul>
            <GoPremiumButton />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function GoPremiumButton() {
  const { isConnected, connectWallet } = useUser()
  const onClick = async () => {
    if (!isConnected) {
      if (typeof window !== "undefined") window.location.href = "/signup"
      return
    }
    // TODO: Add blockchain transaction to upgrade user to premium (Avail Nexus / contract call)
    // This is a placeholder action:
    alert("Simulated on-chain premium purchase. // TODO: integrate Avail Nexus SDK + Ethers")
  }
  return (
    <Button className="bg-primary text-primary-foreground" onClick={onClick}>
      Go Premium
    </Button>
  )
}
