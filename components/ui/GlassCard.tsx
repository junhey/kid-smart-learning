"use client";

import { ReactNode, CSSProperties } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: number;
  padding?: string;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "rgba(255,255,255,0.15)",
  hoverScale = 1.02,
  padding = "p-6",
  onClick,
  ...motionProps
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative
        bg-white/70 backdrop-blur-xl
        border border-white/30
        rounded-2xl
        ${padding}
        overflow-hidden
        transition-shadow duration-500
        ${className}
      `}
      style={
        {
          boxShadow: `
            0 8px 32px rgba(31, 38, 135, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.6),
            0 0 0 1px rgba(255,255,255,0.1)
          `,
          "--glow-color": glowColor,
        } as CSSProperties
      }
      whileHover={{
        scale: hoverScale,
        boxShadow: `
          0 12px 40px rgba(31, 38, 135, 0.12),
          inset 0 1px 0 rgba(255,255,255,0.8),
          0 0 20px var(--glow-color)
        `,
        borderColor: "rgba(255,255,255,0.5)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      {...motionProps}
    >
      {/* Shine effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}
