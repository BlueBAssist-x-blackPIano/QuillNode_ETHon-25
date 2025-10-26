'use client';

import React, { useState } from 'react';
import type { TransferParams } from '@avail-project/nexus-core';
import { TransferButton } from '@avail-project/nexus-widgets';
import dynamic from 'next/dynamic';
// Import your constants
import { SUPPORTED_CHAINS_IDS, SupportedChainId } from '../chains';
import { SUPPORTED_TOKENS, SupportedToken } from '../tokens'; 

const BridgeButton = dynamic(
    () => import('@avail-project/nexus-widgets').then(mod => mod.BridgeButton),
    { ssr: false }
);

// --- Component to render the dynamic TransferButton ---
export default function DynamicTransferWidget() {
  // 1. Initialize State with default values (using the first element of each array)
  const [selectedChainId, setSelectedChainId] = useState<SupportedChainId>(SUPPORTED_CHAINS_IDS[0]);
  const [selectedToken, setSelectedToken] = useState<SupportedToken>(SUPPORTED_TOKENS[0]);
  const [amount, setAmount] = useState('100');
  const [recipient, setRecipient] = useState('0x742d35Cc6634C0532925a3b8D4C9db96c4b4Db45'); // Default recipient

  // 2. Handlers for UI changes
  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Convert string value from select to a number (Chain ID)
    const NumericChainId = Number(e.target.value);
    setSelectedChainId(NumericChainId as SupportedChainId);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value as SupportedToken);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      
      {/* --- Dynamic Input Fields --- */}
      <div>
        <label htmlFor="recipient">Recipient Address:</label>
        <input 
          id="recipient"
          type="text" 
          value={recipient} 
          onChange={handleRecipientChange} 
          placeholder="0x..."
          style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />
      </div>

      <div>
        <label htmlFor="amount">Amount:</label>
        <input 
          id="amount"
          type="number" 
          value={amount} 
          onChange={handleAmountChange} 
          placeholder="100"
          style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />
      </div>

      <div>
        <label htmlFor="chain-select">Chain:</label>
        <select id="chain-select" value={selectedChainId} onChange={handleChainChange} style={{ padding: '8px', margin: '5px 0', width: '100%' }}>
          {SUPPORTED_CHAINS_IDS.map((id) => (
            <option key={id} value={id}>
              Chain ID: {id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="token-select">Token:</label>
        <select id="token-select" value={selectedToken} onChange={handleTokenChange} style={{ padding: '8px', margin: '5px 0', width: '100%' }}>
          {SUPPORTED_TOKENS.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* --- Dynamic TransferButton Component --- */}
      <TransferButton
        prefill={{
          // 3. Replace hardcoded values with state variables
          chainId: selectedChainId, 
          token: selectedToken,
          amount: amount,
          recipient: recipient as `0x${string}`,
        }}
      >
        {({ onClick, isLoading }) => (
          <button 
            onClick={onClick} 
            disabled={isLoading}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px', 
              cursor: isLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {isLoading 
              ? 'Transferring...' 
              : `Send ${amount} ${selectedToken} to Chain ${selectedChainId}`
            }
          </button>
        )}
      </TransferButton>
    </div>
  );
}



