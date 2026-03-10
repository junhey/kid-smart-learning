"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SoundButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "success" | "danger" | "neutral";
}

const variantStyles = {
  primary: "bg-gradient-to-b from-yellow-400 to-orange-400 border-orange-600 text-white",
  success: "bg-gradient-to-b from-green-400 to-green-500 border-green-700 text-white",
  danger: "bg-gradient-to-b from-red-400 to-red-500 border-red-700 text-white",
  neutral: "bg-gradient-to-b from-gray-100 to-gray-200 border-gray-400 text-gray-800",
};

export default function SoundButton({
  onClick,
  children,
  className = "",
  disabled = false,
  variant = "primary",
}: SoundButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    // Play a soft click sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context not available
    }
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95, y: 2 }}
      className={`
        btn-kid border-b-4
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
