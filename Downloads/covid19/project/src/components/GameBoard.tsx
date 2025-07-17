import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerHand } from './PlayerHand';
import { Card } from './Card';
import { ColorSelector } from './ColorSelector';
import { GameState, Card as CardType, CardColor } from '../types/game';
import { getCardColor } from '../utils/cardUtils';
import { RotateCcw, Users, Clock, Trophy } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  currentPlayerId: string;
  onCardPlay: (card: CardType) => void;
  onColorSelect: (color: CardColor) => void;
  onDrawCard: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPlayerId,
  onCardPlay,
  onColorSelect,
  onDrawCard
}) => {
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<CardType | null>(null);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  const isMyTurn = currentPlayer?.id === currentPlayerId;

  const handleCardPlay = (card: CardType) => {
    if (card.type === 'wild' || card.type === 'wild4') {
      setPendingWildCard(card);
      setShowColorSelector(true);
    } else {
      onCardPlay(card);
    }
  };

  const handleColorSelect = (color: CardColor) => {
    if (pendingWildCard) {
      onCardPlay(pendingWildCard);
      onColorSelect(color);
      setPendingWildCard(null);
    }
    setShowColorSelector(false);
  };

  const getPlayerPosition = (index: number, totalPlayers: number) => {
    if (totalPlayers === 2) {
      return index === 0 ? 'bottom' : 'top';
    } else if (totalPlayers === 3) {
      const positions = ['bottom', 'left', 'right'];
      return positions[index] as 'bottom' | 'top' | 'left' | 'right';
    } else {
      const positions = ['bottom', 'left', 'top', 'right'];
      return positions[index] as 'bottom' | 'top' | 'left' | 'right';
    }
  };

  const currentPlayerIndex = gameState.players.findIndex(p => p.id === currentPlayerId);
  const reorderedPlayers = [
    ...gameState.players.slice(currentPlayerIndex),
    ...gameState.players.slice(0, currentPlayerIndex)
  ];

  const gameTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Game table background */}
      <div className="absolute inset-0 game-table" />
      
      {/* Game info panel */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{gameState.players.length} Players</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <RotateCcw className={`w-4 h-4 ${gameState.direction === 1 ? '' : 'transform rotate-180'}`} />
            <span>{gameState.direction === 1 ? 'Clockwise' : 'Counter-clockwise'}</span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold">Leaderboard</span>
        </div>
        {gameState.players
          .sort((a, b) => a.cards.length - b.cards.length)
          .map((player, index) => (
            <div key={player.id} className="flex justify-between items-center text-sm">
              <span className={`${player.id === currentPlayerId ? 'font-bold' : ''}`}>
                {index + 1}. {player.name}
              </span>
              <span className="text-gray-300">{player.cards.length} cards</span>
            </div>
          ))}
      </div>

      {/* Center play area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8">
        {/* Draw pile */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isMyTurn ? onDrawCard : undefined}
        >
          <Card
            card={{ id: 'draw', color: 'wild', type: 'wild' }}
            showBack={true}
            size="large"
          />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold">
            Draw ({gameState.drawPile.length})
          </div>
          {isMyTurn && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
          )}
        </motion.div>

        {/* Current color indicator */}
        <div className="flex flex-col items-center space-y-2">
          <div
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            style={{ backgroundColor: getCardColor(gameState.currentColor) }}
          />
          <div className="text-white text-sm font-semibold">
            Current Color
          </div>
        </div>

        {/* Discard pile */}
        <div className="relative">
          {topCard && (
            <motion.div
              initial={{ rotateY: 180, scale: 0 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card card={topCard} size="large" />
            </motion.div>
          )}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold">
            Discard ({gameState.discardPile.length})
          </div>
        </div>
      </div>

      {/* Players */}
      {reorderedPlayers.map((player, index) => {
        const originalIndex = gameState.players.findIndex(p => p.id === player.id);
        const position = getPlayerPosition(index, reorderedPlayers.length);
        const isCurrentTurn = gameState.currentPlayerIndex === originalIndex;
        
        return (
          <div
            key={player.id}
            className={`absolute ${
              position === 'bottom' ? 'bottom-8 left-1/2 transform -translate-x-1/2' :
              position === 'top' ? 'top-24 left-1/2 transform -translate-x-1/2' :
              position === 'left' ? 'left-8 top-1/2 transform -translate-y-1/2' :
              'right-8 top-1/2 transform -translate-y-1/2'
            }`}
          >
            <PlayerHand
              player={player}
              isCurrentPlayer={isCurrentTurn}
              topCard={topCard}
              currentColor={gameState.currentColor}
              onCardPlay={handleCardPlay}
              position={position}
            />
          </div>
        );
      })}

      {/* Turn indicator */}
      {isMyTurn && (
        <motion.div
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full font-bold animate-pulse"
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          Your Turn!
        </motion.div>
      )}

      {/* Color selector modal */}
      <AnimatePresence>
        {showColorSelector && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ColorSelector
                onColorSelect={handleColorSelect}
                onCancel={() => {
                  setShowColorSelector(false);
                  setPendingWildCard(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over modal */}
      <AnimatePresence>
        {gameState.gameStatus === 'finished' && gameState.winner && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 text-center max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
              <p className="text-xl text-gray-600 mb-4">
                {gameState.winner === currentPlayerId ? 'You won!' : `${gameState.players.find(p => p.id === gameState.winner)?.name} won!`}
              </p>
              <div className="text-sm text-gray-500">
                Game duration: {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};