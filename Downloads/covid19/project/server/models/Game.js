const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: String,
  color: {
    type: String,
    enum: ['red', 'blue', 'green', 'yellow', 'wild']
  },
  type: {
    type: String,
    enum: ['number', 'skip', 'reverse', 'draw2', 'wild', 'wild4']
  },
  value: Number
});

const playerStatsSchema = new mongoose.Schema({
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  averageCardsLeft: { type: Number, default: 7 },
  favoriteColor: {
    type: String,
    enum: ['red', 'blue', 'green', 'yellow'],
    default: 'red'
  },
  totalPlayTime: { type: Number, default: 0 }
});

const playerSchema = new mongoose.Schema({
  id: String,
  name: String,
  cards: [cardSchema],
  isAI: { type: Boolean, default: false },
  aiLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  stats: playerStatsSchema
});

const gameSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  players: [playerSchema],
  currentPlayerIndex: { type: Number, default: 0 },
  direction: { type: Number, default: 1 },
  drawPile: [cardSchema],
  discardPile: [cardSchema],
  currentColor: {
    type: String,
    enum: ['red', 'blue', 'green', 'yellow', 'wild'],
    default: 'red'
  },
  gameStatus: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  winner: String,
  turnStartTime: { type: Number, default: Date.now },
  gameStartTime: { type: Number, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

gameSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Game', gameSchema);