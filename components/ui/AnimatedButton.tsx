"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode, useState, useRef, useEffect } from "react";
import { useSound } from "@/hooks/useSound";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  playSound?: boolean;
  disabled?: boolean;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Loading state for async operations */
  loading?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
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
  ariaLabel,
  loading = false,
  onClick,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const { playClickSound } = useSound();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Remove ripple after animation completes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const newRipple: Ripple = {
        x,
        y,
        size,
        id: Date.now(),
      };
      
      setRipples((prev) => [...prev, newRipple]);
    }

    if (playSound) {
      playClickSound();
    }
    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-bold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-300
        relative overflow-hidden
        ${className}
      `}
      whileHover={!disabled && !loading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            opacity: 0.4,
            animation: 'ripple 600ms ease-out',
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </span>

      {/* Add ripple animation keyframes via style tag */}
      <style jsx>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 0.4;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </motion.button>
  );
}
