import React from 'react';
import { motion } from 'framer-motion';
import { CardColor } from '../types/game';
import { getCardColor } from '../utils/cardUtils';

interface ColorSelectorProps {
  onColorSelect: (color: CardColor) => void;
  onCancel: () => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  onColorSelect,
  onCancel
}) => {
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const colorVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-8 shadow-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Choose a Color
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {colors.map((color) => (
          <motion.button
            key={color}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-white text-sm uppercase tracking-wide"
            style={{ backgroundColor: getCardColor(color) }}
            variants={colorVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onColorSelect(color)}
          >
            {color}
          </motion.button>
        ))}
      </div>
      
      <motion.button
        className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCancel}
      >
        Cancel
      </motion.button>
    </motion.div>
  );
};