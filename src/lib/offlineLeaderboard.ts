import { OfflinePlayer, OfflinePlayerStats } from './types';

const LEADERBOARD_KEY = 'clueverse_offline_leaderboard';

/**
 * Fetch all-time offline player statistics from localStorage.
 */
export function getOfflineLeaderboard(): OfflinePlayerStats[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const statsMap: Record<string, OfflinePlayerStats> = JSON.parse(raw);
    
    return Object.values(statsMap).sort((a, b) => {
      if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
      const winRateA = a.roundsPlayed > 0 ? a.totalWins / a.roundsPlayed : 0;
      const winRateB = b.roundsPlayed > 0 ? b.totalWins / b.roundsPlayed : 0;
      if (winRateB !== winRateA) return winRateB - winRateA;
      return b.roundsPlayed - a.roundsPlayed;
    });
  } catch (err) {
    console.error('Failed to load offline leaderboard:', err);
    return [];
  }
}

/**
 * Record round results into persistent localStorage stats.
 */
export function updateOfflineLeaderboard(
  players: OfflinePlayer[],
  winner: 'CIVILIANS' | 'IMPOSTERS'
): OfflinePlayerStats[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const statsMap: Record<string, OfflinePlayerStats> = raw ? JSON.parse(raw) : {};

    const now = new Date().toISOString();

    players.forEach((player) => {
      const normalizedKey = player.name.trim().toLowerCase();
      const existing = statsMap[normalizedKey] || {
        name: player.name.trim(),
        totalWins: 0,
        civilianWins: 0,
        imposterWins: 0,
        roundsPlayed: 0,
        lastPlayed: now,
      };

      existing.name = player.name.trim(); // keep capitalization updated
      existing.roundsPlayed += 1;
      existing.lastPlayed = now;

      if (winner === 'CIVILIANS' && player.role === 'CIVILIAN') {
        existing.civilianWins += 1;
        existing.totalWins += 1;
      } else if (winner === 'IMPOSTERS' && player.role === 'IMPOSTER') {
        existing.imposterWins += 1;
        existing.totalWins += 1;
      }

      statsMap[normalizedKey] = existing;
    });

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(statsMap));
    return getOfflineLeaderboard();
  } catch (err) {
    console.error('Failed to update offline leaderboard:', err);
    return [];
  }
}

/**
 * Clear all persisted offline leaderboard data.
 */
export function clearOfflineLeaderboard(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (err) {
    console.error('Failed to clear offline leaderboard:', err);
  }
}
