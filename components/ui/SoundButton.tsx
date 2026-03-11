"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { playClick } from "@/lib/sounds";

interface SoundButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "success" | "danger" | "neutral";
  playSound?: boolean; // 是否播放点击音效
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
  playSound = true,
}: SoundButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    
    // 播放点击音效 (Duolingo风格)
    if (playSound) {
      playClick();
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
