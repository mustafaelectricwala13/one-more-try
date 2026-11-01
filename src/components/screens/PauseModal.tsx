import React from 'react';
import { ArcadeButton } from '../ui/ArcadeButton';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface PauseModalProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  soundEnabled,
  onToggleSound,
  onResume,
  onRestart,
  onHome
}) => {
  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-[#0e0e1e] border border-white/20 rounded-3xl p-6 w-full max-w-xs flex flex-col gap-5 shadow-2xl animate-float">
        <h2 className="font-arcade text-3xl font-black text-white tracking-widest">
          PAUSED
        </h2>

        <div className="flex flex-col gap-2.5">
          <ArcadeButton
            onClick={onResume}
            variant="primary"
            size="lg"
            icon={<Play className="w-5 h-5 fill-current" />}
          >
            RESUME
          </ArcadeButton>

          <ArcadeButton
            onClick={onRestart}
            variant="secondary"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            RESTART
          </ArcadeButton>

          <ArcadeButton
            onClick={onHome}
            variant="secondary"
            size="md"
            icon={<Home className="w-4 h-4" />}
          >
            MAIN MENU
          </ArcadeButton>
        </div>

        <div className="flex justify-center border-t border-white/10 pt-3">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-2 text-xs font-arcade text-white/60 hover:text-white"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#00F0FF]" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
            <span>{soundEnabled ? 'SOUND: ON' : 'SOUND: MUTED'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

