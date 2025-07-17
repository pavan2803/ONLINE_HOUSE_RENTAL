const mongoose = require('mongoose');

const playerMoveSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  cardPlayed: {
    id: String,
    color: String,
    type: String,
    value: Number
  },
  colorChosen: String,
  turnDuration: Number,
  cardsInHand: Number,
  timestamp: { type: Number, default: Date.now }
});

const gameAnalyticsSchema = new mongoose.Schema({
  gameId: { type: String, unique: true },
  duration: Number,
  totalTurns: Number,
  playerMoves: [playerMoveSchema],
  winner: String,
  winnerName: String,
  finalScores: [{
    playerId: String,
    playerName: String,
    cardsLeft: Number,
    isAI: Boolean,
    aiLevel: String
  }],
  aiPerformance: [{
    playerId: String,
    aiLevel: String,
    averageDecisionTime: Number,
    winProbability: Number,
    strategicMoves: Number,
    totalMoves: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const aiLearningDataSchema = new mongoose.Schema({
  gameId: String,
  aiLevel: String,
  gameState: {
    cardsInHand: Number,
    opponentCardCounts: [Number],
    currentColor: String,
    topCard: {
      color: String,
      type: String,
      value: Number
    }
  },
  availableActions: [{
    card: {
      color: String,
      type: String,
      value: Number
    },
    expectedValue: Number,
    riskLevel: Number
  }],
  actionTaken: {
    card: {
      color: String,
      type: String,
      value: Number
    },
    colorChosen: String,
    confidence: Number,
    reasoning: String
  },
  outcome: {
    won: Boolean,
    cardsLeftAtEnd: Number,
    gamePosition: Number
  },
  timestamp: { type: Date, default: Date.now }
});

const GameStats = mongoose.model('GameStats', gameAnalyticsSchema);
const AILearningData = mongoose.model('AILearningData', aiLearningDataSchema);

module.exports = { GameStats, AILearningData };