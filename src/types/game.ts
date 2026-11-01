export type ScreenState = 'loading' | 'home' | 'playing' | 'paused' | 'gameover';

export type PowerUpType = 'shield' | 'magnet' | 'slowmo' | 'multiplier';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  radius: number;
  duration: number; // in seconds
  collected: boolean;
  pulse: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number; // in seconds
  maxTime: number;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: number;
  collected: boolean;
  pulse: number;
}

export type ObstacleType = 
  | 'horizontal_bar' 
  | 'spinner' 
  | 'pulsing_orb' 
  | 'laser_gate' 
  | 'sliding_door' 
  | 'zigzag_blades';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  angle: number;
  rotSpeed: number;
  vx: number;
  vy: number;
  minX?: number;
  maxX?: number;
  passed: boolean;
  scored: boolean;
  nearMissed: boolean;
  color: string;
  glowColor: string;
}

export interface BallSkin {
  id: string;
  name: string;
  description: string;
  cost: number;
  color: string;
  glowColor: string;
  trailColor: string;
  particleType: 'plasma' | 'fire' | 'star' | 'matrix' | 'neon' | 'gold' | 'void';
  unlocked: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  unlocked: boolean;
  icon: string;
  progress: number;
  maxProgress: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank?: number;
  skinId: string;
  date: string;
  isPlayer?: boolean;
}

export interface GameStats {
  highScore: number;
  totalGames: number;
  totalCoins: number;
  totalNearMisses: number;
  totalPowerupsPicked: number;
  bestCombo: number;
  streakDays: number;
  lastLoginDate: string;
}

export interface ChallengeData {
  challengerName: string;
  targetScore: number;
  seed?: number;
  skinId?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  controlMode: 'tap_switch' | 'drag_steer'; // Tap to invert direction vs touch drag/keyboard
  playerName: string;
}

