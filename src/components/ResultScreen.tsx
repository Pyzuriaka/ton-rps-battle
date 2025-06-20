
import { Trophy, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameHeader from './GameHeader';

interface ResultScreenProps {
  result: 'win' | 'lose' | 'draw';
  playerChoice: string;
  opponentChoice: string;
  prizeAmount: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

const ResultScreen = ({ result, playerChoice, opponentChoice, prizeAmount, onPlayAgain, onHome }: ResultScreenProps) => {
  const choiceEmoji = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  };

  const resultConfig = {
    win: {
      title: 'You Won!',
      subtitle: `+${prizeAmount} TON`,
      bgColor: 'from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    lose: {
      title: 'You Lost',
      subtitle: `Better luck next time`,
      bgColor: 'from-red-500 to-red-600',
      textColor: 'text-red-600'
    },
    draw: {
      title: "It's a Draw!",
      subtitle: 'Bets returned',
      bgColor: 'from-gray-500 to-gray-600',
      textColor: 'text-gray-600'
    }
  };

  const config = resultConfig[result];

  return (
    <div className="min-h-screen bg-slate-50">
      <GameHeader title="Game Result" />
      
      <div className="p-4 space-y-6">
        <div className="game-card text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${config.bgColor} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
            <Trophy size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{config.title}</h2>
          <p className={`text-lg font-semibold ${config.textColor}`}>{config.subtitle}</p>
        </div>

        <div className="game-card">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{choiceEmoji[playerChoice as keyof typeof choiceEmoji]}</div>
              <div className="text-sm font-medium text-slate-900 capitalize">{playerChoice}</div>
              <div className="text-xs text-slate-500">You</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">{choiceEmoji[opponentChoice as keyof typeof choiceEmoji]}</div>
              <div className="text-sm font-medium text-slate-900 capitalize">{opponentChoice}</div>
              <div className="text-xs text-slate-500">Opponent</div>
            </div>
          </div>

          {result === 'win' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">Prize received:</span>
                <span className="font-bold text-green-800">{prizeAmount} TON</span>
              </div>
              <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors mt-2">
                <ExternalLink size={12} />
                View transaction
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onPlayAgain}
              variant="outline"
              className="h-12 rounded-xl border-slate-300 hover:bg-slate-100"
            >
              <RotateCcw size={16} className="mr-2" />
              Play Again
            </Button>
            <Button 
              onClick={onHome}
              className="h-12 ton-gradient text-white font-semibold rounded-xl"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
