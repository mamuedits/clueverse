'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, LogOut, ShieldAlert, Award, Star } from 'lucide-react';
import { Room, Player } from '@/lib/types';
import { soundManager } from '@/lib/audio';

interface ResultsProps {
  room: Room;
  currentPlayer: Player;
  onPlayAgain: () => void;
  onLeaveRoom: () => void;
  onCloseRoom: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  room,
  currentPlayer,
  onPlayAgain,
  onLeaveRoom,
  onCloseRoom,
}) => {
  const isHost = currentPlayer.isHost;
  const isCiviliansWinner = room.winner === 'CIVILIANS';
  const isWinner =
    (isCiviliansWinner && currentPlayer.role === 'CIVILIAN') ||
    (!isCiviliansWinner && currentPlayer.role === 'IMPOSTER');

  useEffect(() => {
    if (isWinner) {
      soundManager.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#3B82F6', '#06B6D4', '#10B981'],
      });
    } else {
      soundManager.playDefeat();
    }
  }, [isWinner]);

  const imposters = room.players.filter((p) => p.role === 'IMPOSTER');
  const civilians = room.players.filter((p) => p.role === 'CIVILIAN');

  const voteTallies: Record<string, number> = {};
  Object.values(room.votes).forEach((targetId) => {
    voteTallies[targetId] = (voteTallies[targetId] || 0) + 1;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Victory / Defeat Main Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden border ${
          isCiviliansWinner
            ? 'glass-panel-glow border-accent-emerald/50 bg-gradient-to-b from-accent-emerald/10 to-surface'
            : 'glass-panel-glow border-accent-rose/50 bg-gradient-to-b from-accent-rose/10 to-surface'
        }`}
      >
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
              isCiviliansWinner
                ? 'bg-gradient-to-tr from-accent-emerald to-accent-cyan shadow-accent-emerald/30'
                : 'bg-gradient-to-tr from-accent-rose to-primary-600 shadow-accent-rose/30'
            }`}
          >
            {isCiviliansWinner ? (
              <Trophy className="w-10 h-10 text-white" />
            ) : (
              <ShieldAlert className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {isCiviliansWinner ? 'CIVILIANS WIN!' : 'IMPOSTERS WIN!'}
          </h2>
          <p className="text-sm font-semibold text-gray-300 mt-2">
            {isCiviliansWinner
              ? 'The Civilians successfully deduced and voted out the Imposter!'
              : 'The Imposters blended in seamlessly and evaded detection!'}
          </p>
        </div>

        {/* You Outcome Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white">
          <Award className="w-4 h-4 text-accent-cyan" />
          <span>
            Your Role: <strong className="uppercase">{currentPlayer.role}</strong> ({isWinner ? 'Victory 🏆' : 'Defeat ❌'})
          </span>
          <span className="ml-2 text-accent-amber font-extrabold flex items-center gap-1 border-l border-white/20 pl-2">
            <Star className="w-3.5 h-3.5 fill-current" /> Total Score: {currentPlayer.score || 0} pts
          </span>
        </div>
      </motion.div>

      {/* Secret Words Revealed Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          Secret Words Revealed
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-2xl border border-accent-blue/30 space-y-1">
            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">
              Civilians Secret Word
            </span>
            <div className="text-2xl font-black text-white">
              {room.wordPair?.civilianWord || 'Word A'}
            </div>
            <span className="text-[10px] text-gray-400 block">
              Assigned to {civilians.length} civilian players
            </span>
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-accent-rose/30 space-y-1">
            <span className="text-[10px] font-bold text-accent-rose uppercase tracking-widest">
              Imposters Secret Word
            </span>
            <div className="text-2xl font-black text-white">
              {room.wordPair?.imposterWord || 'Word B'}
            </div>
            <span className="text-[10px] text-gray-400 block">
              Assigned to {imposters.length} imposter players
            </span>
          </div>
        </div>
      </div>

      {/* Imposter Reveal & Vote Breakdown */}
      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-white/10">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
          Player Breakdown & Accumulated Scores
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {room.players.map((p) => {
            const isImp = p.role === 'IMPOSTER';
            const votesReceived = voteTallies[p.id] || 0;
            const targetPlayer = room.players.find((item) => item.id === p.voteTargetId);

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border space-y-2 ${
                  isImp
                    ? 'bg-accent-rose/10 border-accent-rose/40'
                    : 'bg-surface border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                        isImp ? 'bg-accent-rose' : 'bg-primary-600'
                      }`}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-white truncate">{p.name}</span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isImp ? 'bg-accent-rose text-white' : 'bg-primary-500/20 text-primary-300'
                    }`}
                  >
                    {isImp ? 'IMPOSTER' : 'CIVILIAN'}
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 pt-2 border-t border-white/5 flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span>Secret Word:</span>
                    <span className="text-white font-semibold">{p.secretWord}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Votes Received:</span>
                    <span className="text-accent-cyan font-bold">{votesReceived} votes</span>
                  </div>
                  <div className="flex justify-between items-center text-accent-amber font-bold pt-1 border-t border-white/5">
                    <span>Total Score:</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {p.score || 0} pts
                    </span>
                  </div>
                  {targetPlayer && (
                    <div className="text-[10px] text-gray-500">
                      Voted for: <span className="text-gray-300">{targetPlayer.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto btn-primary px-8 py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
        >
          <RotateCcw className="w-5 h-5" />
          Return to Lobby
        </button>

        {isHost ? (
          <button
            onClick={onCloseRoom}
            className="w-full sm:w-auto btn-secondary px-6 py-4 text-base font-bold flex items-center justify-center gap-2 text-accent-rose hover:bg-accent-rose/10"
          >
            <LogOut className="w-5 h-5" />
            Close Lobby Session
          </button>
        ) : (
          <button
            onClick={onLeaveRoom}
            className="w-full sm:w-auto btn-secondary px-6 py-4 text-base font-bold flex items-center justify-center gap-2 text-gray-300"
          >
            <LogOut className="w-5 h-5" />
            Leave Room
          </button>
        )}
      </div>
    </div>
  );
};
