'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, Grid, Gauge, Timer, ArrowLeft, ArrowRight } from 'lucide-react';
import { OfflineGameSettings } from '@/lib/types';
import { CATEGORIES } from '@/lib/aiWords';

interface OfflineSetupProps {
  initialSettings: OfflineGameSettings;
  onContinue: (settings: OfflineGameSettings) => void;
  onBack: () => void;
}

export const OfflineSetup: React.FC<OfflineSetupProps> = ({ initialSettings, onContinue, onBack }) => {
  const [settings, setSettings] = useState<OfflineGameSettings>(initialSettings);

  const handlePlayersChange = (delta: number) => {
    const newNum = Math.max(3, Math.min(10, settings.numPlayers + delta));
    const maxImposters = Math.max(1, newNum - 2);
    setSettings((prev) => ({
      ...prev,
      numPlayers: newNum,
      numImposters: Math.min(prev.numImposters, maxImposters),
    }));
  };

  const handleImpostersChange = (delta: number) => {
    const maxImposters = Math.max(1, settings.numPlayers - 2);
    const newNum = Math.max(1, Math.min(maxImposters, settings.numImposters + delta));
    setSettings((prev) => ({
      ...prev,
      numImposters: newNum,
    }));
  };

  const timerOptions = [30, 60, 90, 120, 180];
  const difficultyOptions: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(settings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-2xl mx-auto py-6 px-4"
    >
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home Menu</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-white gradient-text">Game Setup</h2>
            <p className="text-xs text-gray-400">Offline Party Mode Settings</p>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number of Players */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-cyan" />
                Number of Players
              </label>
              <span className="text-xs font-semibold text-gray-400">Min 3 • Max 10</span>
            </div>
            <div className="flex items-center justify-between bg-surface p-2 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => handlePlayersChange(-1)}
                disabled={settings.numPlayers <= 3}
                className="w-10 h-10 rounded-lg bg-surface-hover hover:bg-primary-600/50 disabled:opacity-30 disabled:pointer-events-none text-white font-black text-xl flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-black text-white tracking-widest font-mono">
                {settings.numPlayers} <span className="text-xs text-gray-400 font-sans">Players</span>
              </span>
              <button
                type="button"
                onClick={() => handlePlayersChange(1)}
                disabled={settings.numPlayers >= 10}
                className="w-10 h-10 rounded-lg bg-surface-hover hover:bg-primary-600/50 disabled:opacity-30 disabled:pointer-events-none text-white font-black text-xl flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Number of Imposters */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent-rose" />
                Number of Imposters
              </label>
              <span className="text-xs font-semibold text-gray-400">
                Max: {settings.numPlayers - 2}
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface p-2 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => handleImpostersChange(-1)}
                disabled={settings.numImposters <= 1}
                className="w-10 h-10 rounded-lg bg-surface-hover hover:bg-accent-rose/50 disabled:opacity-30 disabled:pointer-events-none text-white font-black text-xl flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-black text-accent-rose tracking-widest font-mono">
                {settings.numImposters}{' '}
                <span className="text-xs text-gray-400 font-sans">
                  {settings.numImposters === 1 ? 'Imposter' : 'Imposters'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleImpostersChange(1)}
                disabled={settings.numImposters >= settings.numPlayers - 2}
                className="w-10 h-10 rounded-lg bg-surface-hover hover:bg-accent-rose/50 disabled:opacity-30 disabled:pointer-events-none text-white font-black text-xl flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Grid className="w-4 h-4 text-primary-400" />
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSettings({ ...settings, category: cat })}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border text-center ${
                    settings.category === cat
                      ? 'bg-primary-600/80 text-white border-primary-400 shadow-md shadow-primary-500/20'
                      : 'bg-surface border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat === 'Random' ? '🎲 Random' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-accent-emerald" />
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficultyOptions.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSettings({ ...settings, difficulty: diff })}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                    settings.difficulty === diff
                      ? 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/50 shadow-md shadow-accent-emerald/10'
                      : 'bg-surface border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Discussion Timer Toggle */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Timer className="w-4 h-4 text-accent-cyan" />
                Discussion Timer
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, timerEnabled: !settings.timerEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.timerEnabled ? 'bg-accent-cyan' : 'bg-surface-hover border border-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.timerEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-gray-300">
                  {settings.timerEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {settings.timerEnabled && (
              <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/5">
                {timerOptions.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSettings({ ...settings, timerDuration: sec })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      settings.timerDuration === sec
                        ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50'
                        : 'bg-surface border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit / Continue Button */}
          <button
            type="submit"
            className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
          >
            <span>Save Settings & Go To Lobby</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
