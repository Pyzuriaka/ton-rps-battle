
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import GameHeader from './GameHeader';

interface CardSelectionScreenProps {
  onSubmitChoice: (choice: 'rock' | 'paper' | 'scissors') => void;
  onBack: () => void;
}

const CardSelectionScreen = ({ onSubmitChoice, onBack }: CardSelectionScreenProps) => {
  const [selectedChoice, setSelectedChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);

  const choices = [
    { id: 'rock' as const, emoji: '🪨', label: 'Rock' },
    { id: 'paper' as const, emoji: '📄', label: 'Paper' },
    { id: 'scissors' as const, emoji: '✂️', label: 'Scissors' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <GameHeader title="Make Your Move" showBack onBack={onBack} />
      
      <div className="p-4 space-y-6">
        <div className="game-card text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Choose Your Weapon</h2>
          <p className="text-slate-600 text-sm">Select rock, paper, or scissors</p>
        </div>

        <div className="game-card">
          <div className="grid grid-cols-1 gap-4 mb-8">
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => setSelectedChoice(choice.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  selectedChoice === choice.id
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{choice.emoji}</div>
                  <div className="text-left">
                    <div className="text-lg font-semibold text-slate-900">{choice.label}</div>
                    <div className="text-sm text-slate-500">
                      {choice.id === 'rock' && 'Crushes scissors'}
                      {choice.id === 'paper' && 'Covers rock'}
                      {choice.id === 'scissors' && 'Cuts paper'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button 
            onClick={() => selectedChoice && onSubmitChoice(selectedChoice)}
            disabled={!selectedChoice}
            className="w-full h-12 ton-gradient text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Choice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionScreen;
