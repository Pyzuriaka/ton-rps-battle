
-- Create games table to store game state and blockchain information
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_address TEXT NOT NULL,
  joiner_address TEXT,
  bet_amount DECIMAL(10,2) NOT NULL,
  game_status TEXT NOT NULL DEFAULT 'waiting' CHECK (game_status IN ('waiting', 'active', 'revealing', 'completed', 'cancelled')),
  creator_choice_hash TEXT,
  joiner_choice_hash TEXT,
  creator_choice TEXT,
  joiner_choice TEXT,
  winner_address TEXT,
  prize_amount DECIMAL(10,2),
  contract_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '1 hour')
);

-- Create players table for wallet addresses and statistics
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  total_winnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- RLS policies for games table
CREATE POLICY "Anyone can view games" 
  ON public.games 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create games with their wallet address" 
  ON public.games 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Players can update their own games" 
  ON public.games 
  FOR UPDATE 
  USING (creator_address = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR 
         joiner_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS policies for players table
CREATE POLICY "Anyone can view player stats" 
  ON public.players 
  FOR SELECT 
  USING (true);

CREATE POLICY "Players can insert their own records" 
  ON public.players 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Players can update their own records" 
  ON public.players 
  FOR UPDATE 
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create indexes for better performance
CREATE INDEX idx_games_status ON public.games(game_status);
CREATE INDEX idx_games_creator ON public.games(creator_address);
CREATE INDEX idx_games_joiner ON public.games(joiner_address);
CREATE INDEX idx_games_created_at ON public.games(created_at);
CREATE INDEX idx_players_wallet ON public.players(wallet_address);

-- Enable realtime for games table
ALTER TABLE public.games REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
