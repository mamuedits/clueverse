'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, CheckCircle2, Lock, Sparkles, RefreshCw, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { OfflinePlayer } from '@/lib/types';
import { tallyOfflineVotes, VoteResult } from '@/lib/gameLogic';
import { soundManager } from '@/lib/audio';

interface OfflineVotingProps {
  players: OfflinePlayer[];
  onVoteComplete: (eliminatedPlayerId: string) => void;
  onBackToLobby: () => void;
}

export const OfflineVoting: React.FC<OfflineVotingProps> = ({ players, onVoteComplete, onBackToLobby }) => {
  const activePlayers = players.filter((p) => !p.isEliminated);
  
  // Voting State
  const [voterIndex, setVoterIndex] = useState(0);
  const [isVoterReady, setIsVoterReady] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({}); // voterId -> targetId

  // Revote State
  const [revoteCandidates, setRevoteCandidates] = useState<string[] | null>(null);

  // Reveal Phase
  const [isRevealed, setIsRevealed] = useState(false);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);

  const currentVoter = (revoteCandidates
    ? activePlayers.filter((p) => revoteCandidates.includes(p.id))
    : activePlayers)[voterIndex];

  const allowedCandidates = revoteCandidates
    ? activePlayers.filter((p) => revoteCandidates.includes(p.id))
    : activePlayers;

  const totalVoters = revoteCandidates ? revoteCandidates.length : activePlayers.length;

  const handleSelectTarget = (targetId: string) => {
    setSelectedTargetId(targetId);
  };

  const handleConfirmVote = () => {
    if (!currentVoter || !selectedTargetId) return;

    soundManager.playVoteCast();
    const updatedVotes = { ...votes, [currentVoter.id]: selectedTargetId };
    setVotes(updatedVotes);

    if (voterIndex + 1 < totalVoters) {
      setVoterIndex((prev) => prev + 1);
      setIsVoterReady(false);
      setSelectedTargetId(null);
    } else {
      // All votes in! Tally results
      const result = tallyOfflineVotes(updatedVotes, activePlayers);
      setVoteResult(result);
      setIsRevealed(true);
    }
  };

  const handleRevote = () => {
    if (voteResult?.tiedPlayerIds) {
      setRevoteCandidates(voteResult.tiedPlayerIds);
      setVotes({});
      setVoterIndex(0);
      setIsVoterReady(false);
      setSelectedTargetId(null);
      setIsRevealed(false);
      setVoteResult(null);
    }
  };

  const handleProceedToResults = () => {
    if (voteResult?.eliminatedPlayerId) {
      onVoteComplete(voteResult.eliminatedPlayerId);
    }
  };

  if (isRevealed && voteResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto py-6 px-4"
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

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/30 shadow-2xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-accent-cyan/30 text-xs font-bold text-accent-cyan">
            <Sparkles className="w-4 h-4" />
            <span>Voting Results</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white gradient-text">
            All Votes Revealed
          </h1>

          {/* Breakdown of Votes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {activePlayers.map((player) => {
              const count = voteResult.voteCounts[player.id] || 0;
              const isEliminated = voteResult.eliminatedPlayerId === player.id && !voteResult.isTie;
              const isTied = voteResult.tiedPlayerIds?.includes(player.id);

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isEliminated
                      ? 'bg-accent-rose/15 border-accent-rose/40 text-white'
                      : isTied
                      ? 'bg-accent-amber/15 border-accent-amber/40 text-white'
                      : 'bg-surface border-white/10 text-gray-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-base block text-white">{player.name}</span>
                    {isEliminated && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-rose">
                        Highest Votes • Eliminated
                      </span>
                    )}
                    {isTied && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-amber">
                        Tied Candidate
                      </span>
                    )}
                  </div>
                  <span className="text-xl font-black font-mono bg-white/5 px-3 py-1 rounded-xl">
                    {count} {count === 1 ? 'vote' : 'votes'}
                  </span>
                </div>
              );
            })}
          </div>

          {voteResult.isTie ? (
            /* Tie Result View */
            <div className="bg-accent-amber/10 border border-accent-amber/30 p-6 rounded-2xl space-y-4">
              <div className="flex justify-center text-accent-amber">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">TIE DETECTED</h3>
              <p className="text-xs text-gray-300">
                A tie occurred between the top voted players. A revote must be conducted strictly between the tied candidates.
              </p>
              <button
                type="button"
                onClick={handleRevote}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-amber to-orange-600 shadow-lg shadow-accent-amber/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Start Tiebreaker Revote</span>
              </button>
            </div>
          ) : (
            /* Clear Winner View */
            <button
              type="button"
              onClick={handleProceedToResults}
              className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
            >
              <span>See Elimination Results</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  /* Voting Pass-the-Phone Flow */
  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToLobby}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-accent-cyan" />
          <span>Back to Lobby</span>
        </button>

        {/* Progress */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalVoters }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === voterIndex
                  ? 'w-6 bg-gradient-to-r from-accent-cyan to-accent-blue shadow-md shadow-accent-cyan/30'
                  : idx < voterIndex
                  ? 'w-2 bg-accent-emerald'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isVoterReady ? (
          /* Step 1: Hand phone to voter */
          <motion.div
            key={`ready-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-8 sm:p-10 rounded-3xl border border-accent-cyan/30 shadow-2xl w-full text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center mx-auto shadow-lg shadow-accent-cyan/20">
              <Lock className="w-10 h-10 text-accent-cyan" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Secret Voting • Voter {voterIndex + 1} of {totalVoters}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Pass the phone to
              </h2>
              <h1 className="text-3xl sm:text-5xl font-black gradient-text mt-1 uppercase tracking-wide">
                {currentVoter?.name}
              </h1>
            </div>

            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              🔒 Votes are secret and will not be displayed until all players have voted.
            </p>

            <button
              type="button"
              onClick={() => setIsVoterReady(true)}
              className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2"
            >
              <Vote className="w-5 h-5" />
              <span>TAP TO CAST VOTE</span>
            </button>
          </motion.div>
        ) : (
          /* Step 2: Voter selects candidate */
          <motion.div
            key={`vote-${voterIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary-500/30 shadow-2xl w-full space-y-6"
          >
            <div className="text-center">
              <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                Current Voter: {currentVoter?.name}
              </span>
              <h2 className="text-2xl font-black text-white">Who is the Imposter?</h2>
              <p className="text-xs text-gray-400">Select a player to cast your secret vote</p>
            </div>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
              {allowedCandidates.map((candidate) => {
                const isSelected = selectedTargetId === candidate.id;
                const isSelf = candidate.id === currentVoter?.id;

                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => handleSelectTarget(candidate.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary-600 to-accent-blue border-primary-400 text-white shadow-lg shadow-primary-500/30 scale-[1.02]'
                        : 'bg-surface border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-base text-white block">
                        {candidate.name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          (You)
                        </span>
                      )}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-accent-cyan" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleConfirmVote}
              disabled={!selectedTargetId}
              className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>Submit Secret Vote</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
