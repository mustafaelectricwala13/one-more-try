import React, { useState } from 'react';
import { challengeService } from '../../services/challenge';
import { ArcadeButton } from '../ui/ArcadeButton';
import { X, MessageCircle, Copy, Check, Send, Twitter, Swords } from 'lucide-react';

interface ChallengeModalProps {
  score: number;
  playerName: string;
  selectedSkinId: string;
  onClose: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  score,
  playerName,
  selectedSkinId,
  onClose,
  showToast
}) => {
  const [challengeScore, setChallengeScore] = useState(Math.max(score, 10));
  const [name, setName] = useState(playerName || 'Player');
  const [copied, setCopied] = useState(false);

  const challengeUrl = challengeService.createChallengeUrl(challengeScore, name, selectedSkinId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setCopied(true);
      showToast('Challenge URL copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy link', 'warning');
    }
  };

  const handleWhatsApp = () => {
    const url = challengeService.getWhatsAppShareUrl(challengeScore, name, selectedSkinId);
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const url = challengeService.getTelegramShareUrl(challengeScore, name, selectedSkinId);
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = challengeService.getTwitterShareUrl(challengeScore, name, selectedSkinId);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e1e] border border-[#FF007F]/40 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_50px_rgba(255,0,127,0.25)] flex flex-col gap-4 animate-float">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#FF007F]" />
            <h3 className="font-arcade text-base font-black text-white">CHALLENGE A FRIEND</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Config */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-arcade text-white/60 block mb-1">
              YOUR NAME / ALIAS
            </label>
            <input
              type="text"
              value={name}
              maxLength={14}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#151528] border border-white/20 rounded-xl px-3 py-2 text-white font-arcade text-sm focus:outline-none focus:border-[#FF007F]"
            />
          </div>

          <div>
            <label className="text-[11px] font-arcade text-white/60 block mb-1">
              TARGET SCORE TO BEAT
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={9999}
                value={challengeScore}
                onChange={(e) => setChallengeScore(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#151528] border border-white/20 rounded-xl px-3 py-2 text-white font-arcade text-lg font-black focus:outline-none focus:border-[#FF007F]"
              />
            </div>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="flex flex-col gap-2 pt-1">
          {/* WhatsApp Primary */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#25D366] text-white font-arcade font-black text-xs tracking-wider shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>SEND VIA WHATSAPP</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTelegram}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#229ED9] text-white font-arcade text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>TELEGRAM</span>
            </button>

            <button
              onClick={handleTwitter}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1DA1F2] text-white font-arcade text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              <Twitter className="w-4 h-4 fill-current" />
              <span>X / TWITTER</span>
            </button>
          </div>
        </div>

        {/* Link Copy Field */}
        <div className="flex items-center gap-2 bg-[#151528] border border-white/10 rounded-xl p-1.5 pl-3">
          <span className="text-xs text-white/50 truncate flex-1 font-mono">
            {challengeUrl}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF007F] text-white font-arcade text-xs font-bold active:scale-95 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        {/* Challenge Preview Card */}
        <div className="bg-[#121224] rounded-2xl p-3 border border-white/5 text-left text-xs">
          <span className="text-[10px] font-arcade text-[#FF007F] font-black uppercase">
            Preview message:
          </span>
          <p className="text-white/80 font-display italic mt-0.5">
            "I scored {challengeScore} in ONE MORE TRY! 😂 Can you beat me? Play now..."
          </p>
        </div>
      </div>
    </div>
  );
};

