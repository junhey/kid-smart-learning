import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated warm playful palette
        primary: {
          DEFAULT: '#FF6B9D',
          light: '#FF8FB4',
          dark: '#E91E63',
          50: '#FFF0F5',
          100: '#FFE0EB',
          200: '#FFB8D0',
          300: '#FF8FB4',
          400: '#FF6B9D',
          500: '#F06292',
          600: '#E91E63',
          700: '#C2185B',
        },
        secondary: {
          DEFAULT: '#4DC9F6',
          light: '#7DD8FB',
          dark: '#0288D1',
          50: '#E3F7FD',
          100: '#BAEAFC',
          200: '#7DD8FB',
          300: '#4DC9F6',
          400: '#29B6F6',
          500: '#03A9F4',
          600: '#0288D1',
        },
        accent: {
          purple: '#B388FF',
          orange: '#FFB74D',
          green: '#69F0AE',
          gold: '#FFD740',
          coral: '#FF8A80',
          mint: '#B9F6CA',
          sky: '#80D8FF',
          rose: '#FF80AB',
        },
        status: {
          correct: '#69F0AE',
          wrong: '#FF5252',
          neutral: '#B0BEC5',
          warning: '#FFD740',
        },
        // Old colors (backward compatibility)
        danger: '#FF5252',
        success: '#69F0AE',
        purple: '#B388FF',
      },
      fontFamily: {
        rounded: ['Nunito', 'Fredoka', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'system-ui', 'sans-serif'],
        fredoka: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cartoon: '5px 5px 0px rgba(0, 0, 0, 0.08)',
        'cartoon-lg': '8px 8px 0px rgba(0, 0, 0, 0.08)',
        glass: '0 8px 32px rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 15px 50px rgba(31, 38, 135, 0.1)',
        neon: '0 0 20px rgba(255, 107, 157, 0.4)',
        'neon-lg': '0 0 40px rgba(255, 107, 157, 0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        float: '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 0.5s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'star-burst': 'starBurst 0.6s ease-out forwards',
        wiggle: 'wiggle 0.5s ease-in-out',
        'bounce-correct': 'bounceCorrect 0.5s ease-out',
        shake: 'shake 0.4s ease-in-out',
        'flash-green': 'flashGreen 0.6s ease-in-out 2',
        'pop-in': 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUpFade 0.5s ease-out forwards',
        'slide-down': 'slideDownFade 0.5s ease-out forwards',
        'gradient-shift': 'gradientShift 4s ease infinite',
        breathe: 'breathe 3s ease-in-out infinite',
        orbit: 'orbit 8s linear infinite',
        'orbit-reverse': 'orbitReverse 10s linear infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-12px) rotate(2deg)' },
          '75%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.4) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceCorrect: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-8px) rotate(-2deg)' },
          '30%': { transform: 'translateX(8px) rotate(2deg)' },
          '45%': { transform: 'translateX(-6px) rotate(-1deg)' },
          '60%': { transform: 'translateX(6px) rotate(1deg)' },
          '75%': { transform: 'translateX(-3px)' },
        },
        flashGreen: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#69F0AE', borderWidth: '4px' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,107,157,0.2), 0 0 20px rgba(255,107,157,0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(255,107,157,0.4), 0 0 40px rgba(255,107,157,0.2)' },
        },
        slideUpFade: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDownFade: {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        orbitReverse: {
          from: { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          to: { transform: 'rotate(-360deg) translateX(80px) rotate(360deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #fce4ec 0%, #e8eaf6 30%, #e3f2fd 60%, #f3e5f5 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))',
        'rainbow': 'linear-gradient(90deg, #FF6B9D, #FFB74D, #FFD740, #69F0AE, #4DC9F6, #B388FF)',
      },
    },
  },
  plugins: [],
};
export default config;
