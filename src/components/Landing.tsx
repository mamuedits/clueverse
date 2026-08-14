'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, LogIn, User, Users, ShieldAlert, Sparkles, ArrowRight, Smartphone, Gamepad2, Globe, Trophy } from 'lucide-react';

interface LandingProps {
  appMode: 'ONLINE' | 'OFFLINE';
  onModeChange: (mode: 'ONLINE' | 'OFFLINE') => void;
  onCreateRoom: (playerName: string, maxPlayers: number, numImposters: number) => void;
  onJoinRoom: (playerName: string, roomCode: string) => void;
  onStartOfflineGame: () => void;
  onOpenOfflineLeaderboard?: () => void;
  error?: string | null;
}

export const Landing: React.FC<LandingProps> = ({
  appMode,
  onModeChange,
  onCreateRoom,
  onJoinRoom,
  onStartOfflineGame,
  onOpenOfflineLeaderboard,
  error,
}) => {
  const [mode, setMode] = useState<'SELECT' | 'CREATE' | 'JOIN'>('SELECT');
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [numImposters, setNumImposters] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setValidationError('Please enter your player name');
      return;
    }
    setValidationError(null);
    onCreateRoom(playerName.trim(), maxPlayers, numImposters);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setValidationError('Please enter your player name');
      return;
    }
    if (!roomCodeInput.trim() || roomCodeInput.trim().length < 4) {
      setValidationError('Please enter a valid Room Code');
      return;
    }
    setValidationError(null);
    onJoinRoom(playerName.trim(), roomCodeInput.trim().toUpperCase());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary-500/30 text-xs font-semibold text-primary-400 mb-4 shadow-lg shadow-primary-500/10">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <span>The Ultimate Imposter Word Game</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 gradient-text">
          ClueVerse
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Bluff, deduce, and uncover secret words with your friends! Give subtle clues and vote out the hidden imposters before time runs out.
        </p>
      </motion.div>

      {/* Segmented Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-1.5 glass-panel rounded-2xl border border-white/10 flex items-center gap-1 shadow-xl"
      >
        <button
          onClick={() => {
            onModeChange('ONLINE');
            setMode('SELECT');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            appMode === 'ONLINE'
              ? 'bg-gradient-to-r from-primary-600 to-accent-blue text-white shadow-lg shadow-primary-500/30 scale-[1.02]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>🌐 Online</span>
        </button>

        <button
          onClick={() => {
            onModeChange('OFFLINE');
            setMode('SELECT');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            appMode === 'OFFLINE'
              ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30 scale-[1.02]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>🎮 Offline</span>
        </button>
      </motion.div>

      {/* Global Error Banner */}
      {(error || validationError) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-accent-rose/10 border border-accent-rose/30 text-accent-rose px-4 py-3 rounded-xl text-sm font-medium mb-6 text-center shadow-lg"
        >
          {error || validationError}
        </motion.div>
      )}

      {/* Action Modes */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {appMode === 'OFFLINE' ? (
            /* Offline Mode Card */
            <motion.div
              key="offline-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel hover:glass-panel-glow p-8 sm:p-10 rounded-3xl border border-accent-cyan/30 flex flex-col items-center text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-cyan to-accent-blue flex items-center justify-center shadow-lg shadow-accent-cyan/30">
                <Smartphone className="w-10 h-10 text-white" />
              </div>

              <div>
                <h3 className="text-3xl font-black text-white mb-2">Offline Party</h3>
                <p className="text-sm text-gray-300">Play together using one phone.</p>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={onStartOfflineGame}
                  className="w-full py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-accent-cyan via-primary-500 to-accent-blue shadow-xl shadow-accent-cyan/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Game</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {onOpenOfflineLeaderboard && (
                  <button
                    type="button"
                    onClick={onOpenOfflineLeaderboard}
                    className="w-full py-3 rounded-2xl font-bold text-sm text-accent-amber bg-accent-amber/10 border border-accent-amber/30 hover:bg-accent-amber/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-accent-amber" />
                    <span>View Offline Leaderboard</span>
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Online Mode Cards */
            <>
              {mode === 'SELECT' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {/* Create Room Button */}
                  <button
                    onClick={() => setMode('CREATE')}
                    className="group glass-panel hover:glass-panel-glow p-8 rounded-3xl flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-blue flex items-center justify-center mb-5 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                      <PlusCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-2">Create Room</h3>
                    <p className="text-xs text-gray-400 leading-normal">
                      Host a new party game with custom player limits and imposter settings.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary-400 group-hover:text-white transition-colors">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Join Room Button */}
                  <button
                    onClick={() => setMode('JOIN')}
                    className="group glass-panel hover:glass-panel-glow p-8 rounded-3xl flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-cyan to-accent-blue flex items-center justify-center mb-5 shadow-lg shadow-accent-cyan/30 group-hover:scale-110 transition-transform">
                      <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-2">Join Room</h3>
                    <p className="text-xs text-gray-400 leading-normal">
                      Enter an existing 6-character room code to instantly jump into the lobby.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-accent-cyan group-hover:text-white transition-colors">
                      <span>Enter Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </motion.div>
              )}

              {mode === 'CREATE' && (
                <motion.form
                  key="create"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleCreateSubmit}
                  className="glass-panel p-8 rounded-3xl border border-primary-500/20 shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-primary-400" />
                      Create Game Room
                    </h2>
                    <button
                      type="button"
                      onClick={() => setMode('SELECT')}
                      className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                  </div>

                  {/* Player Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-primary-400" />
                      Your Player Name
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="e.g. Detective Sam"
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                      autoFocus
                    />
                  </div>

                  {/* Number of Imposters Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-accent-rose" />
                        Number of Imposters
                      </label>
                      <span className="text-sm font-black text-accent-rose bg-accent-rose/10 px-2.5 py-0.5 rounded-lg">
                        {numImposters} {numImposters === 1 ? 'Imposter' : 'Imposters'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      value={numImposters}
                      onChange={(e) => setNumImposters(parseInt(e.target.value))}
                      className="w-full accent-accent-rose bg-surface h-2 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-semibold text-gray-500 mt-1">
                      <span>1 Imposter</span>
                      <span>2 Imposters</span>
                      <span>3 Imposters</span>
                    </div>
                  </div>

                  {/* Max Players Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-accent-cyan" />
                        Max Players
                      </label>
                      <span className="text-sm font-black text-accent-cyan bg-accent-cyan/10 px-2.5 py-0.5 rounded-lg">
                        {maxPlayers} Players
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      className="w-full accent-accent-cyan bg-surface h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary py-3.5 text-base font-bold">
                    Create Room & Enter Lobby
                  </button>
                </motion.form>
              )}

              {mode === 'JOIN' && (
                <motion.form
                  key="join"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleJoinSubmit}
                  className="glass-panel p-8 rounded-3xl border border-accent-cyan/20 shadow-2xl space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                      <LogIn className="w-5 h-5 text-accent-cyan" />
                      Join Game Room
                    </h2>
                    <button
                      type="button"
                      onClick={() => setMode('SELECT')}
                      className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                  </div>

                  {/* Player Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-accent-cyan" />
                      Your Player Name
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="e.g. SecretAgent"
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-colors"
                      autoFocus
                    />
                  </div>

                  {/* Room Code */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Room Code (6 Characters)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. AB72CD"
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-center font-mono tracking-widest text-lg font-bold placeholder-gray-600 uppercase focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-cyan to-accent-blue shadow-lg shadow-accent-cyan/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Join Room Lobby
                  </button>
                </motion.form>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
