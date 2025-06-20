
import { User, Coins, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameHeader from './GameHeader';

interface JoinGameScreenProps {
  gameData: {
    creator: string;
    betAmount: number;
    gameId: string;
  };
  onJoinGame: () => void;
  onBack: () => void;
}

const JoinGameScreen = ({ gameData, onJoinGame, onBack }: JoinGameScreenProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <GameHeader title="Join Game" showBack onBack={onBack} />
      
      <div className="p-4 space-y-6">
        <div className="game-card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Game Found!</h2>
          <p className="text-slate-600 text-sm">Join this rock-paper-scissors battle</p>
        </div>

        <div className="game-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-slate-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">@{gameData.creator}</div>
              <div className="text-sm text-slate-500">Game Creator</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Coins size={18} className="text-blue-500" />
              <span className="font-medium text-slate-900">Game Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Bet amount:</span>
                <span className="font-medium text-slate-900">{gameData.betAmount} TON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Prize pool:</span>
                <span className="font-bold text-green-600">{gameData.betAmount * 2} TON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Game ID:</span>
                <span className="font-mono text-xs text-slate-500">#{gameData.gameId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Shield size={14} />
            <span>Secured by TON smart contract</span>
          </div>

          <Button 
            onClick={onJoinGame}
            className="w-full h-12 ton-gradient text-white font-semibold rounded-xl"
          >
            Join Game • {gameData.betAmount} TON
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinGameScreen;
