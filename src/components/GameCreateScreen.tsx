
import { useState } from 'react';
import { Plus, Coins, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTonWalletConnection } from '@/hooks/useTonWallet';
import GameHeader from './GameHeader';

interface GameCreateScreenProps {
  onCreateGame: (betAmount: number) => void;
}

const GameCreateScreen = ({ onCreateGame }: GameCreateScreenProps) => {
  const [betAmount, setBetAmount] = useState(1);
  const { isConnected, balance } = useTonWalletConnection();

  const betOptions = [0.5, 1, 2, 5];

  const handleCreateGame = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const balanceNum = parseFloat(balance);
    if (balanceNum < betAmount) {
      alert('Insufficient balance');
      return;
    }

    onCreateGame(betAmount);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <GameHeader title="Let's Play?" showWallet />
      
      <div className="p-4 space-y-6">
        <div className="game-card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Plus size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Create New Game</h2>
          <p className="text-slate-600 text-sm">Choose your bet and challenge a player</p>
        </div>

        {!isConnected && (
          <div className="game-card">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertCircle size={20} />
              <span className="font-medium">Wallet Connection Required</span>
            </div>
            <p className="text-sm text-slate-600">
              Please connect your TON wallet to create and play games with real cryptocurrency.
            </p>
          </div>
        )}

        <div className="game-card">
          <div className="flex items-center gap-2 mb-4">
            <Coins size={20} className="text-blue-500" />
            <span className="font-medium text-slate-900">Bet Amount</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {betOptions.map((amount) => {
              const insufficient = isConnected && parseFloat(balance) < amount;
              return (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={insufficient}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    betAmount === amount
                      ? 'border-blue-500 bg-blue-50'
                      : insufficient
                      ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-lg font-bold text-slate-900">{amount} TON</div>
                  <div className="text-xs text-slate-500">≈ ${(amount * 2.5).toFixed(1)}</div>
                  {insufficient && (
                    <div className="text-xs text-red-500 mt-1">Insufficient</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-slate-600">Your bet:</span>
              <span className="font-medium text-slate-900">{betAmount} TON</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-slate-600">Prize pool:</span>
              <span className="font-bold text-green-600">{betAmount * 2} TON</span>
            </div>
            {isConnected && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Your balance:</span>
                <span className="font-medium text-slate-700">{balance} TON</span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleCreateGame}
            disabled={!isConnected || parseFloat(balance) < betAmount}
            className="w-full h-12 ton-gradient text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isConnected ? 'Connect Wallet to Play' : 'Create Game'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameCreateScreen;
