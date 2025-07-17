export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  isAI: boolean;
  aiLevel?: 'easy' | 'medium' | 'hard';
  stats: PlayerStats;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  averageCardsLeft: number;
  favoriteColor: CardColor;
  totalPlayTime: number;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  drawPile: Card[];
  discardPile: Card[];
  currentColor: CardColor;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner?: string;
  turnStartTime: number;
  gameStartTime: number;
}

export interface AIDecision {
  cardToPlay?: Card;
  colorToChoose?: CardColor;
  confidence: number;
  reasoning: string;
}

export interface GameAnalytics {
  gameId: string;
  duration: number;
  totalTurns: number;
  playerMoves: PlayerMove[];
  winner: string;
  finalScores: { playerId: string; cardsLeft: number }[];
}

export interface PlayerMove {
  playerId: string;
  cardPlayed?: Card;
  colorChosen?: CardColor;
  turnDuration: number;
  cardsInHand: number;
  timestamp: number;
}