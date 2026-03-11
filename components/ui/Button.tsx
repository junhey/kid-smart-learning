/**
 * Button Component - Duolingo Style 3D Buttons
 */

import { colors, shadows, borderRadius, transitions } from '@/lib/design-tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-bold rounded-2xl
    transition-all duration-200
    active:translate-y-1
    disabled:opacity-50 disabled:cursor-not-allowed
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
    `,
    secondary: `
      bg-white
      border-2 border-[${colors.border.medium}]
      text-[${colors.text.primary}]
      hover:bg-[${colors.background.subtle}]
      active:border-b-0 active:border-t-2
    `,
    danger: `
      bg-gradient-to-b from-[${colors.status.wrong}] to-[#E03E3E]
      border-b-4 border-[#C92A2A]
      text-white
      hover:brightness-110
      active:border-b-0
      shadow-lg
    `,
    success: `
      bg-gradient-to-b from-[${colors.accent.blue}] to-[#1899D6]
      border-b-4 border-[#1577B0]
      text-white
      hover:brightness-110
      active:border-b-0
      shadow-lg
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
