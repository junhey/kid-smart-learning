/**
 * GameCard Component - Duolingo Style Card
 * 使用统一的设计tokens系统
 * Enhanced with keyboard navigation, accessibility, and ripple effects
 */

"use client";

import { KeyboardEvent, useState, useRef, useEffect } from 'react';

interface GameCardProps {
  title: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'info';
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function GameCard({
  title,
  description,
  icon,
  onClick,
  className = '',
  children,
  variant = 'default',
  ariaLabel,
}: GameCardProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Remove ripple after animation completes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;

    // Create ripple effect
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
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

    onClick();
  };

  // 键盘导航处理
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      
      // Create ripple at center for keyboard activation
      const card = cardRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        const newRipple: Ripple = {
          x,
          y,
          size,
          id: Date.now(),
        };
        
        setRipples((prev) => [...prev, newRipple]);
      }
      
      onClick();
    }
  };
  // 根据variant选择颜色
  const variantClasses = {
    default: 'bg-white border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
    primary: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-100 hover:shadow-[0_8px_24px_rgba(88,204,2,0.15)]',
    success: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-100 hover:shadow-[0_8px_24px_rgba(88,204,2,0.20)]',
    info: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 border-blue-200 hover:shadow-[0_8px_24px_rgba(28,176,246,0.15)]',
  }[variant];

  const variantText = {
    default: 'text-[#3C3C3C]',
    primary: 'text-[#3C3C3C]',
    success: 'text-[#3C3C3C]',
    info: 'text-[#3C3C3C]',
  }[variant];

  const variantDescription = {
    default: 'text-[#777777]',
    primary: 'text-[#777777]',
    success: 'text-[#777777]',
    info: 'text-[#777777]',
  }[variant];

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'article'}
      aria-label={ariaLabel || `${title}${description ? `: ${description}` : ''}`}
      className={`
        ${variantClasses}
        rounded-3xl
        p-6
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        hover:scale-[1.02]
        transition-all duration-300 ease-out
        border-2
        relative
        overflow-hidden
        ${onClick ? 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#58CC02]/50 focus:ring-offset-2' : ''}
        ${className}
      `}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none z-20"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            opacity: 0.3,
            background: 'radial-gradient(circle, rgba(88, 204, 2, 0.6) 0%, rgba(88, 204, 2, 0) 70%)',
            animation: 'ripple 600ms ease-out',
          }}
        />
      ))}

      {/* 背景装饰元素 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-xl bg-gradient-to-r from-[#58CC02]/20 to-[#1CB0F6]/20"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-xl bg-gradient-to-r from-[#CE82FF]/20 to-[#FFC800]/20"></div>
      </div>

      {/* 内容 */}
      <div className="relative z-10">
        {icon && (
          <div 
            className="text-6xl mb-4 text-center transform transition-transform hover:scale-110 hover:rotate-6 duration-300"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        
        <h3 className={`text-2xl font-bold ${variantText} text-center mb-2 font-["Fredoka"]`}>
          {title}
        </h3>
        
        {description && (
          <p className={`text-sm ${variantDescription} text-center mb-4 font-medium`}>
            {description}
          </p>
        )}
        
        {children && <div className="relative z-10">{children}</div>}
      </div>

      {/* 3D立体效果边框 */}
      <div className="absolute inset-0 border-2 border-white/50 rounded-3xl pointer-events-none"></div>

      {/* Add ripple animation keyframes via style tag */}
      <style jsx>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 0.3;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
