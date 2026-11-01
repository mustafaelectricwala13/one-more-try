import React from 'react';
import { Flame } from 'lucide-react';

interface DailyStreakBadgeProps {
  streak: number;
  rewardClaimable: boolean;
  rewardAmount: number;
  onClaim: () => void;
}

export const DailyStreakBadge: React.FC<DailyStreakBadgeProps> = ({
  streak,
  rewardClaimable,
  rewardAmount,
  onClaim
}) => {
  return (
    <div className="flex items-center justify-between bg-[#15152a]/80 backdrop-blur border border-white/10 rounded-2xl px-4 py-2.5 w-full">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#FF0055] flex items-center justify-center shadow-[0_0_12px_rgba(255,85,0,0.5)]">
          <Flame className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-arcade text-xs text-[#FF8800] font-black">DAY {streak} STREAK</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70">7-Day Cycle</span>
          </div>
          <p className="text-xs text-white/60">
            {rewardClaimable ? `Daily bonus ready: +${rewardAmount} coins!` : 'Play daily to stack bonuses'}
          </p>
        </div>
      </div>

      {rewardClaimable && (
        <button
          onClick={onClaim}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#080811] font-arcade font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[0_0_12px_rgba(255,215,0,0.6)] hover:brightness-110 active:scale-95 transition-all"
        >
          CLAIM +{rewardAmount}
        </button>
      )}
    </div>
  );
};

