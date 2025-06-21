
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTonWalletConnection } from './useTonWallet';
import type { Tables } from '@/integrations/supabase/types';

type GameChoice = 'rock' | 'paper' | 'scissors';
type GameStatus = 'waiting' | 'active' | 'revealing' | 'completed' | 'cancelled';

// Use the Supabase generated type but with our specific GameStatus
type Game = Omit<Tables<'games'>, 'game_status'> & {
  game_status: GameStatus;
};

export const useGameLogic = () => {
  const { address, isConnected } = useTonWalletConnection();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createGame = useCallback(async (betAmount: number) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('games')
        .insert({
          creator_address: address,
          bet_amount: betAmount,
          game_status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      // Create or update player record
      await supabase
        .from('players')
        .upsert({
          wallet_address: address,
          games_played: 1
        }, {
          onConflict: 'wallet_address'
        });

      // Cast the data to our Game type
      setCurrentGame(data as Game);
      return data as Game;
    } catch (error) {
      console.error('Failed to create game:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  const joinGame = useCallback(async (gameId: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('games')
        .update({
          joiner_address: address,
          game_status: 'active'
        })
        .eq('id', gameId)
        .eq('game_status', 'waiting')
        .select()
        .single();

      if (error) throw error;

      // Update player record
      await supabase
        .from('players')
        .upsert({
          wallet_address: address,
          games_played: 1
        }, {
          onConflict: 'wallet_address'
        });

      // Cast the data to our Game type
      setCurrentGame(data as Game);
      return data as Game;
    } catch (error) {
      console.error('Failed to join game:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  const submitChoice = useCallback(async (gameId: string, choice: GameChoice) => {
    if (!isConnected || !address || !currentGame) {
      throw new Error('Invalid game state');
    }

    setIsLoading(true);
    try {
      const isCreator = currentGame.creator_address === address;
      const updateField = isCreator ? 'creator_choice' : 'joiner_choice';
      
      // Simple hash for demo - in production, use proper cryptographic commitment
      const choiceHash = btoa(`${choice}-${Date.now()}-${Math.random()}`);
      const hashField = isCreator ? 'creator_choice_hash' : 'joiner_choice_hash';

      const { data, error } = await supabase
        .from('games')
        .update({
          [updateField]: choice,
          [hashField]: choiceHash
        })
        .eq('id', gameId)
        .select()
        .single();

      if (error) throw error;

      // Cast the data to our Game type
      setCurrentGame(data as Game);
      return data as Game;
    } catch (error) {
      console.error('Failed to submit choice:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, currentGame]);

  const getGameResult = (playerChoice: GameChoice, opponentChoice: GameChoice): 'win' | 'lose' | 'draw' => {
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

  return {
    currentGame,
    isLoading,
    createGame,
    joinGame,
    submitChoice,
    getGameResult,
    setCurrentGame
  };
};
