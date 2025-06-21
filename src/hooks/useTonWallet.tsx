
import { useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';

export const useTonWalletConnection = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet'); // Default to testnet

  const isConnected = !!wallet;

  // Detect network based on wallet connection
  const detectNetwork = () => {
    if (wallet?.account?.chain) {
      // Chain ID -3 is testnet, -239 is mainnet
      const isTestnet = wallet.account.chain === '-3';
      const detectedNetwork = isTestnet ? 'testnet' : 'mainnet';
      console.log('Detected network:', detectedNetwork, 'Chain ID:', wallet.account.chain);
      setNetwork(detectedNetwork);
      return detectedNetwork;
    }
    // Default to testnet for development
    console.log('Using default testnet network');
    return 'testnet';
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      await tonConnectUI.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      setBalance('0');
      setBalanceError(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const getBalance = async (retryCount = 0) => {
    if (!address) {
      setBalance('0');
      return;
    }
    
    const currentNetwork = detectNetwork();
    setIsBalanceLoading(true);
    setBalanceError(null);
    
    try {
      console.log(`Fetching balance for address: ${address} on ${currentNetwork}`);
      
      // Configure APIs based on network
      const apis = currentNetwork === 'testnet' ? [
        {
          name: 'tonapi.io testnet',
          url: `https://testnet.tonapi.io/v2/accounts/${address}`,
          parseBalance: (data: any) => {
            const balanceNano = data.balance || '0';
            return (parseInt(balanceNano) / 1000000000).toFixed(4);
          }
        },
        {
          name: 'toncenter.com testnet',
          url: `https://testnet.toncenter.com/api/v2/getAddressInformation?address=${address}`,
          parseBalance: (data: any) => {
            if (data.ok && data.result) {
              const balanceNano = data.result.balance || '0';
              return (parseInt(balanceNano) / 1000000000).toFixed(4);
            }
            throw new Error('Invalid response format');
          }
        }
      ] : [
        {
          name: 'tonapi.io mainnet',
          url: `https://tonapi.io/v2/accounts/${address}`,
          parseBalance: (data: any) => {
            const balanceNano = data.balance || '0';
            return (parseInt(balanceNano) / 1000000000).toFixed(4);
          }
        },
        {
          name: 'toncenter.com mainnet',
          url: `https://toncenter.com/api/v2/getAddressInformation?address=${address}`,
          parseBalance: (data: any) => {
            if (data.ok && data.result) {
              const balanceNano = data.result.balance || '0';
              return (parseInt(balanceNano) / 1000000000).toFixed(4);
            }
            throw new Error('Invalid response format');
          }
        }
      ];

      let lastError = null;
      
      for (const api of apis) {
        try {
          console.log(`Trying ${api.name}...`);
          
          const response = await fetch(api.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log(`${api.name} response:`, data);
          
          const balanceTon = api.parseBalance(data);
          setBalance(balanceTon);
          setBalanceError(null);
          console.log(`Successfully fetched balance: ${balanceTon} TON on ${currentNetwork}`);
          return;
          
        } catch (apiError) {
          console.warn(`${api.name} failed:`, apiError);
          lastError = apiError;
          continue;
        }
      }
      
      throw lastError || new Error('All balance APIs failed');
      
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      
      if (retryCount < 2) {
        console.log(`Retrying balance fetch... (${retryCount + 1}/3)`);
        setTimeout(() => getBalance(retryCount + 1), 2000 * (retryCount + 1));
        return;
      }
      
      setBalance('0');
      setBalanceError(error instanceof Error ? error.message : 'Failed to fetch balance');
    } finally {
      setIsBalanceLoading(false);
    }
  };

  // Auto-fetch balance when address or network changes
  useEffect(() => {
    if (address && isConnected) {
      console.log('Address or network changed, fetching balance:', address);
      // Small delay to ensure network detection is complete
      setTimeout(() => getBalance(), 500);
    } else {
      setBalance('0');
      setBalanceError(null);
    }
  }, [address, isConnected, wallet?.account?.chain]);

  // Detect network when wallet connects
  useEffect(() => {
    if (wallet?.account?.chain) {
      detectNetwork();
    }
  }, [wallet?.account?.chain]);

  const refreshBalance = () => {
    if (address && isConnected) {
      getBalance();
    }
  };

  return {
    wallet,
    address,
    balance,
    network,
    isConnected,
    isLoading,
    isBalanceLoading,
    balanceError,
    connectWallet,
    disconnectWallet,
    getBalance: refreshBalance
  };
};
