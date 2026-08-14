export type PlayerRole = 'CIVILIAN' | 'IMPOSTER' | null;

export type GamePhase = 'LANDING' | 'LOBBY' | 'GAME_ROUND' | 'VOTING' | 'RESULTS';

export interface Player {
  id: string;
  socketId: string;
  name: string;
  isHost: boolean;
  role?: PlayerRole;
  secretWord?: string;
  hasVoted?: boolean;
  voteTargetId?: string;
  isConnected: boolean;
  score?: number;
}

export interface Clue {
  id: string;
  round: number; // 1, 2, 3
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface WordPair {
  civilianWord: string;
  imposterWord: string;
  category: string;
  hint?: string;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  numImposters: number;
  maxPlayers: number;
  state: GamePhase;
  isLocked: boolean;
  currentRound: number; // 1, 2, 3
  turnOrder: string[]; // array of playerIds
  currentTurnIndex: number;
  clues: Clue[];
  chatMessages: ChatMessage[];
  wordPair: WordPair | null;
  votes: Record<string, string>; // voterId -> targetPlayerId
  winner: 'CIVILIANS' | 'IMPOSTERS' | null;
}

export type OfflinePhase = 
  | 'SETUP' 
  | 'LOBBY'
  | 'REVEAL_ROLES' 
  | 'DISCUSSION' 
  | 'VOTING' 
  | 'RESULTS';

export interface OfflinePlayer {
  id: string;
  name: string;
  role?: PlayerRole;
  secretWord?: string;
  isEliminated?: boolean;
  score?: number;
}

export interface OfflineGameSettings {
  numPlayers: number;
  numImposters: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timerEnabled: boolean;
  timerDuration: number; // in seconds: 30, 60, 90, 120, 180
}

export interface OfflineGameState {
  phase: OfflinePhase;
  settings: OfflineGameSettings;
  players: OfflinePlayer[];
  currentRound: number;
  wordPair: WordPair | null;
  votes: Record<string, string>; // voterId -> targetPlayerId
  eliminatedPlayerId?: string | null;
  winner: 'CIVILIANS' | 'IMPOSTERS' | null;
  scores: Record<string, number>; // playerId -> total wins/score
}

export interface OfflinePlayerStats {
  name: string;
  totalWins: number;
  civilianWins: number;
  imposterWins: number;
  roundsPlayed: number;
  lastPlayed: string;
}



