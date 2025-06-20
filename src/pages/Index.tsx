
import { useState, useEffect } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useTonWalletConnection } from '@/hooks/useTonWallet';
import { supabase } from '@/integrations/supabase/client';
import GameCreateScreen from '@/components/GameCreateScreen';
import JoinGameScreen from '@/components/JoinGameScreen';
import CardSelectionScreen from '@/components/CardSelectionScreen';
import WaitingScreen from '@/components/WaitingScreen';
import ResultScreen from '@/components/ResultScreen';

type GameState = 'create' | 'join' | 'selection' | 'waiting' | 'result';
type Choice = 'rock' | 'paper' | 'scissors';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('create');
  const [playerChoice, setPlayerChoice] = useState<Choice>('rock');
  const { currentGame, createGame, joinGame, submitChoice, getGameResult } = useGameLogic();
  const { isConnected, address } = useTonWalletConnection();

  // Listen for real-time game updates
  useEffect(() => {
    if (!currentGame) return;

    const channel = supabase
      .channel('game-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${currentGame.id}`
        },
        (payload) => {
          console.log('Game updated:', payload.new);
          // Handle game state changes
          const updatedGame = payload.new as any;
          
          // Check if both players have made choices
          if (updatedGame.creator_choice && updatedGame.joiner_choice && gameState === 'waiting') {
            setGameState('result');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGame, gameState]);

  const handleCreateGame = async (betAmount: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await createGame(betAmount);
      setGameState('join');
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Please try again.');
    }
  };

  const handleJoinGame = async () => {
    if (!currentGame || !isConnected) return;

    try {
      await joinGame(currentGame.id);
      setGameState('selection');
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game. Please try again.');
    }
  };

  const handleSubmitChoice = async (choice: Choice) => {
    if (!currentGame) return;

    try {
      setPlayerChoice(choice);
      await submitChoice(currentGame.id, choice);
      setGameState('waiting');
    } catch (error) {
      console.error('Failed to submit choice:', error);
      alert('Failed to submit choice. Please try again.');
    }
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

  // Get opponent choice and result
  const getOpponentChoice = (): Choice => {
    if (!currentGame || !address) return 'rock';
    
    const isCreator = currentGame.creator_address === address;
    const opponentChoice = isCreator ? currentGame.joiner_choice : currentGame.creator_choice;
    return (opponentChoice as Choice) || 'rock';
  };

  const getGameResultForPlayer = (): 'win' | 'lose' | 'draw' => {
    if (!currentGame) return 'draw';
    return getGameResult(playerChoice, getOpponentChoice());
  };

  switch (gameState) {
    case 'create':
      return <GameCreateScreen onCreateGame={handleCreateGame} />;
    case 'join':
      return (
        <JoinGameScreen 
          gameData={{
            creator: currentGame?.creator_address || 'Unknown',
            betAmount: currentGame?.bet_amount || 0,
            gameId: currentGame?.id || 'Unknown'
          }}
          onJoinGame={handleJoinGame} 
          onBack={handleBack} 
        />
      );
    case 'selection':
      return <CardSelectionScreen onSubmitChoice={handleSubmitChoice} onBack={handleBack} />;
    case 'waiting':
      return <WaitingScreen playerChoice={playerChoice} onBack={handleBack} />;
    case 'result':
      return (
        <ResultScreen
          result={getGameResultForPlayer()}
          playerChoice={playerChoice}
          opponentChoice={getOpponentChoice()}
          prizeAmount={currentGame?.bet_amount ? currentGame.bet_amount * 2 : 0}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      );
    default:
      return <GameCreateScreen onCreateGame={handleCreateGame} />;
  }
};

export default Index;
