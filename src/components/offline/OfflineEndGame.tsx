'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, ShieldAlert, RotateCcw, Home, Sparkles } from 'lucide-react';
import { OfflinePlayer, WordPair } from '@/lib/types';
import { soundManager } from '@/lib/audio';

interface OfflineEndGameProps {
  winner: 'CIVILIANS' | 'IMPOSTERS' | null;
  wordPair: WordPair | null;
  players: OfflinePlayer[];
  scores: Record<string, number>;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export const OfflineEndGame: React.FC<OfflineEndGameProps> = ({
  winner,
  wordPair,
  players,
  scores,
  onPlayAgain,
  onBackHome,
}) => {
  const isCrewWin = winner === 'CIVILIANS';
  const imposters = players.filter((p) => p.role === 'IMPOSTER');

  useEffect(() => {
    if (isCrewWin) {
      soundManager.playVictory();
    } else {
      soundManager.playDefeat();
    }
  }, [isCrewWin]);

  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl mx-auto py-8 px-4"
    >
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/30 shadow-2xl space-y-6 text-center">
        {/* Winner Hero Banner */}
        <div className="space-y-3">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
              isCrewWin
                ? 'bg-gradient-to-tr from-accent-cyan to-accent-emerald text-white shadow-accent-cyan/30'
                : 'bg-gradient-to-tr from-accent-rose to-purple-800 text-white shadow-accent-rose/30'
            }`}
          >
            <Trophy className="w-12 h-12 text-accent-amber animate-bounce" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-accent-amber px-3 py-1 bg-accent-amber/10 border border-accent-amber/30 rounded-full inline-block">
            GAME OVER
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white gradient-text">
            {isCrewWin ? 'CREW WINS!' : 'IMPOSTERS WIN!'}
          </h1>
          <p className="text-xs text-gray-400">
            {isCrewWin
              ? 'The crew successfully identified and voted out all imposters!'
              : 'The imposters successfully deceived the crew and took control!'}
          </p>
        </div>

        {/* Revealed Info */}
        <div className="bg-surface p-5 rounded-2xl border border-white/10 space-y-4 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Secret Word
            </span>
            <span className="text-lg font-black text-accent-cyan">
              {wordPair?.civilianWord || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              The Imposters Were 🕵️
            </span>
            <div className="flex flex-wrap gap-2">
              {imposters.map((p) => (
                <span
                  key={p.id}
                  className="bg-accent-rose/20 border border-accent-rose/40 px-3 py-1.5 rounded-xl text-xs font-black text-accent-rose"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="space-y-3 text-left">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <span>Scoreboard</span>
          </h3>

          <div className="space-y-2">
            {sortedPlayers.map((player, idx) => {
              const score = scores[player.id] || 0;
              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-surface p-3.5 rounded-xl border border-white/5 text-xs font-bold"
                >
                  <span className="text-white flex items-center gap-2">
                    <span className="text-accent-amber">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    {player.name}
                    {player.role === 'IMPOSTER' && (
                      <span className="text-[10px] text-accent-rose font-mono"> (Imposter)</span>
                    )}
                  </span>
                  <span className="text-accent-amber font-mono font-black text-sm">
                    {score} {score === 1 ? 'Win' : 'Wins'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className="w-full btn-secondary py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Back Home</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
