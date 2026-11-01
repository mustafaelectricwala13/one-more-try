import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { storageService } from '../../services/storage';
import { soundManager } from '../../audio/soundManager';
import { Settings, X, Volume2, VolumeX, Music, Smartphone, HelpCircle, Gamepad2 } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSettingsChange,
  onClose,
  showToast
}) => {
  const [name, setName] = useState(settings.playerName);

  const toggleSound = () => {
    const next = { ...settings, soundEnabled: !settings.soundEnabled };
    soundManager.setSoundEnabled(next.soundEnabled);
    save(next);
  };

  const toggleMusic = () => {
    const next = { ...settings, musicEnabled: !settings.musicEnabled };
    soundManager.setMusicEnabled(next.musicEnabled);
    save(next);
  };

  const toggleHaptics = () => {
    const next = { ...settings, hapticsEnabled: !settings.hapticsEnabled };
    soundManager.setHapticsEnabled(next.hapticsEnabled);
    save(next);
  };

  const setControlMode = (mode: 'tap_switch' | 'drag_steer') => {
    const next = { ...settings, controlMode: mode };
    save(next);
    showToast(`Control mode: ${mode === 'tap_switch' ? 'Tap To Switch' : 'Drag / Steer'}`, 'info');
  };

  const handleNameBlur = () => {
    if (name.trim() && name !== settings.playerName) {
      const next = { ...settings, playerName: name.trim() };
      save(next);
      showToast('Player name updated!', 'success');
    }
  };

  const save = (updated: GameSettings) => {
    storageService.saveSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e1e] border border-white/20 rounded-3xl w-full max-w-sm max-h-[85vh] p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="font-arcade text-base font-black text-white">SETTINGS</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
          {/* Player Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-arcade text-white/60">PLAYER NICKNAME</label>
            <input
              type="text"
              value={name}
              maxLength={15}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              className="w-full bg-[#151528] border border-white/20 rounded-xl px-3 py-2 text-white font-arcade text-sm focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          {/* Audio Toggles */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Sound FX */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#151528] border border-white/5">
              <div className="flex items-center gap-2.5">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#00F0FF]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-white/40" />
                )}
                <span className="font-arcade text-xs font-bold text-white">SOUND EFFECTS</span>
              </div>
              <button
                onClick={toggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.soundEnabled ? 'bg-[#00F0FF]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#080811] absolute top-0.5 transition-transform ${
                    settings.soundEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Music */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#151528] border border-white/5">
              <div className="flex items-center gap-2.5">
                <Music className={`w-5 h-5 ${settings.musicEnabled ? 'text-[#FF007F]' : 'text-white/40'}`} />
                <span className="font-arcade text-xs font-bold text-white">SYNTH BGM TRACK</span>
              </div>
              <button
                onClick={toggleMusic}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.musicEnabled ? 'bg-[#FF007F]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#080811] absolute top-0.5 transition-transform ${
                    settings.musicEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Haptics */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#151528] border border-white/5">
              <div className="flex items-center gap-2.5">
                <Smartphone className={`w-5 h-5 ${settings.hapticsEnabled ? 'text-[#00FF66]' : 'text-white/40'}`} />
                <span className="font-arcade text-xs font-bold text-white">HAPTIC VIBRATION</span>
              </div>
              <button
                onClick={toggleHaptics}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.hapticsEnabled ? 'bg-[#00FF66]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#080811] absolute top-0.5 transition-transform ${
                    settings.hapticsEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Controls Mode */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-[11px] font-arcade text-white/60">CONTROL MODE</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setControlMode('tap_switch')}
                className={`p-2.5 rounded-xl border font-arcade text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  settings.controlMode === 'tap_switch'
                    ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                    : 'bg-[#151528] border-white/10 text-white/60'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>TAP TO SWITCH</span>
              </button>

              <button
                onClick={() => setControlMode('drag_steer')}
                className={`p-2.5 rounded-xl border font-arcade text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  settings.controlMode === 'drag_steer'
                    ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                    : 'bg-[#151528] border-white/10 text-white/60'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>DRAG / ARROWS</span>
              </button>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-[#121224] rounded-2xl p-3 border border-white/5 flex flex-col gap-1 text-left text-xs">
            <div className="flex items-center gap-1.5 text-[#00F0FF] font-arcade text-[11px] font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>HOW TO SURVIVE:</span>
            </div>
            <p className="text-white/70 font-display">
              • Tap / Space / Click to reverse direction.
            </p>
            <p className="text-white/70 font-display">
              • Graze obstacles within pixels for <span className="text-[#00F0FF] font-bold">NEAR MISS (+3 pts)</span>.
            </p>
            <p className="text-white/70 font-display">
              • Grab Shields 🛡️, Magnets 🧲, and Slow-Mo ⏳ to boost your run!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-arcade text-xs font-bold transition-all"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};

