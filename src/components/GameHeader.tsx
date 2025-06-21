
import { Wallet, ArrowLeft, RefreshCw, Wifi } from 'lucide-react';
import { useTonWalletConnection } from '@/hooks/useTonWallet';

interface GameHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showWallet?: boolean;
}

const GameHeader = ({ title, showBack, onBack, showWallet }: GameHeaderProps) => {
  const { 
    isConnected, 
    address, 
    balance, 
    network,
    connectWallet, 
    disconnectWallet, 
    isLoading, 
    isBalanceLoading,
    balanceError,
    getBalance 
  } = useTonWalletConnection();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      
      {showWallet && (
        <div className="flex items-center gap-2">
          {/* Network indicator */}
          <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
            <Wifi size={12} />
            <span>{network === 'testnet' ? 'Testnet' : 'Mainnet'}</span>
          </div>
          
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-slate-500">{formatAddress(address || '')}</div>
                <div className="flex items-center gap-1">
                  {isBalanceLoading ? (
                    <div className="text-xs text-slate-500">Loading...</div>
                  ) : balanceError ? (
                    <div className="text-xs text-red-500">Error</div>
                  ) : (
                    <div className="text-xs font-medium text-slate-700">{balance} TON</div>
                  )}
                  <button
                    onClick={getBalance}
                    disabled={isBalanceLoading}
                    className="p-1 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                    title="Refresh balance"
                  >
                    <RefreshCw size={12} className={`text-slate-500 ${isBalanceLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <button 
                onClick={disconnectWallet}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg text-sm font-medium text-green-700 hover:bg-green-200 transition-colors"
              >
                <Wallet size={16} />
                <span>Connected</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <Wallet size={16} />
              <span>{isLoading ? 'Connecting...' : 'Connect'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHeader;
