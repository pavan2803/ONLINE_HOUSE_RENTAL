import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, Card, CardColor } from '../types/game';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
      reconnectAttempts.current = attempt;
    });

    newSocket.on('reconnect_failed', () => {
      console.log('Failed to reconnect after maximum attempts');
    });

    newSocket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('playerJoined', (data: { playerId: string; gameState: GameState }) => {
      setPlayerId(data.playerId);
      setGameState(data.gameState);
    });

    newSocket.on('gameStarted', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('cardPlayed', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('cardDrawn', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('colorChanged', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('gameEnded', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('error', (error: string) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinGame = (playerName: string) => {
    if (socket) {
      socket.emit('joinGame', { playerName });
    }
  };

  const addAI = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (socket) {
      socket.emit('addAI', { difficulty });
    }
  };

  const startGame = () => {
    if (socket) {
      socket.emit('startGame');
    }
  };

  const playCard = (card: Card) => {
    if (socket) {
      socket.emit('playCard', { card });
    }
  };

  const drawCard = () => {
    if (socket) {
      socket.emit('drawCard');
    }
  };

  const selectColor = (color: CardColor) => {
    if (socket) {
      socket.emit('selectColor', { color });
    }
  };

  return {
    socket,
    gameState,
    playerId,
    connected,
    reconnectAttempts: reconnectAttempts.current,
    maxReconnectAttempts,
    joinGame,
    addAI,
    startGame,
    playCard,
    drawCard,
    selectColor,
  };
};