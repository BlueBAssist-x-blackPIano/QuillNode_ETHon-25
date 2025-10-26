"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Use your app's card components
import { NexusProvider } from "@avail-project/nexus-widgets";

// Dynamically import widgets for client-side only usage
const BridgeButton = dynamic(
    () => import('@avail-project/nexus-widgets').then(mod => mod.BridgeButton),
    { ssr: false }
);
const TransferButton = dynamic(
    () => import('@avail-project/nexus-widgets').then(mod => mod.TransferButton),
    { ssr: false }
);
const BridgeAndExecuteButton = dynamic(
    () => import('@avail-project/nexus-widgets').then(mod => mod.BridgeAndExecuteButton),
    { ssr: false }
);

export default function ClientAvailSection() {
    return (
        <NexusProvider>
            <section className="w-full max-w-3xl mx-auto my-10 p-8 bg-black border border-gray-200 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-8 text-center text-primary">
                    Enable Cross-Chain Bridging using Avail Nexus SDK
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {/* Bridge Card */}
                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Bridge Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-300">
                                Instantly bridge your assets from one blockchain to another.
                                Simple and secure token migration across supported chains.
                            </p>
                            <BridgeButton prefill={{ chainId: 137, token: 'USDC', amount: '100' }}>
                                {({ onClick, isLoading }) => (
                                    <button
                                        onClick={onClick}
                                        disabled={isLoading}
                                        className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/80"
                                    >
                                        {isLoading ? 'Bridging...' : 'Bridge 100 USDC to Polygon'}
                                    </button>
                                )}
                            </BridgeButton>
                        </CardContent>
                    </Card>
                    {/* Transfer Card */}
                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Transfer Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-300">
                                Send supported tokens to any wallet address on any chain.
                                Fast and reliable peer-to-peer transactions.
                            </p>
                            <TransferButton prefill={{
                                chainId: 137,
                                token: 'USDC',
                                amount: '100',
                                recipient: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4Db45',
                            }}>
                                {({ onClick, isLoading }) => (
                                    <button
                                        onClick={onClick}
                                        disabled={isLoading}
                                        className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/80"
                                    >
                                        {isLoading ? 'Transferring...' : 'Send 100 USDC to Polygon'}
                                    </button>
                                )}
                            </TransferButton>
                        </CardContent>
                    </Card>
                    {/* Bridge and Execute Card */}
                    <Card className="bg-gray-900 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Bridge & Execute</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-gray-300">
                                Move tokens and interact with smart contracts on the destination chain,
                                all in a single transaction — perfect for staking or DeFi actions!
                            </p>
                            <BridgeAndExecuteButton
                                contractAddress="0x794a61358D6845594F94dc1DB02A252b5b4814aD"
                                contractAbi={[
                                    {
                                        name: "supply",
                                        type: "function",
                                        stateMutability: "nonpayable",
                                        inputs: [
                                            { name: "asset", type: "address" },
                                            { name: "amount", type: "uint256" },
                                            { name: "onBehalfOf", type: "address" },
                                            { name: "referralCode", type: "uint16" },
                                        ],
                                        outputs: [],
                                    }
                                ] as const}
                                functionName="supply"
                                buildFunctionParams={(token, amount, chainId, user) => ({
                                    functionParams: [
                                        "0x...", // Replace with actual token contract address
                                        amount,
                                        user,
                                        0
                                    ]
                                })}
                                prefill={{ toChainId: 42161, token: "USDT" }}
                            >
                                {({ onClick, isLoading }) => (
                                    <button
                                        onClick={onClick}
                                        disabled={isLoading}
                                        className="w-full py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/80"
                                    >
                                        {isLoading ? 'Processing...' : 'Bridge & Stake'}
                                    </button>
                                )}
                            </BridgeAndExecuteButton>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </NexusProvider>
    );
}
