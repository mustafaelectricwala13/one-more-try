import React from 'react';
import { Play } from 'lucide-react';

interface LoadingScreenProps {
  onStart: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onStart }) => {
  return (
    <div
      onClick={onStart}
      className="absolute inset-0 bg-[#080811] z-40 flex flex-col items-center justify-between p-8 text-center cursor-pointer select-none"
    >
      <div className="w-full flex justify-center pt-8">
        <span className="text-xs font-arcade tracking-widest text-[#00F0FF]/60 uppercase">
          ★ ARCADE SURVIVAL SYSTEM ★
        </span>
      </div>

      {/* Hero Animated Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#9D00FF] to-[#FF007F] p-1 animate-pulse shadow-[0_0_60px_rgba(0,240,255,0.6)]">
            <div className="w-full h-full rounded-full bg-[#080811] flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#00F0FF] shadow-[0_0_25px_#00F0FF] animate-bounce" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-arcade text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF007F] to-[#FFE600] drop-shadow-[0_0_25px_rgba(0,240,255,0.7)]">
            ONE MORE TRY!
          </h1>
          <p className="font-display text-sm text-white/60 tracking-wider">
            DODGE • SURVIVE • BEAT YOUR FRIENDS
          </p>
        </div>
      </div>

      {/* Tap Prompt */}
      <div className="flex flex-col items-center gap-3 pb-8">
        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-[#00F0FF]/40 text-[#00F0FF] font-arcade text-sm font-bold tracking-widest animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Play className="w-4 h-4 fill-current" />
          <span>TAP TO START</span>
        </div>
        <span className="text-[11px] text-white/40 font-display">Audio & Haptics Ready</span>
      </div>
    </div>
  );
};

