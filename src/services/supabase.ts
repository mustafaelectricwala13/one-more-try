import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from '../types/game';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    supabase = null;
  }
}

const LOCAL_LEADERBOARD_KEY = 'omt_leaderboard_local_v1';

const DEFAULT_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'CyberViper', score: 148, rank: 1, skinId: 'rainbow_pulsar', date: 'Today' },
  { id: 'lb-2', name: 'NeonQueen', score: 124, rank: 2, skinId: 'cyber_pink', date: 'Today' },
  { id: 'lb-3', name: 'GlitchGod', score: 109, rank: 3, skinId: 'matrix_glitch', date: 'Yesterday' },
  { id: 'lb-4', name: 'PixelSamurai', score: 94, rank: 4, skinId: 'solar_gold', date: '2d ago' },
  { id: 'lb-5', name: 'ShadowOrb', score: 87, rank: 5, skinId: 'void_ghost', date: '3d ago' },
  { id: 'lb-6', name: 'HyperNova', score: 76, rank: 6, skinId: 'inferno_fire', date: '3d ago' },
  { id: 'lb-7', name: 'RetroFox', score: 65, rank: 7, skinId: 'neon_cyan', date: '4d ago' },
  { id: 'lb-8', name: 'ZeroGravity', score: 54, rank: 8, skinId: 'neon_cyan', date: '5d ago' },
];

export const supabaseService = {
  isConfigured(): boolean {
    return !!supabase;
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          return data.map((item, index) => ({
            id: item.id || `supa-${index}`,
            name: item.name || 'Anonymous',
            score: item.score || 0,
            rank: index + 1,
            skinId: item.skin_id || 'neon_cyan',
            date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Online'
          }));
        }
      } catch {
        // Fall back to local
      }
    }

    // Local cached or mock fallback
    try {
      const local = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch {
      // fallback
    }

    return DEFAULT_GLOBAL_LEADERBOARD;
  },

  async submitScore(playerName: string, score: number, skinId: string): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        await supabase.from('leaderboard').insert([
          {
            name: playerName,
            score: score,
            skin_id: skinId
          }
        ]);
      } catch {
        // Continue to update local
      }
    }

    // Always merge into local leaderboard
    let current = await this.getLeaderboard();
    const existingIndex = current.findIndex(e => e.name === playerName);

    if (existingIndex >= 0) {
      if (score > current[existingIndex].score) {
        current[existingIndex].score = score;
        current[existingIndex].skinId = skinId;
        current[existingIndex].date = 'Today';
      }
    } else {
      current.push({
        id: `local-${Date.now()}`,
        name: playerName,
        score: score,
        skinId: skinId,
        date: 'Today',
        isPlayer: true
      });
    }

    // Sort descending and re-assign ranks
    current.sort((a, b) => b.score - a.score);
    current = current.map((item, idx) => ({ ...item, rank: idx + 1 }));

    try {
      localStorage.setItem(LOCAL_LEADERBOARD_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }

    return current;
  }
};

