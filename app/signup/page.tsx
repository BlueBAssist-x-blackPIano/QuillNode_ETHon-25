"use client"

import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"

export default function SignupPage() {
  const { connectWallet, isConnected } = useUser()

  const handlePrivy = async () => {
    // TODO: Add Privy authentication and wallet integration here
    alert("Privy auth placeholder. // TODO: integrate Privy SDK for social + wallet")
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Create your account</h1>
      <p className="text-muted-foreground mb-6">Connect a wallet or continue with social login.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {!isConnected && (
          <Button className="bg-primary text-primary-foreground" onClick={connectWallet}>
            Connect Metamask
          </Button>
        )}
        <Button variant="secondary" onClick={handlePrivy}>
          Continue with Privy
        </Button>
      </div>
    </main>
  )
}
