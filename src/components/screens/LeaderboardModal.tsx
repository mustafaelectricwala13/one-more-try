import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../../types/game';
import { supabaseService } from '../../services/supabase';
import { Trophy, X, Globe, Crown, Medal } from 'lucide-react';

interface LeaderboardModalProps {
  playerName: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  playerName,
  onClose
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseService.getLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const isOnline = supabaseService.isConfigured();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e1e] border border-[#FFD700]/40 rounded-3xl w-full max-w-sm max-h-[85vh] p-6 shadow-[0_0_50px_rgba(255,215,0,0.2)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFD700]" />
            <h3 className="font-arcade text-base font-black text-white">GLOBAL RANKS</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center justify-between text-[11px] font-arcade px-3 py-1.5 rounded-xl bg-[#151528] border border-white/5">
          <span className="text-white/60">NETWORK</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00FF66] shadow-[0_0_8px_#00FF66]' : 'bg-[#00F0FF]'}`} />
            <span className="text-white/80">{isOnline ? 'SUPABASE SYNCED' : 'LOCAL / GLOBAL'}</span>
          </div>
        </div>

        {/* List of High Scores */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
          {loading ? (
            <div className="text-center py-8 text-white/40 font-arcade text-xs animate-pulse">
              LOADING LEADERBOARD...
            </div>
          ) : (
            entries.map((entry, index) => {
              const isCurrent = entry.name === playerName || entry.isPlayer;
              const rank = entry.rank || index + 1;

              return (
                <div
                  key={entry.id || index}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all
                    ${
                      isCurrent
                        ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : rank === 1
                        ? 'bg-[#FFD700]/10 border-[#FFD700]/40'
                        : rank === 2
                        ? 'bg-[#C0C0C0]/10 border-[#C0C0C0]/30'
                        : rank === 3
                        ? 'bg-[#CD7F32]/10 border-[#CD7F32]/30'
                        : 'bg-[#151528]/80 border-white/5'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-7 text-center font-arcade font-black text-sm">
                      {rank === 1 ? (
                        <Crown className="w-5 h-5 text-[#FFD700] mx-auto fill-[#FFD700]" />
                      ) : rank === 2 ? (
                        <Medal className="w-5 h-5 text-[#C0C0C0] mx-auto" />
                      ) : rank === 3 ? (
                        <Medal className="w-5 h-5 text-[#CD7F32] mx-auto" />
                      ) : (
                        <span className="text-white/40">#{rank}</span>
                      )}
                    </div>

                    <div className="flex flex-col text-left">
                      <span className={`font-arcade text-xs font-bold ${isCurrent ? 'text-[#00F0FF]' : 'text-white'}`}>
                        {entry.name} {isCurrent && '★ (YOU)'}
                      </span>
                      <span className="text-[10px] text-white/40 font-display">
                        {entry.date}
                      </span>
                    </div>
                  </div>

                  <span className="font-arcade text-base font-black text-[#FFD700]">
                    {entry.score}
                  </span>
                </div>
              );
            })
          )}
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

