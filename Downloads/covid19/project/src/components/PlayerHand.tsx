import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Player, Card as CardType } from '../types/game';
import { canPlayCard } from '../utils/cardUtils';

interface PlayerHandProps {
  player: Player;
  isCurrentPlayer: boolean;
  topCard: CardType;
  currentColor: string;
  onCardPlay: (card: CardType) => void;
  position: 'bottom' | 'top' | 'left' | 'right';
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isCurrentPlayer,
  topCard,
  currentColor,
  onCardPlay,
  position
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'flex-row justify-center items-end';
      case 'top':
        return 'flex-row justify-center items-start';
      case 'left':
        return 'flex-col justify-center items-start';
      case 'right':
        return 'flex-col justify-center items-end';
      default:
        return 'flex-row justify-center';
    }
  };

  const getCardSpacing = () => {
    const cardCount = player.cards.length;
    if (position === 'bottom' && cardCount > 10) {
      return '-space-x-4';
    }
    if (position === 'left' || position === 'right') {
      return cardCount > 10 ? '-space-y-2' : 'space-y-1';
    }
    return cardCount > 10 ? '-space-x-2' : 'space-x-1';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="relative">
      {/* Player info */}
      <div className={`
        absolute z-20 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm
        ${position === 'bottom' ? '-top-10 left-1/2 transform -translate-x-1/2' : 
          position === 'top' ? '-bottom-10 left-1/2 transform -translate-x-1/2' :
          position === 'left' ? '-right-24 top-1/2 transform -translate-y-1/2' :
          '-left-24 top-1/2 transform -translate-y-1/2'}
      `}>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${isCurrentPlayer ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="font-semibold">{player.name}</span>
          {player.isAI && (
            <span className="text-xs bg-blue-600 px-1 rounded">AI</span>
          )}
        </div>
        <div className="text-xs text-gray-300">
          {player.cards.length} cards • Win Rate: {(player.stats.winRate * 100).toFixed(1)}%
        </div>
      </div>

      {/* Cards */}
      <motion.div
        className={`flex ${getPositionClasses()} ${getCardSpacing()}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {position === 'bottom' ? (
          // Show actual cards for current player
          player.cards.map((card, index) => {
            const playable = isCurrentPlayer && canPlayCard(card, topCard, currentColor as any);
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                style={{ zIndex: index }}
                className="relative"
              >
                <Card
                  card={card}
                  isPlayable={playable}
                  onClick={() => playable && onCardPlay(card)}
                  size="medium"
                />
              </motion.div>
            );
          })
        ) : (
          // Show card backs for other players
          player.cards.map((_, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              style={{ zIndex: index }}
              className="relative"
            >
              <Card
                card={{ id: 'back', color: 'wild', type: 'wild' }}
                showBack={true}
                size="small"
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* UNO indicator */}
      {player.cards.length === 1 && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          UNO!
        </motion.div>
      )}
    </div>
  );
};