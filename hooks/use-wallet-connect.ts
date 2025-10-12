"use client"

import { useCallback, useEffect, useState } from "react"
import { formatAddress } from "@/utils/format-address"

export function useWalletConnect() {
  const [address, setAddress] = useState<string | undefined>()

  const connect = useCallback(async () => {
    // TODO: Add Privy integration here as an alternative path
    // TODO: Add Web3Modal if preferred, fallback to raw EIP-1193
    const ethereum = (globalThis as any).ethereum
    if (!ethereum) {
      alert("Metamask not found. Please install it.")
      return
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    setAddress(accounts[0])
  }, [])

  useEffect(() => {
    const ethereum = (globalThis as any).ethereum
    if (!ethereum) return
    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0])
    }
    ethereum.on?.("accountsChanged", handleAccountsChanged)
    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged)
    }
  }, [])

  return { address, connect, pretty: address ? formatAddress(address) : undefined }
}
