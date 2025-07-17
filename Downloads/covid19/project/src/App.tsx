import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lobby } from './components/Lobby';
import { GameBoard } from './components/GameBoard';
import { useSocket } from './hooks/useSocket';
import { Wifi, WifiOff, Loader } from 'lucide-react';

function App() {
  const {
    gameState,
    playerId,
    connected,
    reconnectAttempts,
    maxReconnectAttempts,
    joinGame,
    addAI,
    startGame,
    playCard,
    drawCard,
    selectColor,
  } = useSocket();

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
          connected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {connected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Connected</span>
          </>
        ) : reconnectAttempts > 0 && reconnectAttempts < maxReconnectAttempts ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Reconnecting... ({reconnectAttempts}/{maxReconnectAttempts})</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Disconnected</span>
          </>
        )}
      </motion.div>
    </div>
  );

  // Loading screen
  if (!connected && reconnectAttempts === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connecting to Game Server...</h2>
          <p className="text-gray-300">Please wait while we establish connection</p>
        </motion.div>
      </div>
    );
  }

  // Disconnected state
  if (!connected && reconnectAttempts >= maxReconnectAttempts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center text-white max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <WifiOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Connection Lost</h2>
          <p className="text-gray-300 mb-4">
            Unable to connect to the game server. Please check your internet connection and refresh the page.
          </p>
          <motion.button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ConnectionStatus />
      
      <AnimatePresence mode="wait">
        {!gameState || gameState.gameStatus === 'waiting' ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Lobby
              players={gameState?.players || []}
              onJoinGame={joinGame}
              onStartGame={startGame}
              onAddAI={addAI}
              canStart={(gameState?.players.length || 0) >= 2}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameBoard
              gameState={gameState}
              currentPlayerId={playerId}
              onCardPlay={playCard}
              onColorSelect={selectColor}
              onDrawCard={drawCard}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;