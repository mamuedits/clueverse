'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, RotateCcw, Home, ArrowLeft, Trophy } from 'lucide-react';
import { OfflinePlayer, WordPair } from '@/lib/types';

interface OfflineResultsProps {
  eliminatedPlayer: OfflinePlayer | undefined;
  wordPair: WordPair | null;
  players: OfflinePlayer[];
  currentRound: number;
  gameWinner: 'CIVILIANS' | 'IMPOSTERS' | null;
  onNextRound: () => void;
  onBackToLobby: () => void;
  onOpenLeaderboard?: () => void;
}

export const OfflineResults: React.FC<OfflineResultsProps> = ({
  eliminatedPlayer,
  wordPair,
  players,
  currentRound,
  gameWinner,
  onNextRound,
  onBackToLobby,
  onOpenLeaderboard,
}) => {
  const isImposter = eliminatedPlayer?.role === 'IMPOSTER';
  const remainingPlayers = players.filter((p) => !p.isEliminated);
  const imposters = players.filter((p) => p.role === 'IMPOSTER');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-xl mx-auto py-6 px-4"
    >
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-accent-cyan" />
          <span>Back to Lobby</span>
        </button>

        {onOpenLeaderboard && (
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 text-xs font-bold text-accent-amber hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-xl border border-accent-amber/30 bg-accent-amber/10"
          >
            <Trophy className="w-4 h-4 text-accent-amber" />
            <span>Leaderboard</span>
          </button>
        )}
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/30 shadow-2xl space-y-6 text-center">
        {/* Banner Status */}
        <div className="space-y-3">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg ${
              gameWinner === 'CIVILIANS'
                ? 'bg-accent-emerald/20 border border-accent-emerald/40 text-accent-emerald shadow-accent-emerald/20'
                : gameWinner === 'IMPOSTERS'
                ? 'bg-accent-rose/20 border border-accent-rose/40 text-accent-rose shadow-accent-rose/20'
                : isImposter
                ? 'bg-accent-emerald/20 border border-accent-emerald/40 text-accent-emerald shadow-accent-emerald/20'
                : 'bg-accent-amber/20 border border-accent-amber/40 text-accent-amber shadow-accent-amber/20'
            }`}
          >
            {gameWinner === 'CIVILIANS' || isImposter ? (
              <ShieldCheck className="w-10 h-10" />
            ) : (
              <ShieldAlert className="w-10 h-10" />
            )}
          </div>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block border ${
              gameWinner === 'CIVILIANS'
                ? 'bg-accent-emerald/20 border-accent-emerald/40 text-accent-emerald'
                : gameWinner === 'IMPOSTERS'
                ? 'bg-accent-rose/20 border-accent-rose/40 text-accent-rose'
                : isImposter
                ? 'bg-accent-emerald/20 border-accent-emerald/40 text-accent-emerald'
                : 'bg-accent-amber/20 border-accent-amber/40 text-accent-amber'
            }`}
          >
            {gameWinner === 'CIVILIANS'
              ? 'Crew Wins Round!'
              : gameWinner === 'IMPOSTERS'
              ? 'Imposters Win Round!'
              : isImposter
              ? 'Imposter Caught!'
              : 'Civilian Eliminated'}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white gradient-text">
            Round {currentRound} Complete
          </h1>
        </div>

        {/* Details Card */}
        <div className="bg-surface p-5 rounded-2xl border border-white/10 space-y-4 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Eliminated Player
            </span>
            <span className="text-base font-extrabold text-white">
              {eliminatedPlayer?.name || 'None'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Was Imposter?
            </span>
            <span
              className={`text-sm font-black uppercase tracking-wide ${
                isImposter ? 'text-accent-emerald' : 'text-accent-rose'
              }`}
            >
              {isImposter ? 'YES 🕵️' : 'NO 👤'}
            </span>
          </div>

          {/* Word Pair Details */}
          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="bg-surface-hover p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-cyan block mb-1">
                Civilian Word
              </span>
              <span className="text-sm font-black text-white">
                {wordPair?.civilianWord || 'N/A'}
              </span>
            </div>

            <div className="bg-surface-hover p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-rose block mb-1">
                Imposter Word
              </span>
              <span className="text-sm font-black text-white">
                {wordPair?.imposterWord || 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              The Imposter(s) 🕵️
            </span>
            <div className="flex flex-wrap gap-2">
              {imposters.map((p) => (
                <span
                  key={p.id}
                  className="bg-accent-rose/20 border border-accent-rose/40 px-3 py-1 rounded-xl text-xs font-black text-accent-rose"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onNextRound}
            className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Next Round</span>
          </button>

          <button
            type="button"
            onClick={onBackToLobby}
            className="w-full btn-secondary py-4 text-base font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Lobby</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
