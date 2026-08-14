'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  X,
  ShieldCheck,
  ShieldAlert,
  Search,
  RotateCcw,
  Trash2,
  Medal,
  BarChart3,
  Award,
  Calendar,
} from 'lucide-react';
import { OfflinePlayer, OfflinePlayerStats } from '@/lib/types';
import {
  getOfflineLeaderboard,
  clearOfflineLeaderboard,
} from '@/lib/offlineLeaderboard';

interface OfflineLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionPlayers?: OfflinePlayer[];
  sessionScores?: Record<string, number>;
  onResetSessionScores?: () => void;
}

export const OfflineLeaderboardModal: React.FC<OfflineLeaderboardModalProps> = ({
  isOpen,
  onClose,
  sessionPlayers = [],
  sessionScores = {},
  onResetSessionScores,
}) => {
  const [activeTab, setActiveTab] = useState<'SESSION' | 'ALL_TIME'>('SESSION');
  const [allTimeStats, setAllTimeStats] = useState<OfflinePlayerStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAllTimeStats(getOfflineLeaderboard());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Session stats calculation
  const sortedSessionPlayers = [...sessionPlayers].sort(
    (a, b) => (sessionScores[b.id] || 0) - (sessionScores[a.id] || 0)
  );

  // All-time filtering
  const filteredAllTime = allTimeStats.filter((stat) =>
    stat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearAllTime = () => {
    clearOfflineLeaderboard();
    setAllTimeStats([]);
    setShowClearConfirm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl glass-panel-glow border border-accent-cyan/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-amber via-accent-cyan to-primary-500 flex items-center justify-center shadow-lg shadow-accent-amber/20">
                <Trophy className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white gradient-text flex items-center gap-2">
                  Offline Leaderboard
                </h2>
                <p className="text-xs text-gray-400">
                  Track party rankings & all-time player stats
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Close Leaderboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Control Tabs */}
          <div className="p-1 glass-panel rounded-2xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('SESSION')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'SESSION'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-md shadow-accent-cyan/20 font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Current Session</span>
              {sessionPlayers.length > 0 && (
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  {sessionPlayers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ALL_TIME')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'ALL_TIME'
                  ? 'bg-gradient-to-r from-accent-amber to-primary-500 text-white shadow-md shadow-accent-amber/20 font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Medal className="w-4 h-4" />
              <span>All-Time Records</span>
              {allTimeStats.length > 0 && (
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  {allTimeStats.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-[260px]">
            {activeTab === 'SESSION' ? (
              /* Session Leaderboard */
              sortedSessionPlayers.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <BarChart3 className="w-12 h-12 text-gray-500 mx-auto opacity-50" />
                  <p className="text-gray-400 text-sm font-semibold">
                    No session player scores recorded yet.
                  </p>
                  <p className="text-xs text-gray-500">
                    Play a round in offline mode to start earning session wins!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sortedSessionPlayers.map((player, idx) => {
                    const score = sessionScores[player.id] || 0;
                    const isTopThree = idx < 3;
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          idx === 0
                            ? 'bg-gradient-to-r from-accent-amber/20 to-surface border-accent-amber/40 shadow-lg shadow-accent-amber/10'
                            : idx === 1
                            ? 'bg-gradient-to-r from-slate-400/15 to-surface border-slate-400/30'
                            : idx === 2
                            ? 'bg-gradient-to-r from-amber-700/15 to-surface border-amber-700/30'
                            : 'bg-surface border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                              idx === 0
                                ? 'bg-accent-amber text-black shadow-md shadow-accent-amber/30'
                                : idx === 1
                                ? 'bg-slate-300 text-black'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-surface-hover text-gray-400 font-mono'
                            }`}
                          >
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                          </span>

                          <div>
                            <span className="font-extrabold text-white text-sm sm:text-base block">
                              {player.name}
                            </span>
                            {player.role && (
                              <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                {player.role === 'IMPOSTER' ? (
                                  <span className="text-accent-rose flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> Imposter
                                  </span>
                                ) : (
                                  <span className="text-accent-cyan flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Civilian
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-accent-amber font-mono block">
                            {score} {score === 1 ? 'Win' : 'Wins'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* All-Time Leaderboard */
              <div className="space-y-4">
                {/* Search input */}
                {allTimeStats.length > 0 && (
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search player name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber transition-colors"
                    />
                  </div>
                )}

                {filteredAllTime.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Award className="w-12 h-12 text-gray-500 mx-auto opacity-50" />
                    <p className="text-gray-400 text-sm font-semibold">
                      {searchQuery
                        ? 'No player stats match your search.'
                        : 'No all-time player stats recorded yet.'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Finish offline games to automatically build persistent high scores!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAllTime.map((stat, idx) => {
                      const winRate =
                        stat.roundsPlayed > 0
                          ? Math.round((stat.totalWins / stat.roundsPlayed) * 100)
                          : 0;

                      return (
                        <div
                          key={stat.name}
                          className="bg-surface p-4 rounded-2xl border border-white/10 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                  idx === 0
                                    ? 'bg-accent-amber text-black'
                                    : idx === 1
                                    ? 'bg-slate-300 text-black'
                                    : idx === 2
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-surface-hover text-gray-400 font-mono'
                                }`}
                              >
                                #{idx + 1}
                              </span>
                              <span className="font-extrabold text-white text-base">
                                {stat.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-accent-amber bg-accent-amber/10 border border-accent-amber/30 px-3 py-1 rounded-full font-mono">
                                {stat.totalWins} {stat.totalWins === 1 ? 'Win' : 'Wins'}
                              </span>
                            </div>
                          </div>

                          {/* Stats Breakdown Grid */}
                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-center">
                            <div className="bg-surface-hover p-2 rounded-xl border border-white/5">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                Win Rate
                              </span>
                              <span className="text-xs font-black text-accent-emerald font-mono">
                                {winRate}%
                              </span>
                            </div>

                            <div className="bg-surface-hover p-2 rounded-xl border border-white/5">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                Civilian 🛡️
                              </span>
                              <span className="text-xs font-black text-accent-cyan font-mono">
                                {stat.civilianWins}
                              </span>
                            </div>

                            <div className="bg-surface-hover p-2 rounded-xl border border-white/5">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                Imposter 🕵️
                              </span>
                              <span className="text-xs font-black text-accent-rose font-mono">
                                {stat.imposterWins}
                              </span>
                            </div>

                            <div className="bg-surface-hover p-2 rounded-xl border border-white/5">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                Played 🎮
                              </span>
                              <span className="text-xs font-black text-white font-mono">
                                {stat.roundsPlayed}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {activeTab === 'SESSION' && onResetSessionScores && (
              <button
                type="button"
                onClick={onResetSessionScores}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-accent-rose/20 text-gray-300 hover:text-accent-rose border border-white/10 hover:border-accent-rose/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Session Scores</span>
              </button>
            )}

            {activeTab === 'ALL_TIME' && allTimeStats.length > 0 && (
              showClearConfirm ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-accent-rose font-bold">Clear all history?</span>
                  <button
                    onClick={handleClearAllTime}
                    className="px-3 py-1.5 rounded-xl bg-accent-rose text-white text-xs font-black hover:bg-rose-600 transition-colors"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-surface text-gray-300 text-xs font-bold hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-accent-rose/20 text-gray-300 hover:text-accent-rose border border-white/10 hover:border-accent-rose/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All-Time History</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto ml-auto btn-primary py-2.5 px-6 text-xs font-bold"
            >
              Close Leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
