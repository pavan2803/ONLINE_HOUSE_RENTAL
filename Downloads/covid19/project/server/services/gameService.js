const Game = require('../models/Game');
const { GameStats, AILearningData } = require('../models/GameStats');
const { 
  createDeck, 
  getPlayableCards, 
  applyCardEffect, 
  checkWinCondition, 
  reshuffleDiscardPile,
  calculateCardScore
} = require('../utils/gameLogic');
const { v4: uuidv4 } = require('uuid');

class GameService {
  constructor() {
    this.games = new Map();
    this.aiDecisionCache = new Map();
  }

  async createGame() {
    const gameId = uuidv4();
    const deck = createDeck();
    
    const gameState = {
      id: gameId,
      players: [],
      currentPlayerIndex: 0,
      direction: 1,
      drawPile: deck.slice(1), // Remove first card for discard pile
      discardPile: [deck[0]],
      currentColor: deck[0].color === 'wild' ? 'red' : deck[0].color,
      gameStatus: 'waiting',
      winner: null,
      turnStartTime: Date.now(),
      gameStartTime: Date.now()
    };

    this.games.set(gameId, gameState);
    
    // Save to database
    const game = new Game(gameState);
    await game.save();
    
    return gameState;
  }

  async joinGame(gameId, playerName) {
    const gameState = this.games.get(gameId);
    if (!gameState || gameState.players.length >= 4) {
      throw new Error('Game not found or full');
    }

    const playerId = uuidv4();
    const player = {
      id: playerId,
      name: playerName,
      cards: [],
      isAI: false,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        winRate: 0,
        averageCardsLeft: 7,
        favoriteColor: 'red',
        totalPlayTime: 0
      }
    };

    gameState.players.push(player);
    await this.saveGame(gameState);
    
    return { playerId, gameState };
  }

  async addAI(gameId, difficulty = 'medium') {
    const gameState = this.games.get(gameId);
    if (!gameState || gameState.players.length >= 4) {
      throw new Error('Game not found or full');
    }

    const aiId = uuidv4();
    const aiNames = {
      easy: ['Rookie Bot', 'Simple Sam', 'Easy Eddie'],
      medium: ['Smart Sarah', 'Clever Carl', 'Tactical Tom'],
      hard: ['Master Mind', 'Strategic Steve', 'Genius Gina']
    };
    
    const names = aiNames[difficulty];
    const aiName = names[Math.floor(Math.random() * names.length)];

    const aiPlayer = {
      id: aiId,
      name: aiName,
      cards: [],
      isAI: true,
      aiLevel: difficulty,
      stats: await this.getAIStats(difficulty)
    };

    gameState.players.push(aiPlayer);
    await this.saveGame(gameState);
    
    return gameState;
  }

  async startGame(gameId) {
    const gameState = this.games.get(gameId);
    if (!gameState || gameState.players.length < 2) {
      throw new Error('Need at least 2 players to start');
    }

    // Deal 7 cards to each player
    gameState.players.forEach(player => {
      player.cards = gameState.drawPile.splice(0, 7);
    });

    gameState.gameStatus = 'playing';
    gameState.gameStartTime = Date.now();
    
    await this.saveGame(gameState);
    return gameState;
  }

  async playCard(gameId, playerId, card, colorChosen = null) {
    const gameState = this.games.get(gameId);
    if (!gameState || gameState.gameStatus !== 'playing') {
      throw new Error('Game not found or not in progress');
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      throw new Error('Not your turn');
    }

    // Remove card from player's hand
    const cardIndex = currentPlayer.cards.findIndex(c => c.id === card.id);
    if (cardIndex === -1) {
      throw new Error('Card not in hand');
    }

    currentPlayer.cards.splice(cardIndex, 1);
    gameState.discardPile.push(card);

    // Apply card effects
    applyCardEffect(gameState, card, colorChosen);
    
    // Check win condition
    checkWinCondition(gameState);

    // Record move for AI learning
    if (currentPlayer.isAI) {
      await this.recordAIMove(gameState, currentPlayer, card, colorChosen);
    }

    await this.saveGame(gameState);
    
    // Process AI turns
    if (gameState.gameStatus === 'playing') {
      await this.processAITurns(gameState);
    }

    return gameState;
  }

  async drawCard(gameId, playerId) {
    const gameState = this.games.get(gameId);
    if (!gameState || gameState.gameStatus !== 'playing') {
      throw new Error('Game not found or not in progress');
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      throw new Error('Not your turn');
    }

    reshuffleDiscardPile(gameState);
    
    if (gameState.drawPile.length > 0) {
      const drawnCard = gameState.drawPile.shift();
      currentPlayer.cards.push(drawnCard);
      
      // Move to next player
      gameState.currentPlayerIndex = (gameState.currentPlayerIndex + gameState.direction + gameState.players.length) % gameState.players.length;
      gameState.turnStartTime = Date.now();
    }

    await this.saveGame(gameState);
    
    // Process AI turns
    if (gameState.gameStatus === 'playing') {
      await this.processAITurns(gameState);
    }

    return gameState;
  }

  async processAITurns(gameState) {
    while (gameState.gameStatus === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      
      if (!currentPlayer.isAI) {
        break; // Wait for human player
      }

      const decision = await this.makeAIDecision(gameState, currentPlayer);
      
      if (decision.cardToPlay) {
        await this.playCard(gameState.id, currentPlayer.id, decision.cardToPlay, decision.colorToChoose);
      } else {
        await this.drawCard(gameState.id, currentPlayer.id);
      }

      // Small delay to make AI moves visible
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async makeAIDecision(gameState, aiPlayer) {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    const playableCards = getPlayableCards(aiPlayer.cards, topCard, gameState.currentColor);
    
    if (playableCards.length === 0) {
      return { confidence: 1.0, reasoning: 'No playable cards, must draw' };
    }

    const difficulty = aiPlayer.aiLevel;
    let selectedCard = null;
    let selectedColor = null;
    let confidence = 0;
    let reasoning = '';

    switch (difficulty) {
      case 'easy':
        // Play first available card
        selectedCard = playableCards[0];
        confidence = 0.3;
        reasoning = 'Playing first available card';
        break;

      case 'medium':
        // Prefer action cards and high-value cards
        selectedCard = this.selectMediumAICard(playableCards, gameState);
        confidence = 0.6;
        reasoning = 'Playing strategically valuable card';
        break;

      case 'hard':
        // Advanced strategy with learning
        const decision = await this.selectHardAICard(playableCards, gameState, aiPlayer);
        selectedCard = decision.card;
        selectedColor = decision.color;
        confidence = decision.confidence;
        reasoning = decision.reasoning;
        break;
    }

    // Choose color for wild cards
    if ((selectedCard.type === 'wild' || selectedCard.type === 'wild4') && !selectedColor) {
      selectedColor = this.chooseWildColor(aiPlayer.cards, gameState);
    }

    return {
      cardToPlay: selectedCard,
      colorToChoose: selectedColor,
      confidence,
      reasoning
    };
  }

  selectMediumAICard(playableCards, gameState) {
    // Prioritize action cards
    const actionCards = playableCards.filter(card => 
      ['skip', 'reverse', 'draw2', 'wild4'].includes(card.type)
    );
    
    if (actionCards.length > 0) {
      return actionCards[0];
    }

    // Then wild cards
    const wildCards = playableCards.filter(card => card.type === 'wild');
    if (wildCards.length > 0) {
      return wildCards[0];
    }

    // Finally, highest number card
    const numberCards = playableCards.filter(card => card.type === 'number');
    if (numberCards.length > 0) {
      return numberCards.reduce((highest, card) => 
        (card.value || 0) > (highest.value || 0) ? card : highest
      );
    }

    return playableCards[0];
  }

  async selectHardAICard(playableCards, gameState, aiPlayer) {
    // Load AI learning data
    const learningData = await this.getAILearningData(aiPlayer.aiLevel);
    
    // Calculate expected value for each card
    const cardEvaluations = playableCards.map(card => {
      const expectedValue = this.calculateCardExpectedValue(card, gameState, learningData);
      const riskLevel = this.calculateRiskLevel(card, gameState);
      
      return {
        card,
        expectedValue,
        riskLevel,
        score: expectedValue - (riskLevel * 0.3)
      };
    });

    // Sort by score and select best card
    cardEvaluations.sort((a, b) => b.score - a.score);
    const bestCard = cardEvaluations[0];

    let selectedColor = null;
    if (bestCard.card.type === 'wild' || bestCard.card.type === 'wild4') {
      selectedColor = this.chooseOptimalWildColor(aiPlayer.cards, gameState, learningData);
    }

    return {
      card: bestCard.card,
      color: selectedColor,
      confidence: Math.min(bestCard.score / 10, 1.0),
      reasoning: `Selected based on expected value: ${bestCard.expectedValue.toFixed(2)}, risk: ${bestCard.riskLevel.toFixed(2)}`
    };
  }

  calculateCardExpectedValue(card, gameState, learningData) {
    let baseValue = calculateCardScore(card);
    
    // Adjust based on game state
    const opponentCardCounts = gameState.players
      .filter(p => p.id !== gameState.players[gameState.currentPlayerIndex].id)
      .map(p => p.cards.length);
    
    const minOpponentCards = Math.min(...opponentCardCounts);
    
    // Higher value for action cards when opponents have few cards
    if (minOpponentCards <= 2 && ['skip', 'reverse', 'draw2', 'wild4'].includes(card.type)) {
      baseValue *= 1.5;
    }

    // Adjust based on historical performance
    if (learningData.length > 0) {
      const similarSituations = learningData.filter(data => 
        data.actionTaken.card.type === card.type &&
        Math.abs(data.gameState.cardsInHand - gameState.players[gameState.currentPlayerIndex].cards.length) <= 2
      );

      if (similarSituations.length > 0) {
        const avgOutcome = similarSituations.reduce((sum, data) => 
          sum + (data.outcome.won ? 10 : -data.outcome.cardsLeftAtEnd), 0
        ) / similarSituations.length;
        
        baseValue += avgOutcome * 0.1;
      }
    }

    return baseValue;
  }

  calculateRiskLevel(card, gameState) {
    let risk = 0;
    
    // Wild cards are risky if we have many cards of current color
    if (card.type === 'wild' || card.type === 'wild4') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const currentColorCards = currentPlayer.cards.filter(c => c.color === gameState.currentColor);
      risk = currentColorCards.length * 0.5;
    }

    // High-value cards are riskier to hold
    if (card.type === 'number' && (card.value || 0) > 7) {
      risk += 1;
    }

    return risk;
  }

  chooseWildColor(cards, gameState) {
    // Count cards by color
    const colorCounts = {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0
    };

    cards.forEach(card => {
      if (colorCounts.hasOwnProperty(card.color)) {
        colorCounts[card.color]++;
      }
    });

    // Choose color with most cards
    return Object.keys(colorCounts).reduce((a, b) => 
      colorCounts[a] > colorCounts[b] ? a : b
    );
  }

  chooseOptimalWildColor(cards, gameState, learningData) {
    const basicChoice = this.chooseWildColor(cards, gameState);
    
    // Enhance with learning data
    if (learningData.length > 0) {
      const colorPerformance = { red: 0, blue: 0, green: 0, yellow: 0 };
      
      learningData.forEach(data => {
        if (data.actionTaken.colorChosen && data.outcome.won) {
          colorPerformance[data.actionTaken.colorChosen]++;
        }
      });

      const bestColor = Object.keys(colorPerformance).reduce((a, b) => 
        colorPerformance[a] > colorPerformance[b] ? a : b
      );

      return colorPerformance[bestColor] > 0 ? bestColor : basicChoice;
    }

    return basicChoice;
  }

  async recordAIMove(gameState, aiPlayer, card, colorChosen) {
    const learningData = new AILearningData({
      gameId: gameState.id,
      aiLevel: aiPlayer.aiLevel,
      gameState: {
        cardsInHand: aiPlayer.cards.length + 1, // Before playing the card
        opponentCardCounts: gameState.players
          .filter(p => p.id !== aiPlayer.id)
          .map(p => p.cards.length),
        currentColor: gameState.currentColor,
        topCard: gameState.discardPile[gameState.discardPile.length - 2] || gameState.discardPile[0]
      },
      actionTaken: {
        card: {
          color: card.color,
          type: card.type,
          value: card.value
        },
        colorChosen,
        confidence: 0.8, // This would come from the AI decision
        reasoning: 'AI move recorded'
      }
    });

    await learningData.save();
  }

  async getAIStats(difficulty) {
    // Simulate different AI performance levels
    const baseStats = {
      easy: { winRate: 0.15, gamesPlayed: 100 },
      medium: { winRate: 0.35, gamesPlayed: 200 },
      hard: { winRate: 0.65, gamesPlayed: 500 }
    };

    const stats = baseStats[difficulty];
    return {
      gamesPlayed: stats.gamesPlayed,
      gamesWon: Math.floor(stats.gamesPlayed * stats.winRate),
      winRate: stats.winRate,
      averageCardsLeft: difficulty === 'easy' ? 3.5 : difficulty === 'medium' ? 2.2 : 1.1,
      favoriteColor: ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)],
      totalPlayTime: stats.gamesPlayed * 300 // 5 minutes average per game
    };
  }

  async getAILearningData(aiLevel) {
    try {
      return await AILearningData.find({ aiLevel }).limit(1000).sort({ timestamp: -1 });
    } catch (error) {
      console.error('Error fetching AI learning data:', error);
      return [];
    }
  }

  async saveGame(gameState) {
    try {
      await Game.findOneAndUpdate(
        { id: gameState.id },
        gameState,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }

  async endGame(gameState) {
    if (gameState.gameStatus === 'finished') {
      // Update player stats
      const winner = gameState.players.find(p => p.id === gameState.winner);
      const gameDuration = Date.now() - gameState.gameStartTime;

      // Save game analytics
      const analytics = new GameStats({
        gameId: gameState.id,
        duration: gameDuration,
        totalTurns: 0, // This would be tracked during the game
        winner: gameState.winner,
        winnerName: winner?.name,
        finalScores: gameState.players.map(p => ({
          playerId: p.id,
          playerName: p.name,
          cardsLeft: p.cards.length,
          isAI: p.isAI,
          aiLevel: p.aiLevel
        }))
      });

      await analytics.save();

      // Update AI learning outcomes
      if (winner?.isAI) {
        await AILearningData.updateMany(
          { gameId: gameState.id },
          { $set: { 'outcome.won': true, 'outcome.cardsLeftAtEnd': 0 } }
        );
      }
    }
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }
}

module.exports = new GameService();