"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  className = "",
  prefix = "",
  suffix = "",
  duration = 0.8,
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      key={value}
      initial={{ y: -20, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration,
      }}
    >
      {prefix}
      {value}
      {suffix}
    </motion.span>
  );
}
