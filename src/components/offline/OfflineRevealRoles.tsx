'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react';
import { OfflinePlayer, WordPair } from '@/lib/types';
import { soundManager } from '@/lib/audio';

interface OfflineRevealRolesProps {
  players: OfflinePlayer[];
  wordPair: WordPair;
  onFinishReveal: () => void;
  onBackToLobby: () => void;
}

export const OfflineRevealRoles: React.FC<OfflineRevealRolesProps> = ({
  players,
  wordPair,
  onFinishReveal,
  onBackToLobby,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  const handleReveal = () => {
    soundManager.playTurnChange();
    setIsRevealed(true);
  };

  const handleNextPlayer = () => {
    setIsRevealed(false);
    if (isLastPlayer) {
      soundManager.playRoundStart();
      onFinishReveal();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Top Header with Back to Lobby */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-accent-cyan" />
          <span>Back to Lobby</span>
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-gradient-to-r from-primary-400 to-accent-cyan shadow-md shadow-primary-500/30'
                  : idx < currentIndex
                  ? 'w-2 bg-accent-emerald'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
        Player {currentIndex + 1} of {players.length}
      </p>

      {/* 3D Flip Card Container */}
      <div className="w-full perspective-1000">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* Front of Card: Pass Phone Instructions */
            <motion.div
              key={`front-${currentPlayer.id}`}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-panel hover:glass-panel-glow p-8 sm:p-10 rounded-3xl border border-primary-500/30 shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 to-accent-blue flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Private Role Card
                </h3>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Pass the phone to
                </h2>
                <h1 className="text-3xl sm:text-5xl font-black gradient-text mt-2 uppercase tracking-wide">
                  {currentPlayer.name}
                </h1>
              </div>

              <div className="bg-surface/80 border border-white/10 px-4 py-3 rounded-2xl text-xs text-gray-300 leading-relaxed max-w-xs">
                🔒 Make sure only <strong className="text-white">{currentPlayer.name}</strong> can see the screen before tapping.
              </div>

              <button
                type="button"
                onClick={handleReveal}
                className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5 text-accent-cyan" />
                <span>TAP TO REVEAL</span>
              </button>
            </motion.div>
          ) : (
            /* Back of Card: Role Revealed */
            <motion.div
              key={`back-${currentPlayer.id}`}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-8 sm:p-10 rounded-3xl border border-accent-cyan/40 bg-accent-cyan/5 shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center shadow-lg shadow-accent-cyan/20">
                <span className="text-4xl">🔑</span>
              </div>

              <div className="space-y-3 w-full">
                <span className="px-3 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan font-black text-xs uppercase tracking-widest inline-block">
                  Category: {wordPair.category}
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  YOUR SECRET WORD
                </p>
                <div className="bg-surface border border-accent-cyan/30 rounded-2xl px-6 py-4">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                    {currentPlayer.secretWord}
                  </h1>
                </div>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Keep your secret word safe. Give clever clues to spot who has a different word!
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextPlayer}
                className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
              >
                <EyeOff className="w-5 h-5" />
                <span>
                  {isLastPlayer ? 'Hide & Start Discussion' : 'Hide & Next Player'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

