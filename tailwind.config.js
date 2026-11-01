/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          neon: '#00F0FF',
          pink: '#FF007F',
          yellow: '#FFE600',
          purple: '#9D00FF',
          dark: '#080811',
          card: 'rgba(20, 20, 35, 0.75)',
        }
      },
      fontFamily: {
        arcade: ['"Orbitron"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.8))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.4))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}

