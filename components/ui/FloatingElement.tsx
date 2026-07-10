"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  amplitude?: number;
  delay?: number;
}

export default function FloatingElement({
  children,
  className = "",
  speed = 4,
  amplitude = 15,
  delay = 0,
}: FloatingElementProps) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{
        y: [0, -amplitude, 0, amplitude, 0],
        rotate: [0, 5, -3, 5, 0],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
