import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types/game';
import { Users, Bot, Play, Settings } from 'lucide-react';

interface LobbyProps {
  players: Player[];
  onJoinGame: (playerName: string) => void;
  onStartGame: () => void;
  onAddAI: (difficulty: 'easy' | 'medium' | 'hard') => void;
  canStart: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({
  players,
  onJoinGame,
  onStartGame,
  onAddAI,
  canStart
}) => {
  const [playerName, setPlayerName] = useState('');
  const [showAIOptions, setShowAIOptions] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onJoinGame(playerName.trim());
      setPlayerName('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">UNO Game Lobby</h1>
          <p className="text-gray-600">Join or create a game with friends and AI opponents</p>
        </motion.div>

        {/* Player list */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Players ({players.length}/4)
            </h2>
          </div>
          
          <div className="space-y-3">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{player.name}</div>
                    <div className="text-sm text-gray-500">
                      {player.isAI ? (
                        <div className="flex items-center space-x-1">
                          <Bot className="w-3 h-3" />
                          <span>AI ({player.aiLevel})</span>
                        </div>
                      ) : (
                        'Human Player'
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div>Win Rate: {(player.stats.winRate * 100).toFixed(1)}%</div>
                  <div>Games: {player.stats.gamesPlayed}</div>
                </div>
              </motion.div>
            ))}
            
            {players.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No players yet. Join the game to get started!
              </div>
            )}
          </div>
        </motion.div>

        {/* Join form */}
        {players.length < 4 && (
          <motion.form onSubmit={handleJoin} className="mb-6" variants={itemVariants}>
            <div className="flex space-x-3">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />
              <motion.button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!playerName.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Game
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* AI controls */}
        {players.length < 4 && (
          <motion.div className="mb-6" variants={itemVariants}>
            <motion.button
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-3"
              onClick={() => setShowAIOptions(!showAIOptions)}
              whileHover={{ scale: 1.02 }}
            >
              <Bot className="w-4 h-4" />
              <span>Add AI Player</span>
              <Settings className="w-4 h-4" />
            </motion.button>
            
            {showAIOptions && (
              <motion.div
                className="flex space-x-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                  <motion.button
                    key={difficulty}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      difficulty === 'easy' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                      difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                      'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                    onClick={() => onAddAI(difficulty)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} AI
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Start game button */}
        <motion.div className="text-center" variants={itemVariants}>
          <motion.button
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            onClick={onStartGame}
            disabled={!canStart}
            whileHover={canStart ? { scale: 1.05 } : {}}
            whileTap={canStart ? { scale: 0.95 } : {}}
          >
            <Play className="w-5 h-5" />
            <span>Start Game</span>
          </motion.button>
          
          {!canStart && (
            <p className="text-sm text-gray-500 mt-2">
              Need at least 2 players to start the game
            </p>
          )}
        </motion.div>

        {/* Game rules */}
        <motion.div className="mt-8 p-4 bg-gray-50 rounded-lg" variants={itemVariants}>
          <h3 className="font-semibold text-gray-800 mb-2">Quick Rules:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Match the color or number of the top card</li>
            <li>• Use action cards strategically (Skip, Reverse, Draw 2)</li>
            <li>• Wild cards can be played anytime and change the color</li>
            <li>• Say "UNO" when you have one card left!</li>
            <li>• First player to empty their hand wins</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};