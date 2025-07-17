const { v4: uuidv4 } = require('uuid');

const createDeck = () => {
  const deck = [];
  const colors = ['red', 'blue', 'green', 'yellow'];
  
  // Number cards (0-9)
  colors.forEach(color => {
    // One 0 card per color
    deck.push({
      id: uuidv4(),
      color,
      type: 'number',
      value: 0
    });
    
    // Two of each number 1-9 per color
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 2; j++) {
        deck.push({
          id: uuidv4(),
          color,
          type: 'number',
          value: i
        });
      }
    }
    
    // Action cards (2 of each per color)
    const actionTypes = ['skip', 'reverse', 'draw2'];
    actionTypes.forEach(type => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: uuidv4(),
          color,
          type
        });
      }
    });
  });
  
  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: uuidv4(),
      color: 'wild',
      type: 'wild'
    });
    
    deck.push({
      id: uuidv4(),
      color: 'wild',
      type: 'wild4'
    });
  }
  
  return shuffleDeck(deck);
};

const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const canPlayCard = (card, topCard, currentColor) => {
  if (card.type === 'wild' || card.type === 'wild4') {
    return true;
  }
  
  return card.color === currentColor || 
         card.color === topCard.color || 
         (card.type === topCard.type && card.type !== 'number') ||
         (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value);
};

const getPlayableCards = (hand, topCard, currentColor) => {
  return hand.filter(card => canPlayCard(card, topCard, currentColor));
};

const calculateCardScore = (card) => {
  if (card.type === 'number') return card.value || 0;
  if (card.type === 'skip' || card.type === 'reverse' || card.type === 'draw2') return 20;
  if (card.type === 'wild' || card.type === 'wild4') return 50;
  return 0;
};

const getNextPlayerIndex = (currentIndex, direction, playerCount) => {
  if (direction === 1) {
    return (currentIndex + 1) % playerCount;
  } else {
    return currentIndex === 0 ? playerCount - 1 : currentIndex - 1;
  }
};

const applyCardEffect = (gameState, card, colorChosen = null) => {
  const { players, currentPlayerIndex, direction } = gameState;
  let nextPlayerIndex = getNextPlayerIndex(currentPlayerIndex, direction, players.length);
  let newDirection = direction;
  let cardsToDrawNext = 0;

  switch (card.type) {
    case 'skip':
      // Skip next player
      nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, direction, players.length);
      break;
      
    case 'reverse':
      // Reverse direction
      newDirection = direction * -1;
      if (players.length === 2) {
        // In 2-player game, reverse acts like skip
        nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, newDirection, players.length);
      }
      break;
      
    case 'draw2':
      // Next player draws 2 cards
      cardsToDrawNext = 2;
      break;
      
    case 'wild4':
      // Next player draws 4 cards
      cardsToDrawNext = 4;
      break;
  }

  // Draw cards for next player if needed
  if (cardsToDrawNext > 0 && gameState.drawPile.length >= cardsToDrawNext) {
    const cardsToDraw = gameState.drawPile.splice(0, cardsToDrawNext);
    players[nextPlayerIndex].cards.push(...cardsToDraw);
    
    // Skip the player who drew cards
    nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, newDirection, players.length);
  }

  // Update current color for wild cards
  if (card.type === 'wild' || card.type === 'wild4') {
    gameState.currentColor = colorChosen || 'red';
  } else {
    gameState.currentColor = card.color;
  }

  gameState.currentPlayerIndex = nextPlayerIndex;
  gameState.direction = newDirection;
  gameState.turnStartTime = Date.now();

  return gameState;
};

const checkWinCondition = (gameState) => {
  const winner = gameState.players.find(player => player.cards.length === 0);
  if (winner) {
    gameState.gameStatus = 'finished';
    gameState.winner = winner.id;
  }
  return gameState;
};

const reshuffleDiscardPile = (gameState) => {
  if (gameState.drawPile.length === 0 && gameState.discardPile.length > 1) {
    // Keep the top card, shuffle the rest back into draw pile
    const topCard = gameState.discardPile.pop();
    gameState.drawPile = shuffleDeck(gameState.discardPile);
    gameState.discardPile = [topCard];
  }
};

module.exports = {
  createDeck,
  shuffleDeck,
  canPlayCard,
  getPlayableCards,
  calculateCardScore,
  getNextPlayerIndex,
  applyCardEffect,
  checkWinCondition,
  reshuffleDiscardPile
};