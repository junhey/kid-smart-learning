/**
 * Button Component - Duolingo Style 3D Buttons
 * Enhanced with accessibility (a11y) support
 */

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

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ariaLabel,
  loading = false,
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-bold rounded-2xl
    transition-all duration-200
    active:translate-y-1
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-offset-2
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
      {...props}
    >
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
    </button>
  );
}
