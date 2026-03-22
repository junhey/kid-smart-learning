/**
 * GameCard Component - Duolingo Style Card
 * 使用统一的设计tokens系统
 * Enhanced with keyboard navigation and accessibility
 */

import { KeyboardEvent } from 'react';

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
  // 键盘导航处理
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
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
      onClick={onClick}
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
    </div>
  );
}
