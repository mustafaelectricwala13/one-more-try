import React from 'react';
import { BallSkin } from '../../types/game';
import { storageService } from '../../services/storage';
import { Palette, X, Sparkles, Check, Lock } from 'lucide-react';
import { ArcadeButton } from '../ui/ArcadeButton';

interface ShopModalProps {
  skins: BallSkin[];
  selectedSkinId: string;
  totalCoins: number;
  onSelectSkin: (skin: BallSkin) => void;
  onCoinsChange: (newCoins: number) => void;
  onClose: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  skins,
  selectedSkinId,
  totalCoins,
  onSelectSkin,
  onCoinsChange,
  onClose,
  showToast
}) => {
  const handleEquip = (skin: BallSkin) => {
    storageService.setSelectedSkinId(skin.id);
    onSelectSkin(skin);
    showToast(`Equipped ${skin.name}!`, 'info');
  };

  const handleBuy = (skin: BallSkin) => {
    if (totalCoins < skin.cost) {
      showToast('Not enough coins! Keep dodging and grazing!', 'warning');
      return;
    }

    const newCoins = totalCoins - skin.cost;
    const stats = storageService.getStats();
    stats.totalCoins = newCoins;
    storageService.saveStats(stats);
    storageService.unlockSkin(skin.id);

    onCoinsChange(newCoins);
    skin.unlocked = true;
    handleEquip(skin);
    showToast(`Unlocked & equipped ${skin.name}!`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e1e] border border-[#00F0FF]/40 rounded-3xl w-full max-w-sm max-h-[85vh] p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="font-arcade text-base font-black text-white">SKIN VAULT</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#151528] px-2.5 py-1 rounded-full border border-yellow-500/30">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
              <span className="font-arcade text-xs font-black text-[#FFD700]">{totalCoins}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
          {skins.map((skin) => {
            const isSelected = skin.id === selectedSkinId;
            const canAfford = totalCoins >= skin.cost;

            return (
              <div
                key={skin.id}
                className={`
                  flex items-center justify-between p-3 rounded-2xl border transition-all
                  ${
                    isSelected
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-[#151528]/80 border-white/10 hover:border-white/20'
                  }
                `}
              >
                {/* Skin Preview Icon */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-md shrink-0 transition-transform active:scale-95"
                    style={{
                      backgroundColor: skin.color,
                      boxShadow: `0 0 15px ${skin.glowColor}`
                    }}
                  >
                    <span>{skin.icon}</span>
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="font-arcade text-xs font-black text-white">
                      {skin.name}
                    </span>
                    <span className="text-[10px] text-white/60 font-display line-clamp-1">
                      {skin.description}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0">
                  {skin.unlocked ? (
                    isSelected ? (
                      <div className="flex items-center gap-1 text-[11px] font-arcade text-[#00FF66] font-bold px-2 py-1 bg-[#00FF66]/10 rounded-lg border border-[#00FF66]/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquip(skin)}
                        className="text-xs font-arcade font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#00F0FF] hover:text-[#080811] text-white transition-all active:scale-95"
                      >
                        EQUIP
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(skin)}
                      disabled={!canAfford}
                      className={`
                        flex items-center gap-1 text-xs font-arcade font-black px-3 py-1.5 rounded-xl transition-all active:scale-95
                        ${
                          canAfford
                            ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-[#080811] shadow-[0_0_10px_rgba(255,215,0,0.4)] hover:brightness-110'
                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }
                      `}
                    >
                      <Lock className="w-3 h-3" />
                      <span>{skin.cost}</span>
                      <Sparkles className="w-3 h-3 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-arcade text-xs font-bold transition-all"
        >
          DONE
        </button>
      </div>
    </div>
  );
};

