
import { useState } from 'react';
import GameCreateScreen from '@/components/GameCreateScreen';
import JoinGameScreen from '@/components/JoinGameScreen';
import CardSelectionScreen from '@/components/CardSelectionScreen';
import WaitingScreen from '@/components/WaitingScreen';
import ResultScreen from '@/components/ResultScreen';

type GameState = 'create' | 'join' | 'selection' | 'waiting' | 'result';
type Choice = 'rock' | 'paper' | 'scissors';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('create');
  const [gameData, setGameData] = useState({
    creator: 'player123',
    betAmount: 1,
    gameId: 'RPS001'
  });
  const [playerChoice, setPlayerChoice] = useState<Choice>('rock');
  const [opponentChoice] = useState<Choice>('scissors');

  const handleCreateGame = (betAmount: number) => {
    setGameData(prev => ({ ...prev, betAmount }));
    setGameState('join');
  };

  const handleJoinGame = () => {
    setGameState('selection');
  };

  const handleSubmitChoice = (choice: Choice) => {
    setPlayerChoice(choice);
    setGameState('waiting');
    
    // Simulate opponent choice and move to result after 3 seconds
    setTimeout(() => {
      setGameState('result');
    }, 3000);
  };

  const handlePlayAgain = () => {
    setGameState('create');
  };

  const handleHome = () => {
    setGameState('create');
  };

  const handleBack = () => {
    switch (gameState) {
      case 'join':
        setGameState('create');
        break;
      case 'selection':
        setGameState('join');
        break;
      case 'waiting':
        setGameState('selection');
        break;
      default:
        setGameState('create');
    }
  };

  // Determine result (simplified logic for demo)
  const getResult = (): 'win' | 'lose' | 'draw' => {
    if (playerChoice === opponentChoice) return 'draw';
    if (
      (playerChoice === 'rock' && opponentChoice === 'scissors') ||
      (playerChoice === 'paper' && opponentChoice === 'rock') ||
      (playerChoice === 'scissors' && opponentChoice === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  switch (gameState) {
    case 'create':
      return <GameCreateScreen onCreateGame={handleCreateGame} />;
    case 'join':
      return <JoinGameScreen gameData={gameData} onJoinGame={handleJoinGame} onBack={handleBack} />;
    case 'selection':
      return <CardSelectionScreen onSubmitChoice={handleSubmitChoice} onBack={handleBack} />;
    case 'waiting':
      return <WaitingScreen playerChoice={playerChoice} onBack={handleBack} />;
    case 'result':
      return (
        <ResultScreen
          result={getResult()}
          playerChoice={playerChoice}
          opponentChoice={opponentChoice}
          prizeAmount={gameData.betAmount * 2}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      );
    default:
      return <GameCreateScreen onCreateGame={handleCreateGame} />;
  }
};

export default Index;
