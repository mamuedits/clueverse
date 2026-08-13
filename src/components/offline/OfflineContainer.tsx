'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  OfflineGameState,
  OfflineGameSettings,
  OfflinePlayer,
  OfflinePhase,
} from '@/lib/types';
import { getFilteredWordPair } from '@/lib/aiWords';
import { generateOfflineRoles, evaluateOfflineWin } from '@/lib/gameLogic';
import { OfflineSetup } from './OfflineSetup';
import { OfflineLobby } from './OfflineLobby';
import { OfflineRevealRoles } from './OfflineRevealRoles';
import { OfflineDiscussion } from './OfflineDiscussion';
import { OfflineVoting } from './OfflineVoting';
import { OfflineResults } from './OfflineResults';

interface OfflineContainerProps {
  onBackToHome: () => void;
}

const DEFAULT_SETTINGS: OfflineGameSettings = {
  numPlayers: 4,
  numImposters: 1,
  category: 'Random',
  difficulty: 'Medium',
  timerEnabled: true,
  timerDuration: 90,
};

export const OfflineContainer: React.FC<OfflineContainerProps> = ({ onBackToHome }) => {
  const [gameState, setGameState] = useState<OfflineGameState>({
    phase: 'SETUP',
    settings: DEFAULT_SETTINGS,
    players: [],
    currentRound: 1,
    wordPair: null,
    votes: {},
    eliminatedPlayerId: null,
    winner: null,
    scores: {},
  });

  // 1. Save Setup -> Go to Lobby
  const handleContinueFromSetup = (newSettings: OfflineGameSettings) => {
    setGameState((prev) => ({
      ...prev,
      settings: newSettings,
      phase: 'LOBBY',
    }));
  };

  // 2. Start Round from Lobby
  const handleStartRound = (playersList: OfflinePlayer[]) => {
    const wordPair = getFilteredWordPair(gameState.settings.category, gameState.settings.difficulty);
    const assignedPlayers = generateOfflineRoles(
      playersList,
      gameState.settings.numImposters,
      wordPair
    );

    const initialScores: Record<string, number> = { ...gameState.scores };
    assignedPlayers.forEach((p) => {
      if (initialScores[p.id] === undefined) initialScores[p.id] = 0;
    });

    setGameState((prev) => ({
      ...prev,
      players: assignedPlayers,
      wordPair,
      currentRound: prev.phase === 'LOBBY' ? prev.currentRound : prev.currentRound + 1,
      phase: 'REVEAL_ROLES',
      eliminatedPlayerId: null,
      winner: null,
      scores: initialScores,
    }));
  };

  // 3. Reveal Roles -> Discussion
  const handleFinishReveal = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'DISCUSSION',
    }));
  };

  // 4. Discussion -> Voting
  const handleEndDiscussion = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'VOTING',
    }));
  };

  // 5. Voting -> Results
  const handleVoteComplete = (eliminatedId: string) => {
    const updatedPlayers = gameState.players.map((p) =>
      p.id === eliminatedId ? { ...p, isEliminated: true } : p
    );

    const winResult = evaluateOfflineWin(updatedPlayers);

    // Update Scores if win condition met
    const updatedScores = { ...gameState.scores };
    if (winResult === 'CIVILIANS') {
      updatedPlayers.forEach((p) => {
        if (p.role === 'CIVILIAN') updatedScores[p.id] = (updatedScores[p.id] || 0) + 1;
      });
    } else if (winResult === 'IMPOSTERS') {
      updatedPlayers.forEach((p) => {
        if (p.role === 'IMPOSTER') updatedScores[p.id] = (updatedScores[p.id] || 0) + 1;
      });
    }

    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      eliminatedPlayerId: eliminatedId,
      winner: winResult,
      scores: updatedScores,
      phase: 'RESULTS',
    }));
  };

  // 6. Play Next Round
  const handleNextRound = () => {
    const nextRound = gameState.currentRound + 1;
    const wordPair = getFilteredWordPair(gameState.settings.category, gameState.settings.difficulty);

    const resetPlayers = gameState.players.map((p) => ({ ...p, isEliminated: false }));
    const assignedPlayers = generateOfflineRoles(
      resetPlayers,
      gameState.settings.numImposters,
      wordPair
    );

    setGameState((prev) => ({
      ...prev,
      currentRound: nextRound,
      players: assignedPlayers,
      wordPair,
      eliminatedPlayerId: null,
      winner: null,
      phase: 'REVEAL_ROLES',
    }));
  };

  // 7. Back to Lobby action (from any phase)
  const handleBackToLobby = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'LOBBY',
    }));
  };

  const eliminatedPlayer = gameState.players.find((p) => p.id === gameState.eliminatedPlayerId);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        {gameState.phase === 'SETUP' && (
          <OfflineSetup
            key="setup"
            initialSettings={gameState.settings}
            onContinue={handleContinueFromSetup}
            onBack={onBackToHome}
          />
        )}

        {gameState.phase === 'LOBBY' && (
          <OfflineLobby
            key="lobby"
            settings={gameState.settings}
            players={gameState.players}
            scores={gameState.scores}
            onStartRound={handleStartRound}
            onOpenSettings={() => setGameState((prev) => ({ ...prev, phase: 'SETUP' }))}
            onBackToMenu={onBackToHome}
          />
        )}

        {gameState.phase === 'REVEAL_ROLES' && gameState.wordPair && (
          <OfflineRevealRoles
            key={`reveal-${gameState.currentRound}`}
            players={gameState.players}
            wordPair={gameState.wordPair}
            onFinishReveal={handleFinishReveal}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {gameState.phase === 'DISCUSSION' && (
          <OfflineDiscussion
            key={`discussion-${gameState.currentRound}`}
            settings={gameState.settings}
            wordPair={gameState.wordPair}
            round={gameState.currentRound}
            onEndDiscussion={handleEndDiscussion}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {gameState.phase === 'VOTING' && (
          <OfflineVoting
            key={`voting-${gameState.currentRound}`}
            players={gameState.players}
            onVoteComplete={handleVoteComplete}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {gameState.phase === 'RESULTS' && (
          <OfflineResults
            key={`results-${gameState.currentRound}`}
            eliminatedPlayer={eliminatedPlayer}
            wordPair={gameState.wordPair}
            players={gameState.players}
            currentRound={gameState.currentRound}
            gameWinner={gameState.winner}
            onNextRound={handleNextRound}
            onBackToLobby={handleBackToLobby}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
