import { ChallengeData } from '../types/game';

export const challengeService = {
  /**
   * Parse challenge params from the current window location
   */
  getChallengeFromURL(): ChallengeData | null {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const targetScoreStr = params.get('c') || params.get('challenge');
    if (!targetScoreStr) return null;

    const targetScore = parseInt(targetScoreStr, 10);
    if (isNaN(targetScore) || targetScore <= 0) return null;

    const challengerName = params.get('by') || 'A Friend';
    const skinId = params.get('s') || undefined;
    const seed = params.get('seed') ? parseInt(params.get('seed')!, 10) : undefined;

    return {
      challengerName,
      targetScore,
      skinId,
      seed
    };
  },

  /**
   * Generate unique challenge link URL
   */
  createChallengeUrl(score: number, playerName: string, skinId?: string): string {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const cleanPath = pathname.endsWith('/') ? pathname : pathname + '/';
    const params = new URLSearchParams({
      c: score.toString(),
      by: playerName,
      s: skinId || 'neon_cyan',
      seed: Math.floor(Date.now() % 100000).toString()
    });
    return `${origin}${cleanPath}?${params.toString()}`;
  },

  /**
   * Generate WhatsApp direct share URL
   * Example: "I scored 87 in ONE MORE TRY! 😂 Can you beat me? Play now: [Game Link]"
   */
  getWhatsAppShareUrl(score: number, playerName: string, skinId?: string): string {
    const challengeUrl = this.createChallengeUrl(score, playerName, skinId);
    const message = `I scored ${score} in ONE MORE TRY! 😂 Can you beat me? Play now: ${challengeUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  },

  /**
   * Generate Telegram share URL
   */
  getTelegramShareUrl(score: number, playerName: string, skinId?: string): string {
    const challengeUrl = this.createChallengeUrl(score, playerName, skinId);
    const message = `I scored ${score} in ONE MORE TRY! ⚡ Can you beat my run?`;
    return `https://t.me/share/url?url=${encodeURIComponent(challengeUrl)}&text=${encodeURIComponent(message)}`;
  },

  /**
   * Generate Twitter / X share URL
   */
  getTwitterShareUrl(score: number, playerName: string, skinId?: string): string {
    const challengeUrl = this.createChallengeUrl(score, playerName, skinId);
    const message = `I just scored ${score} in ONE MORE TRY! 🎮 Bet you can't beat me:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(challengeUrl)}`;
  },

  /**
   * Share via Native Web Share API with clipboard fallback
   */
  async shareNative(score: number, playerName: string, skinId?: string): Promise<'shared' | 'copied' | 'failed'> {
    const challengeUrl = this.createChallengeUrl(score, playerName, skinId);
    const shareData = {
      title: 'ONE MORE TRY! Arcade Survival',
      text: `I scored ${score} in ONE MORE TRY! 😂 Can you beat me?`,
      url: challengeUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return 'shared';
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return 'failed';
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(`${shareData.text} Play now: ${challengeUrl}`);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
};

