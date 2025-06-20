
import { Clock, User } from 'lucide-react';
import GameHeader from './GameHeader';

interface WaitingScreenProps {
  playerChoice: string;
  onBack: () => void;
}

const WaitingScreen = ({ playerChoice, onBack }: WaitingScreenProps) => {
  const choiceEmoji = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  }[playerChoice as keyof typeof choiceEmoji];

  return (
    <div className="min-h-screen bg-slate-50">
      <GameHeader title="Waiting..." showBack onBack={onBack} />
      
      <div className="p-4 space-y-6">
        <div className="game-card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Clock size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Waiting for Opponent</h2>
          <p className="text-slate-600 text-sm">Your choice has been submitted</p>
        </div>

        <div className="game-card">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{choiceEmoji}</div>
            <div className="text-lg font-semibold text-slate-900 capitalize">{playerChoice}</div>
            <div className="text-sm text-slate-500">Your choice</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <User size={18} className="text-slate-600" />
              <span className="font-medium text-slate-900">Opponent Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Making their choice...</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Game will continue automatically when both players have chosen
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
