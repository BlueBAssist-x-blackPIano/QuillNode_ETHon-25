import { ethers as _ethers } from "ethers"

export const ethers = _ethers

export function getDefaultProvider() {
  // TODO: Use provider from Privy or user-selected network if needed
  return new _ethers.BrowserProvider((globalThis as any).ethereum)
}
