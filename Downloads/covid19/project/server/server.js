const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const gameService = require('./services/gameService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uno-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Game state
let currentGame = null;

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Create or join existing game
  if (!currentGame) {
    currentGame = await gameService.createGame();
  }

  socket.join(currentGame.id);
  socket.emit('gameState', currentGame);

  socket.on('joinGame', async (data) => {
    try {
      const { playerName } = data;
      const result = await gameService.joinGame(currentGame.id, playerName);
      
      socket.playerId = result.playerId;
      currentGame = result.gameState;
      
      socket.emit('playerJoined', result);
      socket.to(currentGame.id).emit('gameState', currentGame);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('addAI', async (data) => {
    try {
      const { difficulty } = data;
      currentGame = await gameService.addAI(currentGame.id, difficulty);
      
      io.to(currentGame.id).emit('gameState', currentGame);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('startGame', async () => {
    try {
      currentGame = await gameService.startGame(currentGame.id);
      
      io.to(currentGame.id).emit('gameStarted', currentGame);
      
      // Process AI turns if first player is AI
      if (currentGame.players[0].isAI) {
        await gameService.processAITurns(currentGame);
        io.to(currentGame.id).emit('gameState', currentGame);
      }
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('playCard', async (data) => {
    try {
      const { card } = data;
      currentGame = await gameService.playCard(currentGame.id, socket.playerId, card);
      
      io.to(currentGame.id).emit('cardPlayed', currentGame);
      
      if (currentGame.gameStatus === 'finished') {
        await gameService.endGame(currentGame);
        io.to(currentGame.id).emit('gameEnded', currentGame);
      }
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('selectColor', async (data) => {
    try {
      const { color } = data;
      currentGame.currentColor = color;
      
      io.to(currentGame.id).emit('colorChanged', currentGame);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('drawCard', async () => {
    try {
      currentGame = await gameService.drawCard(currentGame.id, socket.playerId);
      
      io.to(currentGame.id).emit('cardDrawn', currentGame);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Handle player leaving (in a real app, you might want to pause the game or replace with AI)
    if (currentGame && currentGame.players.length === 1) {
      // Reset game if only one player left
      currentGame = null;
    }
  });
});

// REST API endpoints for game statistics
app.get('/api/stats/games', async (req, res) => {
  try {
    const { GameStats } = require('./models/GameStats');
    const stats = await GameStats.find().sort({ createdAt: -1 }).limit(100);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/ai-learning', async (req, res) => {
  try {
    const { AILearningData } = require('./models/GameStats');
    const { aiLevel } = req.query;
    
    const query = aiLevel ? { aiLevel } : {};
    const learningData = await AILearningData.find(query)
      .sort({ timestamp: -1 })
      .limit(1000);
    
    res.json(learningData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/leaderboard', async (req, res) => {
  try {
    const { GameStats } = require('./models/GameStats');
    const leaderboard = await GameStats.aggregate([
      { $unwind: '$finalScores' },
      {
        $group: {
          _id: '$finalScores.playerName',
          totalGames: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$finalScores.cardsLeft', 0] }, 1, 0]
            }
          },
          averageCardsLeft: { $avg: '$finalScores.cardsLeft' },
          isAI: { $first: '$finalScores.isAI' },
          aiLevel: { $first: '$finalScores.aiLevel' }
        }
      },
      {
        $project: {
          playerName: '$_id',
          totalGames: 1,
          wins: 1,
          winRate: { $divide: ['$wins', '$totalGames'] },
          averageCardsLeft: 1,
          isAI: 1,
          aiLevel: 1
        }
      },
      { $sort: { winRate: -1, totalGames: -1 } },
      { $limit: 50 }
    ]);
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 UNO Game Server running on port ${PORT}`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/stats/`);
});