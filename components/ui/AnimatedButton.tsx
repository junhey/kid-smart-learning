"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { useSound } from "@/hooks/useSound";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  playSound?: boolean;
  disabled?: boolean;
}

const variants = {
  primary: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl",
  secondary: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md hover:shadow-lg",
  success: "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg hover:shadow-xl",
  danger: "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg hover:shadow-xl",
  ghost: "bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export default function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  playSound = true,
  disabled = false,
  onClick,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const { playClickSound } = useSound();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (playSound) {
      playClickSound();
    }
    onClick?.(e);
  };

  return (
    <motion.button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-bold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
