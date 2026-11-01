# 🕹️ ONE MORE TRY! — Arcade Survival Mini-Game

> **"Just one more try..."** — The ultra-addictive, fast-paced neon arcade survival mini-game built for maximum replayability, viral social challenges, and 60 FPS mobile-first gameplay.

---

## ⚡ Core Concept
The player controls a glowing neon hyper-orb navigating an infinite cyber-corridor filled with procedurally generated moving obstacles. The objective is simple: **survive as long as possible, collect coins, graze obstacles for Near-Miss bonuses, and beat your friends' scores!**

Average session length: **20–90 seconds of pure adrenaline**, with instantaneous 0ms restarts.

---

## 🎮 Gameplay & Controls

### Universal Responsive Controls
- **Tap Screen / Click / Spacebar / Enter**: Instant direction reversal with juicy squash-and-stretch physics.
- **Left / Right Arrow Keys (or A / D)**: Direct lane navigation.
- **Touch Drag / Steer Mode**: Available in Settings for players who prefer continuous steering.

### Core Mechanics
- **Procedural Obstacle Waves**:
  - Sliding Neon Gates with dynamic gaps
  - Rotating Laser Crossbars with timing windows
  - Pulsing Energy Orbs with sine-wave motion
  - Zigzag Blades and Crusher Barriers
- **Dynamic Difficulty Ramping**:
  - Speed scales smoothly from 1.0x to 2.5x as score climbs.
  - Obstacle frequencies and movement speeds adapt dynamically.
- **Fair Collision Detection**:
  - Forgiving inner hitbox (~66% of visual radius) ensures players never feel unfairly clipped.
  - Circle-to-AABB and Circle-to-OBB (Oriented Bounding Box) mathematical collision precision.
- **Risk-Reward Near-Miss System**:
  - Graze obstacles within a few pixels to trigger **`NEAR MISS! (+3 PTS)`**, screen micro-shake, and sound chime!
- **Power-Ups**:
  - 🛡️ **Shield**: Absorbs 1 fatal impact with an explosive shockwave and temporary invulnerability.
  - 🧲 **Coin Magnet**: Magnetic aura that sucks in all coins across the arena for 8 seconds.
  - ⏳ **Slow-Mo Matrix**: Cyberpunk time-dilation slows obstacles by 50% for 6 seconds.
  - ⚡ **2X Multiplier**: Doubles all points and coin pickups for 8 seconds.
- **Instant Restart**:
  - Press Space, Enter, or tap "ONE MORE TRY!" on death to restart in **0ms without page reloads**.

---

## 🚀 Viral & Social Features

1. **Direct WhatsApp Score Sharing**:
   - One-tap sharing formatted with customized viral copy:
     `"I scored 87 in ONE MORE TRY! 😂 Can you beat me? Play now: [Game Link]"`
2. **Dynamic Challenge URLs**:
   - Generate unique challenge URLs encoding target scores and challenger names (e.g. `?c=87&by=Alex`).
   - When a friend opens the link, an in-game **Challenger Target Bar** tracks real-time progress toward crushing their score!
   - Celebration confetti and victory fanfare when the friend's target is beaten.
3. **Daily Login Streak**:
   - 7-Day rewards cycle with escalating coin gifts (Day 1: 15 gems up to Day 7: 200 gems).
4. **Global Leaderboard & Supabase Sync**:
   - Competitive ranking table with live rank badges (Crown 🥇, Silver 🥈, Bronze 🥉).
   - Works immediately offline with local persistence and simulated competitive high scores, with optional plug-and-play Supabase cloud sync.
5. **Unlockable Skins Vault**:
   - 7 distinct skins: *Neon Cyan, Cyber Pink, Solar Gold, Inferno Blaze, Matrix Code, Phantom Void, Prism Star*.
   - Each skin features unique glow colors, trail effects, and particle styles (plasma, fire, stars, glitch blocks).
6. **Trophies & Achievements Cabinet**:
   - 8 milestone achievements rewarding coins for gameplay feats.

---

## 🎵 Pure Web Audio Synthesizer
Zero external `.mp3` files required! The entire audio engine runs on the **Web Audio API**:
- Frequency-ramped jump/bounce chirp
- Rising pitch arpeggio chimes on coin combo streaks
- Heavy low-pass sub-bass explosion on death
- Electric crackle on shield shatter
- Procedural Synthwave BGM loop with warm analog bass and arpeggiated leads
- Native Haptic vibration feedback (`navigator.vibrate`) on supported mobile devices.

---

## 📱 PWA & Mobile Performance
- Full PWA configuration (`manifest.json` and `sw.js` offline cache service worker).
- Optimized for 60+ FPS on mobile browsers.
- Disabled accidental double-tap zoom and pull-to-refresh gestures.
- High-DPI Retina canvas scaling with `window.devicePixelRatio`.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Rendering**: HTML5 Canvas 2D with custom Particle & Shockwave Engine
- **Styling**: Tailwind CSS + Custom Arcade Neon Shadows
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti
- **Cloud Backend**: Supabase Client (optional)

---

## 🏁 Quickstart

```bash
# Navigate to game directory
cd one-more-try

# Install dependencies (already installed)
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

