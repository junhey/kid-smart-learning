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
        // Duolingo Green Primary
        primary: {
          DEFAULT: '#58CC02',
          hover: '#46A302',
          light: '#89E219',
          dark: '#3D8A00',
        },
        // Status Colors
        correct: {
          DEFAULT: '#58CC02',
          bg: '#D7FFB8',
        },
        wrong: {
          DEFAULT: '#FF4B4B',
          bg: '#FFD1D1',
        },
        // Accent Colors
        accent: {
          blue: '#1CB0F6',
          purple: '#CE82FF',
          orange: '#FF9600',
          pink: '#FF66C4',
          yellow: '#FFC800',
        },
        // Old colors (for backward compatibility)
        secondary: "#4DD0E1",
        danger: "#FF6B6B",
        success: "#81C784",
        purple: "#A78BFA",
      },
      fontFamily: {
        rounded: ["Nunito", "Fredoka One", "system-ui", "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-fast": "pulse 0.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "star-burst": "starBurst 0.6s ease-out forwards",
        wiggle: "wiggle 0.5s ease-in-out",
        // New Duolingo-style animations
        "bounce-correct": "bounceCorrect 0.5s ease-out",
        shake: "shake 0.4s ease-in-out",
        "flash-green": "flashGreen 0.6s ease-in-out 2",
        "pop-in": "popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        starBurst: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1.4) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        // New keyframes
        bounceCorrect: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.05)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
        flashGreen: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#58CC02", borderWidth: "4px" },
        },
        popIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
