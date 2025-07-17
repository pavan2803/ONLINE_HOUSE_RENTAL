import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types/game';
import { getCardColor, getCardDisplayText } from '../utils/cardUtils';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showBack?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  isPlayable = false,
  isSelected = false,
  onClick,
  size = 'medium',
  showBack = false
}) => {
  const sizeClasses = {
    small: 'w-12 h-16',
    medium: 'w-16 h-24',
    large: 'w-20 h-28'
  };

  const cardVariants = {
    hover: {
      scale: isPlayable ? 1.05 : 1,
      y: isPlayable ? -8 : 0,
      rotateY: 0,
    },
    tap: {
      scale: 0.95,
    }
  };

  if (showBack) {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg border-2 border-white card-shadow flex items-center justify-center`}
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className="text-white font-bold text-xs">UNO</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        rounded-lg border-2 border-white card-shadow 
        flex flex-col items-center justify-center
        ${isPlayable ? 'card-playable' : 'card-unplayable'}
        ${isSelected ? 'ring-4 ring-yellow-400 animate-pulse-glow' : ''}
        relative overflow-hidden
      `}
      style={{ backgroundColor: getCardColor(card.color) }}
      onClick={isPlayable ? onClick : undefined}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent" />
      </div>
      
      {/* Card content */}
      <div className="relative z-10 text-white font-bold text-center">
        <div className={`${size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-lg'}`}>
          {getCardDisplayText(card)}
        </div>
        
        {/* Special card icons */}
        {card.type === 'wild' && (
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 bg-red-500 rounded-full mx-0.5" />
            <div className="w-2 h-2 bg-blue-500 rounded-full mx-0.5" />
            <div className="w-2 h-2 bg-green-500 rounded-full mx-0.5" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full mx-0.5" />
          </div>
        )}
      </div>
      
      {/* Corner numbers for number cards */}
      {card.type === 'number' && (
        <>
          <div className="absolute top-1 left-1 text-xs font-bold text-white">
            {card.value}
          </div>
          <div className="absolute bottom-1 right-1 text-xs font-bold text-white transform rotate-180">
            {card.value}
          </div>
        </>
      )}
    </motion.div>
  );
};