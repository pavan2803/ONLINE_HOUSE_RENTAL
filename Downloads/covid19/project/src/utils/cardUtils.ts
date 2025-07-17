import { Card, CardColor, CardType } from '../types/game';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  // Number cards (0-9)
  colors.forEach(color => {
    // One 0 card per color
    deck.push({
      id: `${color}-0-${Math.random()}`,
      color,
      type: 'number',
      value: 0
    });
    
    // Two of each number 1-9 per color
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 2; j++) {
        deck.push({
          id: `${color}-${i}-${j}-${Math.random()}`,
          color,
          type: 'number',
          value: i
        });
      }
    }
    
    // Action cards (2 of each per color)
    const actionTypes: CardType[] = ['skip', 'reverse', 'draw2'];
    actionTypes.forEach(type => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: `${color}-${type}-${i}-${Math.random()}`,
          color,
          type
        });
      }
    });
  });
  
  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild-${i}-${Math.random()}`,
      color: 'wild',
      type: 'wild'
    });
    
    deck.push({
      id: `wild4-${i}-${Math.random()}`,
      color: 'wild',
      type: 'wild4'
    });
  }
  
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const canPlayCard = (card: Card, topCard: Card, currentColor: CardColor): boolean => {
  if (card.type === 'wild' || card.type === 'wild4') {
    return true;
  }
  
  return card.color === currentColor || 
         card.color === topCard.color || 
         (card.type === topCard.type && card.type !== 'number') ||
         (card.type === 'number' && topCard.type === 'number' && card.value === topCard.value);
};

export const getCardColor = (color: CardColor): string => {
  const colorMap = {
    red: '#FF5555',
    blue: '#5555FF',
    green: '#55AA55',
    yellow: '#FFAA00',
    wild: '#333333'
  };
  return colorMap[color];
};

export const getCardDisplayText = (card: Card): string => {
  if (card.type === 'number') return card.value?.toString() || '0';
  if (card.type === 'skip') return 'SKIP';
  if (card.type === 'reverse') return '⟲';
  if (card.type === 'draw2') return '+2';
  if (card.type === 'wild') return 'WILD';
  if (card.type === 'wild4') return '+4';
  return '';
};

export const calculateCardScore = (card: Card): number => {
  if (card.type === 'number') return card.value || 0;
  if (card.type === 'skip' || card.type === 'reverse' || card.type === 'draw2') return 20;
  if (card.type === 'wild' || card.type === 'wild4') return 50;
  return 0;
};