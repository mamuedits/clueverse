'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, FastForward, MessageCircle, ArrowLeft } from 'lucide-react';
import { OfflineGameSettings, WordPair } from '@/lib/types';
import { soundManager } from '@/lib/audio';

interface OfflineDiscussionProps {
  settings: OfflineGameSettings;
  wordPair: WordPair | null;
  round: number;
  onEndDiscussion: () => void;
  onBackToLobby: () => void;
}

export const OfflineDiscussion: React.FC<OfflineDiscussionProps> = ({
  settings,
  wordPair,
  round,
  onEndDiscussion,
  onBackToLobby,
}) => {
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!settings.timerEnabled || isPaused) return;

    if (timeLeft <= 0) {
      soundManager.playVoteCast();
      onEndDiscussion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.timerEnabled, isPaused, timeLeft, onEndDiscussion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleEndDiscussion = () => {
    soundManager.playVoteCast();
    onEndDiscussion();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-xl mx-auto py-6 px-4 flex flex-col items-center justify-center min-h-[65vh]"
    >
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-accent-cyan" />
          <span>Back to Lobby</span>
        </button>
      </div>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-primary-500/30 shadow-2xl w-full text-center space-y-6">
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-bold text-gray-300">
          <MessageCircle className="w-4 h-4 text-accent-cyan" />
          <span>Round {round} • Category: {wordPair?.category || 'General'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white gradient-text">
          Discussion Time
        </h1>

        <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
          Ask questions, give clues, analyze player reactions, and try to spot who has the imposter word!
        </p>

        {/* Timer Display */}
        {settings.timerEnabled ? (
          <div className="py-6 glass-panel rounded-2xl border border-primary-500/20 max-w-xs mx-auto">
            <div className="flex justify-center items-center gap-2 text-accent-cyan mb-1">
              <Timer className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Remaining Time</span>
            </div>
            <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-widest">
              {formatTime(timeLeft)}
            </div>
          </div>
        ) : (
          <div className="py-6 bg-surface/60 rounded-2xl border border-white/10 max-w-xs mx-auto text-gray-400 text-xs font-semibold">
            ⏱️ Timer Disabled. Discuss at your own pace!
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {settings.timerEnabled && (
            <button
              type="button"
              onClick={handleTogglePause}
              className="btn-secondary w-full sm:w-auto py-3 px-6 text-sm font-bold flex items-center justify-center gap-2"
            >
              {isPaused ? <Play className="w-4 h-4 text-accent-emerald" /> : <Pause className="w-4 h-4 text-accent-amber" />}
              <span>{isPaused ? 'Resume Timer' : 'Pause Timer'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleEndDiscussion}
            className="btn-primary w-full sm:w-auto py-3.5 px-8 text-base font-extrabold flex items-center justify-center gap-2"
          >
            <FastForward className="w-5 h-5 text-accent-cyan" />
            <span>End Discussion & Vote</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
