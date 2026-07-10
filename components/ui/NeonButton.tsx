"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NeonButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  color?: "pink" | "purple" | "blue" | "orange" | "green";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
}

const colorMap = {
  pink: {
    bg: "from-pink-400 to-rose-500",
    shadow: "rgba(244,114,182,0.5)",
    hover: "rgba(244,114,182,0.7)",
  },
  purple: {
    bg: "from-purple-400 to-violet-500",
    shadow: "rgba(167,139,250,0.5)",
    hover: "rgba(167,139,250,0.7)",
  },
  blue: {
    bg: "from-blue-400 to-cyan-500",
    shadow: "rgba(96,165,250,0.5)",
    hover: "rgba(96,165,250,0.7)",
  },
  orange: {
    bg: "from-orange-400 to-amber-500",
    shadow: "rgba(251,146,60,0.5)",
    hover: "rgba(251,146,60,0.7)",
  },
  green: {
    bg: "from-emerald-400 to-green-500",
    shadow: "rgba(52,211,153,0.5)",
    hover: "rgba(52,211,153,0.7)",
  },
};

const sizeMap = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export default function NeonButton({
  children,
  href,
  onClick,
  className = "",
  color = "purple",
  size = "md",
  disabled = false,
  type = "button",
}: NeonButtonProps) {
  const c = colorMap[color];

  const buttonContent = (
    <motion.div
      className={`
        relative inline-flex items-center gap-2
        bg-gradient-to-r ${c.bg}
        text-white font-bold ${sizeMap[size]}
        cursor-pointer select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.05,
              boxShadow: `0 0 25px ${c.hover}, 0 10px 25px rgba(0,0,0,0.15)`,
            }
      }
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ boxShadow: `0 0 15px ${c.shadow}, 0 5px 15px rgba(0,0,0,0.1)` }}
      animate={{
        boxShadow: [
          `0 0 15px ${c.shadow}, 0 5px 15px rgba(0,0,0,0.1)`,
          `0 0 25px ${c.hover}, 0 5px 15px rgba(0,0,0,0.1)`,
          `0 0 15px ${c.shadow}, 0 5px 15px rgba(0,0,0,0.1)`,
        ],
      }}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-inherit bg-gradient-to-t from-black/10 to-white/10 pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );

  if (href && !disabled) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className="bg-transparent border-none p-0"
    >
      {buttonContent}
    </button>
  );
}
