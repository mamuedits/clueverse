'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Edit2, Plus, Trash2, ArrowRight, Check } from 'lucide-react';
import { OfflinePlayer } from '@/lib/types';

interface OfflinePlayersProps {
  initialPlayers: OfflinePlayer[];
  numPlayersTarget: number;
  onContinue: (players: OfflinePlayer[]) => void;
  onBack: () => void;
}

export const OfflinePlayers: React.FC<OfflinePlayersProps> = ({
  initialPlayers,
  numPlayersTarget,
  onContinue,
  onBack,
}) => {
  const [players, setPlayers] = useState<OfflinePlayer[]>(() => {
    if (initialPlayers.length > 0) return initialPlayers;
    const list: OfflinePlayer[] = [];
    for (let i = 1; i <= numPlayersTarget; i++) {
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

  const handleContinue = () => {
    if (players.length < 3) {
      setValidationError('At least 3 players are required');
      return;
    }
    // Check for unique non-empty names
    const names = players.map((p) => p.name.trim().toLowerCase());
    const hasDuplicates = new Set(names).size !== names.length;
    if (hasDuplicates) {
      setValidationError('Player names must be unique');
      return;
    }

    setValidationError(null);
    onContinue(players);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-xl mx-auto py-6 px-4"
    >
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-white gradient-text">Players</h2>
            <p className="text-xs text-gray-400">Set player names ({players.length}/10)</p>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-accent-rose/10 border border-accent-rose/30 text-accent-rose px-4 py-2.5 rounded-xl text-xs font-semibold text-center">
            {validationError}
          </div>
        )}

        {/* Players List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <AnimatePresence>
            {players.map((player, idx) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between bg-surface p-3.5 sm:p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
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
                        className="w-full bg-background border border-primary-500 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEditing(player.id)}
                        className="p-2 rounded-xl bg-accent-emerald text-white hover:scale-105 transition-transform"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-white text-base tracking-wide flex-1">
                      {player.name}
                    </span>
                  )}
                </div>

                {editingId !== player.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditing(player)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Edit Name"
                    >
                      <Edit2 className="w-4 h-4 text-accent-cyan" />
                    </button>
                    {players.length > 3 && (
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-accent-rose/20 text-gray-400 hover:text-accent-rose transition-colors"
                        title="Remove Player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Player Button */}
        {players.length < 10 && (
          <button
            type="button"
            onClick={handleAddPlayer}
            className="w-full py-3 rounded-2xl bg-surface-hover hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5 text-accent-cyan" />
            <span>Add Player</span>
          </button>
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
        >
          <span>Start Game & Reveal Roles</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
