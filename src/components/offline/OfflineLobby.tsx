'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, ShieldAlert, Grid, Gauge, Timer, Plus, Edit2, Check, Play, Settings, Trophy, Trash2 } from 'lucide-react';
import { OfflinePlayer, OfflineGameSettings } from '@/lib/types';

interface OfflineLobbyProps {
  settings: OfflineGameSettings;
  players: OfflinePlayer[];
  scores: Record<string, number>;
  onStartRound: (players: OfflinePlayer[]) => void;
  onOpenSettings: () => void;
  onBackToMenu: () => void;
  onOpenLeaderboard?: () => void;
}

export const OfflineLobby: React.FC<OfflineLobbyProps> = ({
  settings,
  players: initialPlayers,
  scores,
  onStartRound,
  onOpenSettings,
  onBackToMenu,
  onOpenLeaderboard,
}) => {
  const [players, setPlayers] = useState<OfflinePlayer[]>(() => {
    if (initialPlayers.length >= 3) return initialPlayers;
    const list: OfflinePlayer[] = [];
    for (let i = 1; i <= settings.numPlayers; i++) {
      list.push({
        id: `p_${i}_${Math.random().toString(36).substring(2, 7)}`,
        name: `Player ${i}`,
        score: 0,
      });
    }
    return list;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleStartEditing = (player: OfflinePlayer) => {
    setEditingId(player.id);
    setTempName(player.name);
  };

  const handleSaveEditing = (id: string) => {
    const trimmed = tempName.trim();
    if (!trimmed) {
      setValidationError('Player name cannot be empty');
      return;
    }
    setValidationError(null);
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p))
    );
    setEditingId(null);
  };

  const handleAddPlayer = () => {
    if (players.length >= 10) return;
    const nextNum = players.length + 1;
    const newPlayer: OfflinePlayer = {
      id: `p_${nextNum}_${Math.random().toString(36).substring(2, 7)}`,
      name: `Player ${nextNum}`,
      score: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      setValidationError('At least 3 players are required');
      return;
    }
    const names = players.map((p) => p.name.trim().toLowerCase());
    const hasDuplicates = new Set(names).size !== names.length;
    if (hasDuplicates) {
      setValidationError('Player names must be unique');
      return;
    }

    setValidationError(null);
    onStartRound(players);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-3xl mx-auto py-6 px-4 space-y-6"
    >
      {/* Lobby Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/20 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-accent-cyan" />
            <span>Back to Menu</span>
          </button>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white gradient-text">Offline Lobby</h2>
            <p className="text-xs text-gray-400">Play together on one device</p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenLeaderboard && (
              <button
                onClick={onOpenLeaderboard}
                className="p-2 rounded-xl bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber border border-accent-amber/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="View Offline Leaderboard"
              >
                <Trophy className="w-4 h-4 text-accent-amber" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>
            )}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Edit Game Settings"
            >
              <Settings className="w-4 h-4 text-accent-cyan" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Entered Game Setup Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface/80 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Players</span>
            <span className="text-base font-black text-white">{players.length} Players</span>
          </div>

          <div className="bg-surface/80 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Imposters</span>
            <span className="text-base font-black text-accent-rose">
              {settings.numImposters} {settings.numImposters === 1 ? 'Imposter' : 'Imposters'}
            </span>
          </div>

          <div className="bg-surface/80 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category</span>
            <span className="text-base font-black text-primary-400">{settings.category}</span>
          </div>

          <div className="bg-surface/80 p-3 rounded-2xl border border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Difficulty</span>
            <span className="text-base font-black text-accent-emerald">{settings.difficulty}</span>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="bg-accent-rose/10 border border-accent-rose/30 text-accent-rose px-4 py-2.5 rounded-xl text-xs font-semibold text-center">
            {validationError}
          </div>
        )}

        {/* Players Roster */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-cyan" />
              <span>Player Roster ({players.length}/10)</span>
            </h3>
            {players.length < 10 && (
              <button
                type="button"
                onClick={handleAddPlayer}
                className="text-xs font-bold text-accent-cyan hover:text-white flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Player</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence>
              {players.map((player, idx) => {
                const winCount = scores[player.id] || 0;
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between bg-surface p-3.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-7 h-7 rounded-lg bg-surface-hover flex items-center justify-center text-xs font-black text-primary-400 font-mono">
                        #{idx + 1}
                      </span>

                      {editingId === player.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            maxLength={15}
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditing(player.id);
                            }}
                            autoFocus
                            className="w-full bg-background border border-primary-500 rounded-xl px-3 py-1 text-sm font-bold text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveEditing(player.id)}
                            className="p-1.5 rounded-xl bg-accent-emerald text-white hover:scale-105 transition-transform"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm tracking-wide">
                            {player.name}
                          </span>
                          {winCount > 0 && (
                            <span className="text-[10px] text-accent-amber font-extrabold flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {winCount} {winCount === 1 ? 'Win' : 'Wins'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {editingId !== player.id && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEditing(player)}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Rename Player"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-accent-cyan" />
                        </button>
                        {players.length > 3 && (
                          <button
                            onClick={() => handleRemovePlayer(player.id)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-accent-rose/20 text-gray-400 hover:text-accent-rose transition-colors"
                            title="Remove Player"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Big Start Round Button */}
        <button
          type="button"
          onClick={handleStartGame}
          className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START PLAYING ROUND</span>
        </button>
      </div>
    </motion.div>
  );
};
