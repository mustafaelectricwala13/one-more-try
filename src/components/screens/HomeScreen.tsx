import React from 'react';
import { GameStats, BallSkin, ChallengeData } from '../../types/game';
import { ArcadeButton } from '../ui/ArcadeButton';
import { DailyStreakBadge } from '../ui/DailyStreakBadge';
import { Trophy, Swords, Palette, Award, Settings, Sparkles, Play, ShieldAlert } from 'lucide-react';

interface HomeScreenProps {
  stats: GameStats;
  currentSkin: BallSkin;
  challenge: ChallengeData | null;
  streakInfo: { streak: number; rewardClaimable: boolean; rewardAmount: number };
  onPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenChallenge: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onClaimStreak: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  currentSkin,
  challenge,
  streakInfo,
  onPlay,
  onOpenLeaderboard,
  onOpenChallenge,
  onOpenShop,
  onOpenAchievements,
  onOpenSettings,
  onClaimStreak
}) => {
  return (
    <div className="absolute inset-0 bg-[#080811]/90 backdrop-blur-sm z-30 flex flex-col justify-between p-5 text-center overflow-y-auto select-none">
      {/* Header bar: Coins & Settings */}
      <div className="flex items-center justify-between w-full pt-1">
        <div className="flex items-center gap-1.5 bg-[#151528] px-3.5 py-1.5 rounded-full border border-yellow-500/30 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
          <Sparkles className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
          <span className="font-arcade text-sm font-black text-[#FFD700]">
            {stats.totalCoins}
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-[#151528] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#00F0FF] active:scale-95 transition-all shadow-md"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center gap-4 my-auto py-2">
        {/* Incoming Challenge Banner */}
        {challenge && (
          <div className="w-full bg-gradient-to-r from-[#FF007F]/20 to-[#9D00FF]/20 border border-[#FF007F] rounded-2xl p-3 mb-2 shadow-[0_0_20px_rgba(255,0,127,0.3)] animate-pulse">
            <div className="flex items-center justify-center gap-2 text-xs font-arcade text-[#FF007F] font-black">
              <ShieldAlert className="w-4 h-4" />
              <span>CHALLENGE RECEIVED!</span>
            </div>
            <p className="font-display text-sm font-bold text-white mt-1">
              {challenge.challengerName} dares you to beat <span className="text-[#FFD700] font-black">{challenge.targetScore} PTS</span>!
            </p>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(0,240,255,0.7)] animate-float"
              style={{
                backgroundColor: currentSkin.color,
                boxShadow: `0 0 35px ${currentSkin.glowColor}`
              }}
            >
              <span className="text-2xl">{currentSkin.icon}</span>
            </div>
          </div>

          <h1 className="font-arcade text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FFFFFF] to-[#00F0FF] drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] tracking-tight">
            ONE MORE TRY!
          </h1>
          <p className="font-arcade text-xs text-[#00F0FF]/80 tracking-widest mt-1">
            ARCADE SURVIVAL
          </p>
        </div>

        {/* High Score Plate */}
        <div className="bg-[#121224] border border-white/10 rounded-2xl px-6 py-2.5 shadow-xl">
          <span className="text-[11px] font-arcade text-white/50 block">PERSONAL BEST</span>
          <span className="font-arcade text-3xl font-black text-[#00FF66] drop-shadow-[0_0_10px_rgba(0,255,102,0.6)]">
            {stats.highScore}
          </span>
        </div>

        {/* Big PLAY Button */}
        <ArcadeButton
          onClick={onPlay}
          variant="primary"
          size="xl"
          pulse={true}
          icon={<Play className="w-6 h-6 fill-current" />}
          className="w-full max-w-xs shadow-[0_0_30px_rgba(0,240,255,0.6)]"
        >
          {challenge ? 'ACCEPT CHALLENGE' : 'PLAY NOW'}
        </ArcadeButton>

        {/* Daily Streak Card */}
        <div className="w-full max-w-xs">
          <DailyStreakBadge
            streak={streakInfo.streak}
            rewardClaimable={streakInfo.rewardClaimable}
            rewardAmount={streakInfo.rewardAmount}
            onClaim={onClaimStreak}
          />
        </div>
      </div>

      {/* Bottom Menu Grid */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs mx-auto pb-2">
        <button
          onClick={onOpenChallenge}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#151528] border border-white/10 hover:border-[#FF007F] hover:text-[#FF007F] active:scale-95 transition-all text-white/80"
        >
          <Swords className="w-5 h-5 text-[#FF007F]" />
          <span className="font-arcade text-[10px] font-black">VERSUS</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#151528] border border-white/10 hover:border-[#FFD700] hover:text-[#FFD700] active:scale-95 transition-all text-white/80"
        >
          <Trophy className="w-5 h-5 text-[#FFD700]" />
          <span className="font-arcade text-[10px] font-black">RANKS</span>
        </button>

        <button
          onClick={onOpenShop}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#151528] border border-white/10 hover:border-[#00F0FF] hover:text-[#00F0FF] active:scale-95 transition-all text-white/80"
        >
          <Palette className="w-5 h-5 text-[#00F0FF]" />
          <span className="font-arcade text-[10px] font-black">SKINS</span>
        </button>

        <button
          onClick={onOpenAchievements}
          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#151528] border border-white/10 hover:border-[#00FF66] hover:text-[#00FF66] active:scale-95 transition-all text-white/80"
        >
          <Award className="w-5 h-5 text-[#00FF66]" />
          <span className="font-arcade text-[10px] font-black">AWARDS</span>
        </button>
      </div>
    </div>
  );
};

