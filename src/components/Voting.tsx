'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { Room, Player } from '@/lib/types';

interface VotingProps {
  room: Room;
  currentPlayer: Player;
  onSubmitVote: (targetPlayerId: string) => void;
}

export const Voting: React.FC<VotingProps> = ({ room, currentPlayer, onSubmitVote }) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const hasVoted = !!room.votes[currentPlayer.id];
  const activePlayers = room.players.filter((p) => p.isConnected);
  const totalVotesCast = Object.keys(room.votes).length;

  const handleVoteClick = (targetId: string) => {
    if (hasVoted || targetId === currentPlayer.id) return;
    setSelectedTargetId(targetId);
  };

  const handleConfirmVote = () => {
    if (!selectedTargetId || hasVoted) return;
    onSubmitVote(selectedTargetId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-glow p-6 rounded-3xl text-center space-y-2 border-accent-rose/30"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-rose/20 text-accent-rose text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" /> Voting Phase Active
        </div>
        <h2 className="text-3xl font-black text-white">Who is the Imposter?</h2>
        <p className="text-xs text-gray-400 max-w-lg mx-auto">
          Cast your vote for the player whose clues were suspicious. Everyone votes simultaneously in secret!
        </p>

        {/* Voting Progress */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className="text-xs font-bold text-gray-300">
            Votes Cast: <span className="text-accent-cyan font-black">{totalVotesCast} / {activePlayers.length}</span>
          </span>
          <div className="w-32 bg-surface h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="bg-accent-cyan h-full transition-all duration-300"
              style={{ width: `${(totalVotesCast / activePlayers.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Player Grid for Voting */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
          <Vote className="w-4 h-4 text-accent-rose" />
          Select a Player to Vote Out
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePlayers.map((player) => {
            const isSelf = player.id === currentPlayer.id;
            const isSelected = selectedTargetId === player.id;
            const playerVotedStatus = !!room.votes[player.id];

            return (
              <motion.div
                key={player.id}
                whileHover={{ scale: isSelf ? 1 : 1.02 }}
                whileTap={{ scale: isSelf ? 1 : 0.98 }}
                onClick={() => handleVoteClick(player.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelf
                    ? 'bg-black/30 border-white/5 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'bg-accent-rose/20 border-accent-rose shadow-lg shadow-accent-rose/20 ring-2 ring-accent-rose/50'
                    : 'bg-surface border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-blue flex items-center justify-center font-bold text-white text-base">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-sm text-white block truncate">{player.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {isSelf ? 'Cannot vote for yourself' : isSelected ? 'Selected for Elimination' : 'Tap to Select'}
                    </span>
                  </div>
                </div>

                {/* Voted Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-gray-400">Status:</span>
                  {playerVotedStatus ? (
                    <span className="text-accent-emerald font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Voted
                    </span>
                  ) : (
                    <span className="text-accent-amber font-semibold">Deciding...</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit Vote Button */}
        {!hasVoted ? (
          <div className="flex justify-center pt-2">
            <button
              onClick={handleConfirmVote}
              disabled={!selectedTargetId}
              className="btn-primary px-8 py-3.5 text-base font-extrabold flex items-center gap-2 bg-gradient-to-r from-accent-rose to-primary-600 shadow-accent-rose/25 disabled:opacity-40"
            >
              <UserCheck className="w-5 h-5" />
              Confirm Vote & Lock Choice
            </button>
          </div>
        ) : (
          <div className="bg-surface/80 border border-accent-emerald/30 p-4 rounded-2xl text-center space-y-1">
            <div className="text-accent-emerald font-extrabold text-sm flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Your vote has been recorded!
            </div>
            <p className="text-xs text-gray-400">
              Waiting for remaining players to complete voting... Results will reveal automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
