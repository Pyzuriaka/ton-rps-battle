
import { useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';

export const useTonWalletConnection = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const getBalance = async () => {
    if (!address) return;
    
    try {
      // In production, you would fetch the actual balance from TON API
      // For now, we'll simulate with a placeholder
      const response = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${address}`);
      const data = await response.json();
      
      if (data.ok) {
        const balanceNano = data.result?.balance || '0';
        const balanceTon = (parseInt(balanceNano) / 1000000000).toFixed(2);
        setBalance(balanceTon);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0');
    }
  };

  useEffect(() => {
    if (address) {
      getBalance();
    } else {
      setBalance('0');
    }
  }, [address]);

  return {
    wallet,
    address,
    balance,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    getBalance
  };
};
