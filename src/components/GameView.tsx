'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldAlert, Sparkles, User, ChevronRight, Layers, MessageSquareDashed, Lightbulb } from 'lucide-react';
import { Room, Player } from '@/lib/types';
import { ClueInput } from './ClueInput';

interface GameViewProps {
  room: Room;
  currentPlayer: Player;
  onSubmitClue: (text: string) => void;
}

export const GameView: React.FC<GameViewProps> = ({ room, currentPlayer, onSubmitClue }) => {
  const [showSecretWord, setShowSecretWord] = useState(true);

  const activePlayerId = room.turnOrder[room.currentTurnIndex];
  const activePlayer = room.players.find((p) => p.id === activePlayerId);
  const isYourTurn = activePlayerId === currentPlayer.id;

  // Has current player submitted clue in current round?
  const hasSubmittedThisRound = room.clues.some(
    (c) => c.round === room.currentRound && c.playerId === currentPlayer.id
  );

  // Group clues by round
  const round1Clues = room.clues.filter((c) => c.round === 1);
  const round2Clues = room.clues.filter((c) => c.round === 2);
  const round3Clues = room.clues.filter((c) => c.round === 3);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Round Header & Turn Progress Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glow p-5 rounded-3xl space-y-4 border-primary-500/30"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-blue flex items-center justify-center font-black text-lg text-white shadow-lg shadow-primary-500/20">
              R{room.currentRound}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary-400">
                  Round {room.currentRound} of 3
                </span>
                {room.wordPair?.category && (
                  <span className="text-[10px] bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-full border border-accent-cyan/20 font-bold">
                    Category: {room.wordPair.category}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white">Turn-Based Clue Phase</h2>
            </div>
          </div>

          {/* Turn Order Tracker */}
          <div className="flex items-center gap-2 bg-surface/90 border border-white/10 px-4 py-2 rounded-2xl">
            <span className="text-xs font-bold text-gray-400">Active Speaker:</span>
            <span
              className={`text-sm font-black flex items-center gap-1.5 ${
                isYourTurn ? 'text-primary-400 animate-pulse' : 'text-white'
              }`}
            >
              <User className="w-4 h-4 text-accent-cyan" />
              {isYourTurn ? 'YOU' : activePlayer?.name || 'Player'}
            </span>
          </div>
        </div>

        {/* Dynamic Turn Order Queue */}
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-accent-cyan" />
            Turn Order Sequence
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {room.turnOrder.map((pid, idx) => {
              const p = room.players.find((item) => item.id === pid);
              if (!p) return null;

              const isCurrent = idx === room.currentTurnIndex;
              const isPast = idx < room.currentTurnIndex;
              const isSelf = pid === currentPlayer.id;

              return (
                <React.Fragment key={pid}>
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-primary-500 text-white border-primary-400 shadow-md shadow-primary-500/30 scale-105'
                        : isPast
                        ? 'bg-surface/50 text-gray-500 border-white/5 line-through opacity-60'
                        : 'bg-surface text-gray-300 border-white/10'
                    }`}
                  >
                    <span>{p.name}</span>
                    {isSelf && <span className="text-[9px] bg-black/40 px-1 rounded">YOU</span>}
                  </div>
                  {idx < room.turnOrder.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Secret Word Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-surface to-surface/80 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            Your Private Secret Word
          </span>
          <button
            onClick={() => setShowSecretWord(!showSecretWord)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Toggle Word Privacy"
          >
            {showSecretWord ? (
              <>
                <EyeOff className="w-4 h-4 text-accent-rose" /> Hide Word
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-accent-cyan" /> Show Word
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          {showSecretWord ? (
            <div className="text-3xl sm:text-4xl font-black tracking-wide gradient-text">
              {currentPlayer.secretWord || '***'}
            </div>
          ) : (
            <div className="text-2xl font-bold tracking-widest text-gray-600 font-mono select-none">
              ••••••••••••
            </div>
          )}

          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Role Privacy
            </span>
            <span className="text-xs font-semibold text-gray-300 flex items-center justify-end gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-accent-rose" /> Keep Secret!
            </span>
          </div>
        </div>

        {/* Word Hint Banner */}
        {room.wordPair?.hint && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2.5 bg-primary-500/10 p-3 rounded-2xl border border-primary-500/20">
            <Lightbulb className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold text-accent-amber uppercase tracking-wider block text-[10px]">
                Word Hint & Context
              </span>
              <p className="text-gray-200 font-medium italic">"{room.wordPair.hint}"</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Turn-Based Clue Submission Panel */}
      <ClueInput
        isYourTurn={isYourTurn}
        activePlayerName={activePlayer?.name || 'Player'}
        onSubmitClue={onSubmitClue}
        hasSubmittedThisRound={hasSubmittedThisRound}
      />

      {/* Public Clue Timeline */}
      <div className="glass-panel p-6 rounded-3xl space-y-5 border border-white/10">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
          <MessageSquareDashed className="w-4 h-4 text-accent-cyan" />
          Public Clue Timeline
        </h3>

        <div className="space-y-6">
          {[1, 2, 3].map((rNum) => {
            const clues = rNum === 1 ? round1Clues : rNum === 2 ? round2Clues : round3Clues;
            const isCurrentRound = room.currentRound === rNum;

            return (
              <div key={rNum} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isCurrentRound
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface border border-white/10 text-gray-400'
                    }`}
                  >
                    Round {rNum}
                  </span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                {clues.length === 0 ? (
                  <div className="text-xs text-gray-500 italic pl-3">
                    {rNum > room.currentRound
                      ? 'Upcoming round...'
                      : 'No clues submitted in this round yet.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {clues.map((clue) => {
                        const isSelfClue = clue.playerId === currentPlayer.id;
                        return (
                          <motion.div
                            key={clue.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isSelfClue
                                ? 'bg-primary-600/10 border-primary-500/40'
                                : 'bg-surface border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-accent-cyan" />
                                {clue.playerName}
                                {isSelfClue && (
                                  <span className="text-[9px] bg-primary-500/20 text-primary-300 font-bold px-1 rounded">
                                    YOU
                                  </span>
                                )}
                              </span>
                              <span className="text-[9px] text-gray-500">
                                {new Date(clue.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-200 leading-relaxed italic">
                              "{clue.text}"
                            </p>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
