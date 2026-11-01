import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ScreenState, 
  GameStats, 
  GameSettings, 
  BallSkin, 
  Achievement, 
  ActivePowerUp, 
  ChallengeData 
} from './types/game';
import { storageService } from './services/storage';
import { challengeService } from './services/challenge';
import { supabaseService } from './services/supabase';
import { soundManager } from './audio/soundManager';
import { GameEngine } from './game/GameEngine';

import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { PauseModal } from './components/screens/PauseModal';
import { LeaderboardModal } from './components/screens/LeaderboardModal';
import { ChallengeModal } from './components/screens/ChallengeModal';
import { ShopModal } from './components/screens/ShopModal';
import { AchievementsModal } from './components/screens/AchievementsModal';
import { SettingsModal } from './components/screens/SettingsModal';
import { ToastContainer, ToastMessage } from './components/ui/Toast';

export const App: React.FC = () => {
  // Navigation & Screens
  const [screen, setScreen] = useState<ScreenState>('loading');
  
  // Persistent data state
  const [stats, setStats] = useState<GameStats>(storageService.getStats());
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
  const [skins, setSkins] = useState<BallSkin[]>(storageService.getSkins());
  const [selectedSkin, setSelectedSkin] = useState<BallSkin>(() => {
    const all = storageService.getSkins();
    const currentId = storageService.getSelectedSkinId();
    return all.find((s) => s.id === currentId) || all[0];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(storageService.getAchievements());
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [streakInfo, setStreakInfo] = useState(() => storageService.checkDailyStreak());

  // Live in-game metrics
  const [score, setScore] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [lastRunNearMisses, setLastRunNearMisses] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  // Modals
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Engine ref
  const engineRef = useRef<GameEngine | null>(null);

  // Helper: show toast
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToasts((prev) => [...prev, { id: `toast-${Date.now()}-${Math.random()}`, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize on mount: check URL challenge params
  useEffect(() => {
    const incomingChallenge = challengeService.getChallengeFromURL();
    if (incomingChallenge) {
      setChallenge(incomingChallenge);
      showToast(`Challenge from ${incomingChallenge.challengerName}! Target: ${incomingChallenge.targetScore} pts`, 'info');
    }
  }, [showToast]);

  // Synchronize audio settings
  useEffect(() => {
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setMusicEnabled(settings.musicEnabled);
    soundManager.setHapticsEnabled(settings.hapticsEnabled);
  }, [settings]);

  // Check achievements progress
  const updateAchievement = useCallback((achId: string, progressDelta: number) => {
    setAchievements((prev) => {
      const updated = prev.map((ach) => {
        if (ach.id === achId && !ach.unlocked) {
          const newProgress = Math.min(ach.maxProgress, ach.progress + progressDelta);
          const isNowUnlocked = newProgress >= ach.maxProgress;
          if (isNowUnlocked) {
            showToast(`🏆 Trophy Unlocked: ${ach.title}! (+${ach.rewardCoins} gems)`, 'success');
            // Give reward coins
            setStats((st) => {
              const nextSt = { ...st, totalCoins: st.totalCoins + ach.rewardCoins };
              storageService.saveStats(nextSt);
              return nextSt;
            });
          }
          return { ...ach, progress: newProgress, unlocked: isNowUnlocked };
        }
        return ach;
      });
      storageService.saveAchievements(updated);
      return updated;
    });
  }, [showToast]);

  // Handler: Loading -> Home / Ready
  const handleLoadingComplete = () => {
    setScreen('home');
    soundManager.playClick();
    if (settings.musicEnabled) {
      soundManager.startBGM();
    }
  };

  // Handler: Start / Play
  const handlePlayGame = () => {
    setScore(0);
    setCoinsEarned(0);
    setCombo(0);
    setActivePowerUps([]);
    setIsNewHigh(false);
    setScreen('playing');

    // Initialize or restart engine
    const canvas = document.querySelector('canvas');
    if (canvas) {
      if (!engineRef.current) {
        engineRef.current = new GameEngine(
          canvas,
          selectedSkin,
          settings,
          {
            onScoreUpdate: (s) => setScore(s),
            onCoinUpdate: (c) => setCoinsEarned(c),
            onComboUpdate: (cb) => setCombo(cb),
            onPowerUpUpdate: (pu) => setActivePowerUps(pu),
            onNearMiss: (pts) => {
              updateAchievement('near_miss_10', 1);
            },
            onChallengeBeaten: () => {
              showToast('⚔️ CHALLENGE COMPLETED! You beat your friend!', 'success');
            },
            onGameOver: handleGameOver
          },
          challenge
        );
      } else {
        engineRef.current.setSkin(selectedSkin);
        engineRef.current.setSettings(settings);
      }
      engineRef.current.start();
    }
  };

  // Handler: Game Over
  const handleGameOver = useCallback((finalScore: number, coins: number, nearMisses: number) => {
    setLastRunNearMisses(nearMisses);
    setScreen('gameover');

    setStats((prevStats) => {
      const isNewBest = finalScore > prevStats.highScore;
      setIsNewHigh(isNewBest);

      const updated: GameStats = {
        ...prevStats,
        highScore: Math.max(prevStats.highScore, finalScore),
        totalGames: prevStats.totalGames + 1,
        totalCoins: prevStats.totalCoins + coins,
        totalNearMisses: prevStats.totalNearMisses + nearMisses,
        bestCombo: Math.max(prevStats.bestCombo, combo)
      };

      storageService.saveStats(updated);

      // Submit score to leaderboard
      supabaseService.submitScore(settings.playerName, finalScore, selectedSkin.id);

      return updated;
    });

    // Check achievement progress
    updateAchievement('first_try', 1);
    updateAchievement('games_10', 1);
    if (finalScore >= 25) updateAchievement('score_25', 25);
    if (finalScore >= 50) updateAchievement('score_50', 50);
    if (finalScore >= 100) updateAchievement('score_100', 100);
    if (coins > 0) updateAchievement('coin_collector_50', coins);
  }, [combo, selectedSkin.id, settings.playerName, updateAchievement]);

  // Handler: Instant Restart (ONE MORE TRY!)
  const handleRestart = () => {
    setScore(0);
    setCoinsEarned(0);
    setCombo(0);
    setActivePowerUps([]);
    setIsNewHigh(false);
    setScreen('playing');

    if (engineRef.current) {
      engineRef.current.start();
    } else {
      handlePlayGame();
    }
  };

  // Handler: Pause
  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
    setScreen('paused');
  };

  const handleResume = () => {
    setScreen('playing');
    if (engineRef.current) {
      engineRef.current.resume();
    }
  };

  const handleReturnHome = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setScreen('home');
  };

  const handleClaimStreak = () => {
    if (streakInfo.rewardClaimable) {
      const newTotal = stats.totalCoins + streakInfo.rewardAmount;
      const updatedStats = { ...stats, totalCoins: newTotal };
      storageService.saveStats(updatedStats);
      setStats(updatedStats);
      setStreakInfo({ ...streakInfo, rewardClaimable: false });
      soundManager.playPowerUp();
      showToast(`Claimed +${streakInfo.rewardAmount} gems streak reward! 🔥`, 'success');
      if (streakInfo.streak >= 3) {
        updateAchievement('streak_3', 3);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#080811] flex items-center justify-center overflow-hidden font-display select-none">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Arcade Frame Viewport */}
      <div className="relative w-full h-full max-w-[480px] max-h-[880px] mx-auto flex items-center justify-center overflow-hidden">
        {/* Persistent Canvas Layer */}
        <GameCanvas
          engineRef={engineRef}
          controlMode={settings.controlMode}
        />

        {/* In-Game HUD (shown during gameplay and pause) */}
        {(screen === 'playing' || screen === 'paused') && (
          <HUD
            score={score}
            coins={coinsEarned}
            combo={combo}
            activePowerUps={activePowerUps}
            challenge={challenge}
            onPause={handlePause}
          />
        )}

        {/* Loading Screen */}
        {screen === 'loading' && (
          <LoadingScreen onStart={handleLoadingComplete} />
        )}

        {/* Home Screen */}
        {screen === 'home' && (
          <HomeScreen
            stats={stats}
            currentSkin={selectedSkin}
            challenge={challenge}
            streakInfo={streakInfo}
            onPlay={handlePlayGame}
            onOpenLeaderboard={() => setLeaderboardOpen(true)}
            onOpenChallenge={() => setChallengeOpen(true)}
            onOpenShop={() => setShopOpen(true)}
            onOpenAchievements={() => setAchievementsOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            onClaimStreak={handleClaimStreak}
          />
        )}

        {/* Pause Overlay */}
        {screen === 'paused' && (
          <PauseModal
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => {
              const updated = { ...settings, soundEnabled: !settings.soundEnabled };
              setSettings(updated);
              storageService.saveSettings(updated);
            }}
            onResume={handleResume}
            onRestart={handleRestart}
            onHome={handleReturnHome}
          />
        )}

        {/* Game Over Screen */}
        {screen === 'gameover' && (
          <GameOverScreen
            score={score}
            highScore={stats.highScore}
            isNewHigh={isNewHigh}
            coinsEarned={coinsEarned}
            nearMisses={lastRunNearMisses}
            playerName={settings.playerName}
            selectedSkinId={selectedSkin.id}
            challenge={challenge}
            onRestart={handleRestart}
            onHome={handleReturnHome}
            onOpenChallengeModal={() => setChallengeOpen(true)}
            showToast={showToast}
          />
        )}

        {/* Modals */}
        {leaderboardOpen && (
          <LeaderboardModal
            playerName={settings.playerName}
            onClose={() => setLeaderboardOpen(false)}
          />
        )}

        {challengeOpen && (
          <ChallengeModal
            score={stats.highScore || score || 25}
            playerName={settings.playerName}
            selectedSkinId={selectedSkin.id}
            onClose={() => setChallengeOpen(false)}
            showToast={showToast}
          />
        )}

        {shopOpen && (
          <ShopModal
            skins={skins}
            selectedSkinId={selectedSkin.id}
            totalCoins={stats.totalCoins}
            onSelectSkin={(skin) => setSelectedSkin(skin)}
            onCoinsChange={(newCoins) => {
              setStats((st) => ({ ...st, totalCoins: newCoins }));
              setSkins(storageService.getSkins());
            }}
            onClose={() => setShopOpen(false)}
            showToast={showToast}
          />
        )}

        {achievementsOpen && (
          <AchievementsModal
            achievements={achievements}
            totalCoins={stats.totalCoins}
            onCoinsChange={(newCoins) => setStats((st) => ({ ...st, totalCoins: newCoins }))}
            onClose={() => setAchievementsOpen(false)}
            showToast={showToast}
          />
        )}

        {settingsOpen && (
          <SettingsModal
            settings={settings}
            onSettingsChange={(newSettings) => setSettings(newSettings)}
            onClose={() => setSettingsOpen(false)}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
};

export default App;

