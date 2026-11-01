import React from 'react';
import { Achievement } from '../../types/game';
import { Award, X, Sparkles, Check } from 'lucide-react';
import { storageService } from '../../services/storage';

interface AchievementsModalProps {
  achievements: Achievement[];
  totalCoins: number;
  onCoinsChange: (coins: number) => void;
  onClose: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  totalCoins,
  onCoinsChange,
  onClose,
  showToast
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e1e] border border-[#00FF66]/40 rounded-3xl w-full max-w-sm max-h-[85vh] p-6 shadow-[0_0_50px_rgba(0,255,102,0.2)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00FF66]" />
            <h3 className="font-arcade text-base font-black text-white">ACHIEVEMENTS</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlocked || ach.progress >= ach.maxProgress;
            const pct = Math.min(100, Math.floor((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`
                  p-3 rounded-2xl border flex flex-col gap-2 transition-all
                  ${
                    isUnlocked
                      ? 'bg-[#00FF66]/10 border-[#00FF66]/40 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                      : 'bg-[#151528]/80 border-white/5 opacity-80'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{ach.icon}</span>
                    <div className="flex flex-col text-left">
                      <span className="font-arcade text-xs font-black text-white">
                        {ach.title}
                      </span>
                      <span className="text-[10px] text-white/60 font-display">
                        {ach.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#121224] px-2 py-0.5 rounded-full border border-yellow-500/30 shrink-0">
                    <Sparkles className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
                    <span className="text-[10px] font-arcade font-black text-[#FFD700]">
                      +{ach.rewardCoins}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-[#00FF66] shadow-[0_0_8px_#00FF66]'
                        : 'bg-[#00F0FF]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-arcade text-xs font-bold transition-all"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

