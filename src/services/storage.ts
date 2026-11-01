import { BallSkin, Achievement, GameStats, GameSettings } from '../types/game';

const STORAGE_KEYS = {
  STATS: 'omt_stats_v1',
  SETTINGS: 'omt_settings_v1',
  UNLOCKED_SKINS: 'omt_skins_v1',
  SELECTED_SKIN: 'omt_selected_skin_v1',
  ACHIEVEMENTS: 'omt_achievements_v1',
  PLAYER_NAME: 'omt_player_name_v1'
};

export const INITIAL_SKINS: BallSkin[] = [
  {
    id: 'neon_cyan',
    name: 'Neon Cyan',
    description: 'The classic glowing arcade hyper-orb.',
    cost: 0,
    color: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.8)',
    trailColor: '#00B8D4',
    particleType: 'neon',
    unlocked: true,
    icon: '⚡'
  },
  {
    id: 'cyber_pink',
    name: 'Cyber Pink',
    description: 'Synthwave hot pink runner with pulse waves.',
    cost: 50,
    color: '#FF007F',
    glowColor: 'rgba(255, 0, 127, 0.8)',
    trailColor: '#D81B60',
    particleType: 'plasma',
    unlocked: false,
    icon: '💖'
  },
  {
    id: 'solar_gold',
    name: 'Solar Gold',
    description: 'Forged in stellar flares. Pure radiance.',
    cost: 120,
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.85)',
    trailColor: '#FFA000',
    particleType: 'gold',
    unlocked: false,
    icon: '👑'
  },
  {
    id: 'inferno_fire',
    name: 'Inferno Blaze',
    description: 'Blazing comet tail with fiery embers.',
    cost: 200,
    color: '#FF3D00',
    glowColor: 'rgba(255, 61, 0, 0.85)',
    trailColor: '#DD2C00',
    particleType: 'fire',
    unlocked: false,
    icon: '🔥'
  },
  {
    id: 'matrix_glitch',
    name: 'Matrix Code',
    description: 'Digital anomaly shifting reality.',
    cost: 350,
    color: '#00FF66',
    glowColor: 'rgba(0, 255, 102, 0.8)',
    trailColor: '#00C853',
    particleType: 'matrix',
    unlocked: false,
    icon: '👾'
  },
  {
    id: 'void_ghost',
    name: 'Phantom Void',
    description: 'Ethereal purple phantom sliding between dimensions.',
    cost: 500,
    color: '#B388FF',
    glowColor: 'rgba(179, 136, 255, 0.85)',
    trailColor: '#7C4DFF',
    particleType: 'void',
    unlocked: false,
    icon: '🔮'
  },
  {
    id: 'rainbow_pulsar',
    name: 'Prism Star',
    description: 'Dynamic chromatic spectrum that shifts colors constantly.',
    cost: 800,
    color: '#FFFFFF',
    glowColor: 'rgba(255, 255, 255, 0.9)',
    trailColor: '#FF4081',
    particleType: 'star',
    unlocked: false,
    icon: '🌈'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_try',
    title: 'First Flight',
    description: 'Play your very first run in ONE MORE TRY!',
    rewardCoins: 20,
    unlocked: false,
    icon: '🚀',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'score_25',
    title: 'Warming Up',
    description: 'Reach a score of 25 or more in a single run.',
    rewardCoins: 30,
    unlocked: false,
    icon: '🥉',
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'score_50',
    title: 'Arcade Ace',
    description: 'Score 50+ in a single run. You got the reflex!',
    rewardCoins: 50,
    unlocked: false,
    icon: '🥈',
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'score_100',
    title: 'Century Legend',
    description: 'Reach 100 points! Only 2% of players reach here.',
    rewardCoins: 150,
    unlocked: false,
    icon: '🥇',
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'near_miss_10',
    title: 'Living on the Edge',
    description: 'Perform 10 Near-Miss grazes without crashing.',
    rewardCoins: 40,
    unlocked: false,
    icon: '⚡',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'coin_collector_50',
    title: 'Coin Magnet',
    description: 'Collect 50 coins in total.',
    rewardCoins: 50,
    unlocked: false,
    icon: '💰',
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'games_10',
    title: 'Addicted',
    description: 'Play 10 matches. "Just one more try..."',
    rewardCoins: 40,
    unlocked: false,
    icon: '🔁',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'streak_3',
    title: 'Consistent Dodger',
    description: 'Maintain a 3-day play streak.',
    rewardCoins: 80,
    unlocked: false,
    icon: '🔥',
    progress: 0,
    maxProgress: 3
  }
];

export const storageService = {
  getStats(): GameStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return {
      highScore: 0,
      totalGames: 0,
      totalCoins: 25, // starting gift!
      totalNearMisses: 0,
      totalPowerupsPicked: 0,
      bestCombo: 0,
      streakDays: 1,
      lastLoginDate: new Date().toISOString().split('T')[0]
    };
  },

  saveStats(stats: GameStats) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // ignore
    }
  },

  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return {
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
      controlMode: 'tap_switch',
      playerName: `Player_${Math.floor(1000 + Math.random() * 9000)}`
    };
  },

  saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  getSkins(): BallSkin[] {
    try {
      const unlockedIds: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS) || '["neon_cyan"]'
      );
      return INITIAL_SKINS.map((skin) => ({
        ...skin,
        unlocked: unlockedIds.includes(skin.id)
      }));
    } catch {
      return INITIAL_SKINS;
    }
  },

  unlockSkin(skinId: string) {
    try {
      const unlockedIds: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS) || '["neon_cyan"]'
      );
      if (!unlockedIds.includes(skinId)) {
        unlockedIds.push(skinId);
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(unlockedIds));
      }
    } catch {
      // ignore
    }
  },

  getSelectedSkinId(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_SKIN) || 'neon_cyan';
  },

  setSelectedSkinId(id: string) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, id);
  },

  getAchievements(): Achievement[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_ACHIEVEMENTS;
  },

  saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  },

  checkDailyStreak(): { streak: number; rewardClaimable: boolean; rewardAmount: number } {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastLoginDate;

    let streak = stats.streakDays || 1;
    let rewardClaimable = false;

    if (lastDate !== today) {
      const last = new Date(lastDate);
      const cur = new Date(today);
      const diffDays = Math.floor((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak = (streak % 7) + 1;
        rewardClaimable = true;
      } else if (diffDays > 1) {
        streak = 1;
        rewardClaimable = true;
      }
      stats.streakDays = streak;
      stats.lastLoginDate = today;
      this.saveStats(stats);
    }

    const streakRewards = [15, 25, 40, 60, 90, 130, 200];
    const rewardAmount = streakRewards[(streak - 1) % 7];

    return { streak, rewardClaimable, rewardAmount };
  }
};

