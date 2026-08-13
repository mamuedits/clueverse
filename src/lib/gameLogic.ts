import { OfflinePlayer, WordPair, PlayerRole } from './types';

/**
 * Generate roles for offline players using the exact same algorithm as online mode.
 */
export function generateOfflineRoles(
  players: OfflinePlayer[],
  numImposters: number,
  wordPair: WordPair
): OfflinePlayer[] {
  const cloned = players.map((p) => ({ ...p, isEliminated: false }));
  
  // Randomly shuffle indices
  const indices = cloned.map((_, idx) => idx).sort(() => Math.random() - 0.5);
  const imposterCount = Math.min(numImposters, Math.max(1, cloned.length - 2));
  const imposterIndices = new Set(indices.slice(0, imposterCount));

  return cloned.map((player, idx) => {
    const isImposter = imposterIndices.has(idx);
    const role: PlayerRole = isImposter ? 'IMPOSTER' : 'CIVILIAN';
    const secretWord = isImposter ? wordPair.imposterWord : wordPair.civilianWord;

    return {
      ...player,
      role,
      secretWord,
    };
  });
}

/**
 * Tally secret votes from offline voting phase.
 */
export interface VoteResult {
  isTie: boolean;
  eliminatedPlayerId?: string;
  tiedPlayerIds?: string[];
  voteCounts: Record<string, number>;
}

export function tallyOfflineVotes(
  votes: Record<string, string>,
  activePlayers: OfflinePlayer[]
): VoteResult {
  const voteCounts: Record<string, number> = {};
  
  // Initialize counts for active players
  activePlayers.forEach((p) => {
    voteCounts[p.id] = 0;
  });

  // Count valid votes
  Object.values(votes).forEach((targetId) => {
    if (voteCounts[targetId] !== undefined) {
      voteCounts[targetId] += 1;
    }
  });

  let maxVotes = -1;
  let topCandidates: string[] = [];

  Object.entries(voteCounts).forEach(([playerId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      topCandidates = [playerId];
    } else if (count === maxVotes && maxVotes > 0) {
      topCandidates.push(playerId);
    }
  });

  if (topCandidates.length > 1) {
    return {
      isTie: true,
      tiedPlayerIds: topCandidates,
      voteCounts,
    };
  }

  return {
    isTie: false,
    eliminatedPlayerId: topCandidates[0] || activePlayers[0].id,
    voteCounts,
  };
}

/**
 * Check win conditions for active offline players.
 */
export function evaluateOfflineWin(players: OfflinePlayer[]): 'CIVILIANS' | 'IMPOSTERS' | null {
  const activePlayers = players.filter((p) => !p.isEliminated);
  const activeImposters = activePlayers.filter((p) => p.role === 'IMPOSTER');
  const activeCivilians = activePlayers.filter((p) => p.role === 'CIVILIAN');

  if (activeImposters.length === 0) {
    return 'CIVILIANS';
  }

  if (activeImposters.length >= activeCivilians.length) {
    return 'IMPOSTERS';
  }

  return null;
}
