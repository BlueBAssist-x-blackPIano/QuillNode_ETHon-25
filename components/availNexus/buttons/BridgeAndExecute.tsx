'use client';

import React, { useState } from 'react';
import { BridgeAndExecuteButton, TOKEN_METADATA, TOKEN_CONTRACT_ADDRESSES } from '@avail-project/nexus-widgets';
import { parseUnits, Address } from 'viem';
import { SUPPORTED_CHAINS_IDS, SupportedChainId } from '../chains';
import { SUPPORTED_TOKENS, SupportedToken } from '../tokens';
import dynamic from 'next/dynamic';
// NOTE: You'll also need to ensure 'Abi', 'DynamicParamBuilder', and 'BaseComponentProps'
// (if used) are imported or defined if you move this out of the example file.

// Define the ABI here for clarity, or import it if preferred
const AAVE_SUPPLY_ABI = [
    {
        name: 'supply',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'asset', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'onBehalfOf', type: 'address' },
            { name: 'referralCode', type: 'uint16' },
        ],
        outputs: [],
    },
];

const BridgeButton = dynamic(
    () => import('@avail-project/nexus-widgets').then(mod => mod.BridgeButton),
    { ssr: false }
);

// --- Component to render the dynamic BridgeAndExecuteButton ---
export default function DynamicBridgeAndExecuteWidget() {
    // 1. Initialize State with correct types and default values

    // Destination Chain ID state (must be a number)
    const [selectedChainId, setSelectedChainId] = useState<SupportedChainId>(SUPPORTED_CHAINS_IDS[0]);

    // Token state (must be your token union type)
    const [selectedToken, setSelectedToken] = useState<SupportedToken>(SUPPORTED_TOKENS[0]);

    // Amount state (string representation of a number)
    const [amount, setAmount] = useState('100');

    // 2. Handlers for UI changes

    const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const numericChainId = Number(e.target.value);
        setSelectedChainId(numericChainId as SupportedChainId);
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedToken(e.target.value as SupportedToken);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    // 3. Dynamic buildFunctionParams function
    // This function remains largely the same, but it's now wrapped in the component.
    const buildDynamicParams = (
        token: SupportedToken,
        amount: string,
        chainId: SupportedChainId,
        userAddress: Address) => {
        // Note: We need to assert 'token' and 'chainId' here as the parameters 
        // passed by the widget might be less strictly typed than our state.
        const tokenSymbol = token as SupportedToken;
        const destChainId = chainId as SupportedChainId;

        const decimals = TOKEN_METADATA[tokenSymbol].decimals;
        const amountWei = parseUnits(amount, decimals);

        // Use the dynamic chainId to get the correct token contract address
        const tokenAddr = TOKEN_CONTRACT_ADDRESSES[tokenSymbol][destChainId];

        return {
            functionParams: [tokenAddr, amountWei, userAddress, 0]
        };
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #144080', borderRadius: '8px', maxWidth: '450px', margin: '20px auto' }}>

            <h3>Bridge & Execute: Supply to AAVE</h3>

            {/* --- Amount Input Field --- */}
            <div>
                <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>Amount:</label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="100"
                    min="1"
                    style={{ width: '100%', padding: '10px', margin: '5px 0 15px 0', boxSizing: 'border-box' }}
                />
            </div>

            {/* --- Token Selection Dropdown --- */}
            <div>
                <label htmlFor="token-select" style={{ display: 'block', marginBottom: '5px' }}>Token to Bridge:</label>
                <select id="token-select" value={selectedToken} onChange={handleTokenChange} style={{ padding: '10px', margin: '5px 0 15px 0', width: '100%' }}>
                    {SUPPORTED_TOKENS.map((token) => (
                        <option key={token} value={token}>
                            {token}
                        </option>
                    ))}
                </select>
            </div>

            {/* --- Destination Chain Selection Dropdown --- */}
            <div>
                <label htmlFor="chain-select" style={{ display: 'block', marginBottom: '5px' }}>Destination Chain (toChainId):</label>
                <select id="chain-select" value={selectedChainId} onChange={handleChainChange} style={{ padding: '10px', margin: '5px 0 20px 0', width: '100%' }}>
                    {SUPPORTED_CHAINS_IDS.map((id) => (
                        <option key={id} value={id}>
                            Chain ID: {id}
                        </option>
                    ))}
                </select>
            </div>

            {/* --- Dynamic BridgeAndExecuteButton Component --- */}
            <BridgeAndExecuteButton
                // Static Execution Details (for Aave Supply example)
                contractAddress="0x794a61358D6845594F94dc1DB02A252b5b4814aD" // Example Aave Pool Address
                contractAbi={AAVE_SUPPLY_ABI as any} // Use 'as any' if Abi type is causing issues
                functionName="supply"
                buildFunctionParams={buildDynamicParams}

                // Dynamic Bridge Prefill
                prefill={{
                    toChainId: selectedChainId,
                    token: selectedToken,
                    amount: amount,
                }}
            >
                {({ onClick, isLoading, disabled }) => (
                    <button
                        onClick={onClick}
                        disabled={disabled || isLoading}
                        style={{
                            padding: '12px 25px',
                            fontSize: '16px',
                            backgroundColor: isLoading ? '#ccc' : '#144080',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
                            width: '100%'
                        }}
                    >
                        {isLoading
                            ? 'Processing...'
                            : `Bridge ${amount} ${selectedToken} to Chain ${selectedChainId} & Execute`
                        }
                    </button>
                )}
            </BridgeAndExecuteButton>
        </div>
    );
}
