/**
 * Button Component - Duolingo Style 3D Buttons
 * Enhanced with accessibility (a11y) support and ripple effects
 */

"use client";

import { useState, useRef, useEffect } from 'react';
import { colors, shadows, borderRadius, transitions } from '@/lib/design-tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  /** Accessible label for screen readers (overrides children if provided) */
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

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ariaLabel,
  loading = false,
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Remove ripple after animation completes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600); // Match animation duration
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

    // Call original onClick handler
    if (onClick) {
      onClick(e);
    }
  };
  const baseStyles = `
    font-bold rounded-2xl
    transition-all duration-200
    active:translate-y-1
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-offset-2
    relative overflow-hidden
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-b from-[${colors.primary.green}] to-[${colors.primary.greenHover}]
      border-b-4 border-[${colors.primary.greenDark}]
      text-white
      hover:brightness-110
      active:border-b-0
      shadow-lg
      focus:ring-[${colors.primary.green}]/50
    `,
    secondary: `
      bg-white
      border-2 border-[${colors.border.medium}]
      text-[${colors.text.primary}]
      hover:bg-[${colors.background.subtle}]
      active:border-b-0 active:border-t-2
      focus:ring-gray-300
    `,
    danger: `
      bg-gradient-to-b from-[${colors.status.wrong}] to-[#E03E3E]
      border-b-4 border-[#C92A2A]
      text-white
      hover:brightness-110
      active:border-b-0
      shadow-lg
      focus:ring-red-300
    `,
    success: `
      bg-gradient-to-b from-[${colors.accent.blue}] to-[#1899D6]
      border-b-4 border-[#1577B0]
      text-white
      hover:brightness-110
      active:border-b-0
      shadow-lg
      focus:ring-blue-300
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={buttonRef}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      onClick={handleClick}
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
    </button>
  );
}
