'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Crown,
  Lock,
  Unlock,
  Play,
  UserX,
  Edit2,
  Check,
  X,
  Share2,
  Info,
  Trophy,
  Star,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { Room, Player } from '@/lib/types';

interface LobbyProps {
  room: Room;
  currentPlayer: Player;
  onStartGame: () => void;
  onUpdateSettings: (numImposters: number, maxPlayers: number) => void;
  onToggleLock: () => void;
  onKickPlayer: (targetPlayerId: string) => void;
  onEditPlayerName: (targetPlayerId: string, newName: string) => void;
  onCloseRoom: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  room,
  currentPlayer,
  onStartGame,
  onUpdateSettings,
  onToggleLock,
  onKickPlayer,
  onEditPlayerName,
  onCloseRoom,
}) => {
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const isHost = currentPlayer.isHost;
  const connectedPlayers = room.players.filter((p) => p.isConnected);
  const minRequired = Math.max(3, room.numImposters + 1);
  const canStart = isHost && connectedPlayers.length >= minRequired;

  // Sort players by score descending for leaderboard
  const sortedPlayers = [...room.players].sort((a, b) => (b.score || 0) - (a.score || 0));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditNameValue(player.name);
  };

  const handleSaveEdit = (playerId: string) => {
    if (editNameValue.trim()) {
      onEditPlayerName(playerId, editNameValue.trim());
    }
    setEditingPlayerId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Lobby Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glow p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider">
              Lobby Active
            </span>
            {room.isLocked && (
              <span className="px-3 py-1 rounded-full bg-accent-amber/20 text-accent-amber text-xs font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Game Room Lobby
          </h2>
          <p className="text-xs text-gray-400">
            Share the code with your friends to join the game. Points persist until the host closes the lobby.
          </p>
        </div>

        {/* Room Code Share Panel */}
        <div className="bg-surface/90 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Share Room Code</div>
            <div className="text-2xl font-black font-mono tracking-widest text-primary-400">{room.code}</div>
          </div>
          <button
            onClick={handleCopyCode}
            className="btn-primary p-3 rounded-xl flex items-center gap-2 text-xs font-bold"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent-emerald" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> Copy Code
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Grid: Player Leaderboard + Host Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Player List / Point System Leaderboard */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-amber" />
              Lobby Leaderboard & Scores ({room.players.length}/{room.maxPlayers})
            </h3>
            <span className="text-xs text-gray-400">
              {connectedPlayers.length < minRequired ? (
                <span className="text-accent-amber font-semibold">
                  Need at least {minRequired} players
                </span>
              ) : (
                <span className="text-accent-emerald font-semibold">Ready to start!</span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
            <AnimatePresence>
              {sortedPlayers.map((player, idx) => {
                const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      player.id === currentPlayer.id
                        ? 'bg-primary-600/15 border-primary-500/50 shadow-md shadow-primary-500/10'
                        : 'bg-surface border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank indicator */}
                      <span className="font-extrabold text-base w-7 text-center shrink-0">
                        {rankBadge}
                      </span>

                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 ${
                          player.isHost
                            ? 'bg-gradient-to-tr from-accent-amber to-accent-rose shadow-md shadow-accent-amber/20'
                            : 'bg-gradient-to-tr from-primary-600 to-accent-blue'
                        }`}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name or Edit Field */}
                      {editingPlayerId === player.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            maxLength={15}
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="bg-black/50 border border-primary-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none w-28"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(player.id)}
                            className="p-1 text-accent-emerald hover:bg-white/10 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingPlayerId(null)}
                            className="p-1 text-gray-400 hover:bg-white/10 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-sm text-white truncate">{player.name}</span>
                            {player.id === currentPlayer.id && (
                              <span className="text-[10px] bg-primary-500/20 text-primary-300 font-bold px-1.5 py-0.5 rounded">
                                YOU
                              </span>
                            )}
                            {player.isHost && (
                              <span title="Host">
                                <Crown className="w-4 h-4 text-accent-amber inline shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block">
                            {player.isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Score Badge & Host Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber font-black text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{player.score || 0} pts</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {(isHost || player.id === currentPlayer.id) && editingPlayerId !== player.id && (
                          <button
                            onClick={() => handleStartEdit(player)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit Name"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isHost && !player.isHost && (
                          <button
                            onClick={() => onKickPlayer(player.id)}
                            className="p-1.5 text-accent-rose/70 hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors"
                            title="Kick Player"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Host Controls & Close Lobby Panel */}
        <div className="glass-panel p-6 rounded-3xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-4 mb-4">
              <Shield className="w-5 h-5 text-primary-400" />
              Game Settings
            </h3>

            <div className="space-y-5">
              {/* Imposter Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Imposters
                  </label>
                  <span className="text-xs font-black text-accent-rose bg-accent-rose/10 px-2 py-0.5 rounded">
                    {room.numImposters} {room.numImposters === 1 ? 'Imposter' : 'Imposters'}
                  </span>
                </div>
                {isHost ? (
                  <input
                    type="range"
                    min={1}
                    max={Math.min(3, Math.max(1, room.players.length - 1))}
                    value={room.numImposters}
                    onChange={(e) => onUpdateSettings(parseInt(e.target.value), room.maxPlayers)}
                    className="w-full accent-accent-rose bg-surface h-2 rounded-lg cursor-pointer"
                  />
                ) : (
                  <p className="text-xs text-gray-400 italic">Controlled by Host</p>
                )}
              </div>

              {/* Lock Room Toggle */}
              {isHost && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    {room.isLocked ? <Lock className="w-4 h-4 text-accent-amber" /> : <Unlock className="w-4 h-4 text-accent-emerald" />}
                    <span>Lock Room</span>
                  </div>
                  <button
                    onClick={onToggleLock}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      room.isLocked ? 'bg-accent-amber text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {room.isLocked ? 'Locked' : 'Unlocked'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Start Game & Admin Close Lobby Controls */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {isHost ? (
              <>
                <button
                  onClick={onStartGame}
                  disabled={!canStart}
                  className="w-full btn-primary py-3.5 text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Game Now
                </button>

                {!showCloseConfirm ? (
                  <button
                    onClick={() => setShowCloseConfirm(true)}
                    className="w-full btn-secondary py-2.5 text-xs font-bold text-accent-rose hover:bg-accent-rose/10 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Close Lobby Session
                  </button>
                ) : (
                  <div className="p-3 bg-accent-rose/10 border border-accent-rose/30 rounded-2xl space-y-2 text-center">
                    <p className="text-xs font-bold text-accent-rose flex items-center justify-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Close Lobby & End Game?
                    </p>
                    <p className="text-[10px] text-gray-400">This will disconnect all players and show final scores.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={onCloseRoom}
                        className="flex-1 py-1.5 rounded-xl bg-accent-rose text-white text-xs font-bold hover:bg-accent-rose/80"
                      >
                        Yes, Close
                      </button>
                      <button
                        onClick={() => setShowCloseConfirm(false)}
                        className="flex-1 py-1.5 rounded-xl bg-surface text-gray-300 text-xs font-bold hover:bg-surface-hover"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4 rounded-2xl bg-surface/80 border border-white/5 space-y-2">
                <div className="inline-block p-2 rounded-full bg-primary-500/10 text-primary-400 animate-pulse">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-300">Waiting for Host to start</p>
                <p className="text-[10px] text-gray-500">Points are preserved across games in this lobby!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
