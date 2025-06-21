
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

  const isConnected = !!wallet;

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

  // Convert address to the correct format for API calls
  const formatAddressForAPI = (addr: string): string => {
    // Remove any prefixes and ensure proper format
    return addr.replace(/^0:/, '').toLowerCase();
  };

  const getBalance = async (retryCount = 0) => {
    if (!address) {
      setBalance('0');
      return;
    }
    
    setIsBalanceLoading(true);
    setBalanceError(null);
    
    try {
      console.log('Fetching balance for address:', address);
      
      // Try multiple APIs for better reliability
      const apis = [
        {
          name: 'tonapi.io',
          url: `https://tonapi.io/v2/accounts/${address}`,
          parseBalance: (data: any) => {
            const balanceNano = data.balance || '0';
            return (parseInt(balanceNano) / 1000000000).toFixed(4);
          }
        },
        {
          name: 'toncenter.com (backup)',
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
          console.log('Successfully fetched balance:', balanceTon, 'TON');
          return; // Success, exit the function
          
        } catch (apiError) {
          console.warn(`${api.name} failed:`, apiError);
          lastError = apiError;
          continue; // Try next API
        }
      }
      
      // If all APIs failed
      throw lastError || new Error('All balance APIs failed');
      
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      
      // Retry logic
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

  // Auto-fetch balance when address changes
  useEffect(() => {
    if (address && isConnected) {
      console.log('Address changed, fetching balance:', address);
      getBalance();
    } else {
      setBalance('0');
      setBalanceError(null);
    }
  }, [address, isConnected]);

  // Manual refresh function
  const refreshBalance = () => {
    if (address && isConnected) {
      getBalance();
    }
  };

  return {
    wallet,
    address,
    balance,
    isConnected,
    isLoading,
    isBalanceLoading,
    balanceError,
    connectWallet,
    disconnectWallet,
    getBalance: refreshBalance
  };
};
