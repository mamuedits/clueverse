'use client';

import React, { useState } from 'react';
import { Send, Lock, Sparkles } from 'lucide-react';

interface ClueInputProps {
  isYourTurn: boolean;
  activePlayerName: string;
  onSubmitClue: (text: string) => void;
  hasSubmittedThisRound: boolean;
}

export const ClueInput: React.FC<ClueInputProps> = ({
  isYourTurn,
  activePlayerName,
  onSubmitClue,
  hasSubmittedThisRound,
}) => {
  const [clueText, setClueText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isYourTurn || !clueText.trim() || hasSubmittedThisRound) return;
    onSubmitClue(clueText.trim());
    setClueText('');
  };

  return (
    <div
      className={`glass-panel p-5 rounded-3xl transition-all duration-300 ${
        isYourTurn
          ? 'glass-panel-glow border-primary-500/50 shadow-2xl animate-turn-active'
          : 'border-white/10 opacity-90'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isYourTurn ? (
            <span className="px-2.5 py-1 rounded-full bg-primary-500 text-white text-xs font-black uppercase tracking-wider animate-pulse">
              YOUR TURN TO SPEAK
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-surface text-gray-400 text-xs font-semibold flex items-center gap-1.5 border border-white/10">
              <Lock className="w-3 h-3 text-accent-rose" />
              Waiting for {activePlayerName}...
            </span>
          )}
        </div>
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
          Personal Clue Box
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={60}
            disabled={!isYourTurn || hasSubmittedThisRound}
            value={clueText}
            onChange={(e) => setClueText(e.target.value)}
            placeholder={
              isYourTurn
                ? 'Type a clever, subtle clue here...'
                : hasSubmittedThisRound
                ? 'Clue sent! Input locked for this round.'
                : `Waiting for ${activePlayerName}'s turn...`
            }
            className={`w-full bg-surface border rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
              isYourTurn
                ? 'border-primary-500 focus:ring-2 focus:ring-primary-500/30'
                : 'border-white/10 cursor-not-allowed bg-black/40'
            }`}
          />
          {isYourTurn && (
            <Sparkles className="w-4 h-4 text-accent-cyan absolute right-3 top-3.5 opacity-60 pointer-events-none" />
          )}
        </div>

        <button
          type="submit"
          disabled={!isYourTurn || !clueText.trim() || hasSubmittedThisRound}
          className="btn-primary px-6 rounded-2xl flex items-center gap-2 font-bold text-sm disabled:opacity-40 disabled:scale-100"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
