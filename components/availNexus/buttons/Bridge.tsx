'use client';


import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { SUPPORTED_CHAINS_IDS, SupportedChainId } from '../chains';
import { SUPPORTED_TOKENS, SupportedToken } from '../tokens';

// Dynamically import BridgeButton to fix SSR client boundary errors
const BridgeButton = dynamic(
    () => import('@avail-project/nexus-widgets').then(mod => mod.BridgeButton),
    { ssr: false }
);

// --- Component to render the dynamic BridgeButton ---
export default function DynamicBridgeWidget() {
    // 1. Initialize State with correct types and default values

    // Chain ID state (must be a number, using your union type)
    const [selectedChainId, setSelectedChainId] = useState<SupportedChainId>(SUPPORTED_CHAINS_IDS[0]);

    // Token state (must be your token union type)
    const [selectedToken, setSelectedToken] = useState<SupportedToken>(SUPPORTED_TOKENS[0]);

    // Amount state (amount is typically a string representation of a number)
    const [amount, setAmount] = useState('100');

    // 2. Handlers for UI changes

    const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Convert string value from select to a number (Chain ID) and assert its type
        const numericChainId = Number(e.target.value);
        setSelectedChainId(numericChainId as SupportedChainId);
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Assert the string value as the supported token type
        setSelectedToken(e.target.value as SupportedToken);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #0056b3', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>

            <h3>Avail Nexus Bridge</h3>

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
                <label htmlFor="chain-select" style={{ display: 'block', marginBottom: '5px' }}>Destination Chain (chainId):</label>
                <select id="chain-select" value={selectedChainId} onChange={handleChainChange} style={{ padding: '10px', margin: '5px 0 20px 0', width: '100%' }}>
                    {SUPPORTED_CHAINS_IDS.map((id) => (
                        <option key={id} value={id}>
                            Chain ID: {id}
                        </option>
                    ))}
                </select>
            </div>

            {/* --- Dynamic BridgeButton Component --- */}
            <BridgeButton
                prefill={{
                    // 3. Link state variables to the prefill prop
                    chainId: selectedChainId,
                    token: selectedToken,
                    amount: amount,
                }}
            >
                {({ onClick, isLoading }) => (
                    <button
                        onClick={onClick}
                        disabled={isLoading}
                        style={{
                            padding: '12px 25px',
                            fontSize: '16px',
                            backgroundColor: isLoading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            width: '100%'
                        }}
                    >
                        {isLoading
                            ? 'Bridging...'
                            : `Bridge ${amount} ${selectedToken} to Chain ${selectedChainId}`
                        }
                    </button>
                )}
            </BridgeButton>
        </div>
    );
}
