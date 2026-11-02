import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArcadeButton } from '../ui/ArcadeButton';
import { challengeService } from '../../services/challenge';
import { RotateCcw, Share2, MessageCircle, Home, Sparkles, Zap, Trophy } from 'lucide-react';
import { ChallengeData } from '../../types/game';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  coinsEarned: number;
  nearMisses: number;
  playerName: string;
  selectedSkinId: string;
  challenge: ChallengeData | null;
  onRestart: () => void;
  onHome: () => void;
  onOpenChallengeModal: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  isNewHigh,
  coinsEarned,
  nearMisses,
  playerName,
  selectedSkinId,
  challenge,
  onRestart,
  onHome,
  onOpenChallengeModal,
  showToast
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Score count-up animation and confetti trigger
  useEffect(() => {
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    const frame = (time: number) => {
      const progress = Math.min(1, (time - startTime) / duration);
      setAnimatedScore(Math.floor(progress * score));
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);

    // Fire confetti on high score or challenge beat
    const isChallengeBeaten = challenge && score >= challenge.targetScore;
    if (isNewHigh || isChallengeBeaten) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [score, isNewHigh, challenge]);

  // Spacebar or Enter to instant restart!
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRestart]);

  const handleWhatsAppShare = () => {
    const url = challengeService.getWhatsAppShareUrl(score, playerName, selectedSkinId);
    window.open(url, '_blank');
  };

  const handleQuickCopy = async () => {
    const res = await challengeService.shareNative(score, playerName, selectedSkinId);
    if (res === 'copied') {
      showToast('Challenge link copied to clipboard! Send it to your friends!', 'success');
    } else if (res === 'shared') {
      showToast('Shared successfully!', 'success');
    } else {
      onOpenChallengeModal();
    }
  };

  const isChallengeBeaten = challenge && score >= challenge.targetScore;

  return (
    <div className="absolute inset-0 bg-[#080811]/95 backdrop-blur-md z-30 flex flex-col justify-between p-6 text-center select-none overflow-y-auto">
      {/* Top Banner */}
      <div className="pt-2 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600/30 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-bounce">
          <span className="text-xl">💥</span>
          <span className="font-arcade text-sm font-black text-red-300 tracking-widest uppercase">
            YOU ARE OUT!
          </span>
        </div>
        <h2 className="font-arcade text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-[#FF007F] to-[#FF4500] drop-shadow-[0_0_20px_rgba(255,0,85,0.8)]">
          GAME OVER
        </h2>
        {isChallengeBeaten && (
          <div className="inline-block mt-0.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#00FF66] to-[#00F0FF] text-[#080811] font-arcade text-xs font-black animate-bounce shadow-lg">
            🎉 CHALLENGE DESTROYED!
          </div>
        )}
        {isNewHigh && !isChallengeBeaten && (
          <div className="inline-block mt-0.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#080811] font-arcade text-xs font-black animate-pulse shadow-lg">
            ★ NEW PERSONAL BEST! ★
          </div>
        )}
      </div>

      {/* Main Score Board */}
      <div className="flex flex-col items-center gap-4 my-auto py-2">
        {/* Big Score Display */}
        <div className="flex flex-col items-center">
          <span className="font-arcade text-6xl font-black text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.8)]">
            {animatedScore}
          </span>
          <span className="text-xs font-arcade text-white/50 tracking-widest mt-1">
            FINAL SCORE
          </span>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs bg-[#121224] border border-white/10 rounded-2xl p-3 shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-arcade text-white/50">BEST</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="font-arcade text-sm font-black text-white">{highScore}</span>
            </div>
          </div>

          <div className="flex flex-col items-center border-x border-white/10">
            <span className="text-[10px] font-arcade text-white/50">GEMS</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
              <span className="font-arcade text-sm font-black text-[#FFD700]">+{coinsEarned}</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-arcade text-white/50">GRAZES</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="font-arcade text-sm font-black text-[#00F0FF]">{nearMisses}</span>
            </div>
          </div>
        </div>

        {/* Primary Instant Restart Button */}
        <ArcadeButton
          onClick={onRestart}
          variant="primary"
          size="xl"
          pulse={true}
          icon={<RotateCcw className="w-6 h-6 stroke-[3]" />}
          className="w-full max-w-xs shadow-[0_0_35px_rgba(0,240,255,0.7)]"
        >
          🔄 RESTART (ONE MORE TRY!)
        </ArcadeButton>
        <span className="text-[11px] text-white/40 font-display -mt-2">
          Press <span className="text-white font-mono font-bold">SPACE</span> or tap to instant restart
        </span>

        {/* Viral Social Buttons */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {/* WhatsApp Direct Share */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl bg-[#25D366] text-white font-arcade font-black text-xs tracking-wider shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>SHARE ON WHATSAPP</span>
          </button>

          {/* Create Challenge Link */}
          <button
            onClick={handleQuickCopy}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl bg-[#151528] border border-white/20 text-white font-arcade font-black text-xs tracking-wider hover:border-[#00F0FF] hover:text-[#00F0FF] active:scale-95 transition-all shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>CHALLENGE FRIENDS (LINK)</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pb-2">
        <button
          onClick={onHome}
          className="inline-flex items-center gap-2 text-xs font-arcade text-white/60 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </button>
      </div>
    </div>
  );
};

