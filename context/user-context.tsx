"use client"

import type React from "react"

import { createContext, useContext, useMemo, useState } from "react"
import { useWalletConnect } from "@/hooks/use-wallet-connect"

type UserContextType = {
  address?: string
  isConnected: boolean
  isPremium: boolean
  connectWallet: () => Promise<void>
  setPremium: (v: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { address, connect } = useWalletConnect()
  const [isPremium, setPremium] = useState(false)

  const value = useMemo(
    () => ({
      address,
      isConnected: Boolean(address),
      isPremium,
      connectWallet: connect,
      setPremium,
    }),
    [address, isPremium, connect],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
