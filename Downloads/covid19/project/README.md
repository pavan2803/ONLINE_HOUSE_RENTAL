# 🎮 UNO Gaming App - Full-Stack with AI Learning

A comprehensive, production-ready UNO card game with advanced AI opponents that learn from gameplay patterns. Built with modern web technologies and real-time multiplayer capabilities.

## 🌟 Features

### 🎯 **Core Gameplay**
- **Complete UNO Rules**: All card types, actions, and game mechanics
- **2-4 Player Support**: Human players and AI opponents
- **Real-time Multiplayer**: Instant game updates with Socket.IO
- **Beautiful UI**: Smooth animations, card effects, and responsive design
- **Cross-platform**: Works on desktop, tablet, and mobile devices

### 🤖 **Advanced AI System**
- **3 Difficulty Levels**: Easy, Medium, and Hard AI opponents
- **Machine Learning**: AI learns from past games and improves strategy
- **Strategic Decision Making**: Advanced card evaluation and risk assessment
- **Adaptive Behavior**: AI adjusts strategy based on game state and opponents

### 📊 **Analytics & Learning**
- **Game Statistics**: Comprehensive tracking of all game events
- **Player Performance**: Win rates, favorite colors, play patterns
- **AI Learning Data**: Decision trees, outcome analysis, strategy evolution
- **Leaderboards**: Global rankings and performance metrics

### 🎨 **Premium Design**
- **Apple-level Aesthetics**: Clean, sophisticated visual design
- **Smooth Animations**: Card dealing, playing, and transition effects
- **Responsive Layout**: Optimized for all screen sizes
- **Intuitive UX**: Clear visual feedback and game state indicators

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** with TypeScript for type safety
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** for responsive, utility-first styling
- **Socket.IO Client** for real-time communication
- **Vite** for fast development and building

### **Backend**
- **Node.js** with Express for robust server architecture
- **Socket.IO** for real-time multiplayer functionality
- **MongoDB** with Mongoose for data persistence
- **Advanced Game Logic** with comprehensive rule engine
- **AI Decision Engine** with learning capabilities

### **Database Schema**
- **Game States**: Complete game persistence and recovery
- **Player Statistics**: Performance tracking and analytics
- **AI Learning Data**: Decision patterns and outcome analysis
- **Game Analytics**: Comprehensive gameplay metrics

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Modern web browser

### **Installation**

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd uno-gaming-app
npm install
cd server && npm install && cd ..
```

2. **Set up MongoDB:**
```bash
# Local MongoDB
mongod

# Or update server/.env with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/uno-game
```

3. **Start the application:**
```bash
# Start both frontend and backend
npm run start:full

# Or start separately:
npm run dev          # Frontend (http://localhost:5173)
npm run server       # Backend (http://localhost:3001)
```

## 🎮 **How to Play**

### **Game Setup**
1. **Join Game**: Enter your name to join the lobby
2. **Add Players**: Invite friends or add AI opponents
3. **Choose AI Difficulty**: Easy, Medium, or Hard AI players
4. **Start Game**: Begin when 2-4 players are ready

### **Gameplay**
- **Match Cards**: Play cards that match color or number
- **Action Cards**: Use Skip, Reverse, Draw 2 strategically  
- **Wild Cards**: Change color and force opponents to draw
- **Win Condition**: First player to empty their hand wins
- **UNO Rule**: Remember to call "UNO" with one card left!

### **AI Opponents**
- **Easy AI**: Basic strategy, plays first available card
- **Medium AI**: Tactical play, prioritizes action cards
- **Hard AI**: Advanced strategy with learning from past games

## 📊 **API Endpoints**

### **Game Statistics**
```bash
GET /api/stats/games           # Recent game history
GET /api/stats/leaderboard     # Player rankings
GET /api/stats/ai-learning     # AI learning data
```

### **Real-time Events**
- `gameState` - Current game state updates
- `playerJoined` - New player joined lobby
- `gameStarted` - Game began
- `cardPlayed` - Card was played
- `gameEnded` - Game finished

## 🧠 **AI Learning System**

### **Learning Mechanisms**
- **Decision Recording**: Every AI move is logged with context
- **Outcome Analysis**: Win/loss patterns inform future decisions
- **Strategy Evolution**: AI adapts based on successful patterns
- **Opponent Modeling**: AI learns to counter human strategies

### **Performance Metrics**
- **Win Rate Tracking**: AI performance across difficulty levels
- **Decision Confidence**: How certain AI is about each move
- **Strategic Depth**: Complex multi-turn planning capabilities
- **Adaptation Speed**: How quickly AI learns new patterns

## 🎯 **Game Features**

### **Advanced Mechanics**
- **Complete Rule Set**: All official UNO rules implemented
- **Card Validation**: Prevents invalid moves
- **Turn Management**: Proper turn order with direction changes
- **Deck Management**: Automatic reshuffling when needed

### **User Experience**
- **Visual Feedback**: Clear indicators for playable cards
- **Turn Indicators**: Always know whose turn it is
- **Game State**: Real-time updates of all game information
- **Error Handling**: Graceful handling of connection issues

## 🔧 **Development**

### **Project Structure**
```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── models/            # MongoDB schemas
│   ├── services/          # Business logic
│   └── utils/             # Server utilities
└── README.md              # This file
```

### **Key Components**
- **GameBoard**: Main game interface with card play area
- **PlayerHand**: Individual player card management
- **Lobby**: Pre-game player management
- **AI Service**: Advanced AI decision making
- **Game Logic**: Complete UNO rule implementation

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build              # Build frontend
cd server && npm start     # Start production server
```

### **Environment Variables**
```bash
MONGODB_URI=mongodb://localhost:27017/uno-game
PORT=3001
NODE_ENV=production
```

## 🎨 **Design Philosophy**

This UNO game follows Apple's design principles:
- **Simplicity**: Clean, uncluttered interface
- **Intuitive**: Natural user interactions
- **Responsive**: Smooth performance across devices
- **Accessible**: Clear visual hierarchy and feedback
- **Delightful**: Engaging animations and micro-interactions

## 🤝 **Contributing**

This is a showcase project demonstrating full-stack development skills, real-time gaming, and AI implementation. The codebase is structured for maintainability and extensibility.

## 📄 **License**

This project is created for educational and portfolio purposes, demonstrating modern web development techniques and AI integration in gaming applications.

---

**Built with ❤️ using React, Node.js, and MongoDB**

*A comprehensive demonstration of full-stack development, real-time communication, and AI learning systems in a fun, engaging card game format.*