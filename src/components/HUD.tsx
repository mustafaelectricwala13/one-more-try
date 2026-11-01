import React from 'react';
import { ActivePowerUp, ChallengeData } from '../types/game';
import { Pause, Sparkles, Shield, Zap, Clock, Magnet } from 'lucide-react';

interface HUDProps {
  score: number;
  coins: number;
  combo: number;
  activePowerUps: ActivePowerUp[];
  challenge: ChallengeData | null;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  coins,
  combo,
  activePowerUps,
  challenge,
  onPause
}) => {
  const powerUpIcons: Record<string, React.ReactNode> = {
    shield: <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />,
    magnet: <Magnet className="w-3.5 h-3.5 text-[#FF007F]" />,
    slowmo: <Clock className="w-3.5 h-3.5 text-[#00FF66]" />,
    multiplier: <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
  };

  const powerUpLabels: Record<string, string> = {
    shield: 'SHIELD',
    magnet: 'MAGNET',
    slowmo: 'SLOW',
    multiplier: '2X'
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
      {/* Top Bar */}
      <div className="flex items-start justify-between w-full">
        {/* Left: Coins & Combo */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 bg-[#080811]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
            <Sparkles className="w-4 h-4 text-[#FFD700] fill-[#FFD700] animate-spin-slow" />
            <span className="font-arcade text-sm font-black text-[#FFD700]">+{coins}</span>
          </div>

          {combo > 1 && (
            <div className="bg-gradient-to-r from-[#FF007F] to-[#9D00FF] px-2.5 py-0.5 rounded-md text-[10px] font-arcade font-black text-white self-start animate-bounce shadow-lg">
              {combo}X COMBO!
            </div>
          )}
        </div>

        {/* Center: Live Score */}
        <div className="flex flex-col items-center">
          <span className="font-arcade text-5xl font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">
            {score}
          </span>
        </div>

        {/* Right: Pause Button */}
        <div className="pointer-events-auto">
          <button
            onClick={onPause}
            className="w-10 h-10 rounded-full bg-[#151528]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-[#00F0FF] active:scale-90 transition-all shadow-lg"
          >
            <Pause className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      {/* Challenge Target Tracker (if playing a friend's challenge) */}
      {challenge && (
        <div className="w-full max-w-xs mx-auto bg-[#0d0d1e]/90 backdrop-blur-md border border-[#FFD700]/40 rounded-2xl p-2.5 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
          <div className="flex justify-between items-center text-xs font-arcade mb-1">
            <span className="text-[#FFD700] font-black">
              ⚔️ BEAT {challenge.challengerName.toUpperCase()}:
            </span>
            <span className="text-white font-black">{challenge.targetScore} PTS</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                score >= challenge.targetScore
                  ? 'bg-gradient-to-r from-[#00FF66] to-[#00F0FF] shadow-[0_0_10px_#00FF66]'
                  : 'bg-gradient-to-r from-[#FF8800] to-[#FFD700]'
              }`}
              style={{
                width: `${Math.min(100, Math.floor((score / challenge.targetScore) * 100))}%`
              }}
            />
          </div>
          {score >= challenge.targetScore && (
            <div className="text-center text-[10px] font-arcade text-[#00FF66] font-black mt-1 animate-pulse">
              🏆 TARGET CRUSHED! KEEP SURVIVING!
            </div>
          )}
        </div>
      )}

      {/* Bottom Area: Active Power-Ups Badges */}
      <div className="flex items-center justify-center gap-2 pb-2">
        {activePowerUps.map((pow) => {
          const pct = Math.max(0, (pow.remainingTime / pow.maxTime) * 100);
          return (
            <div
              key={pow.type}
              className="flex items-center gap-1.5 bg-[#0d0d1e]/85 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full shadow-lg"
            >
              {powerUpIcons[pow.type]}
              <span className="text-[10px] font-arcade font-bold text-white">
                {powerUpLabels[pow.type]} {Math.ceil(pow.remainingTime)}s
              </span>
              <div className="w-8 bg-white/20 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-[#00F0FF] h-full rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

