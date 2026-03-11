/**
 * GameCard Component - Duolingo Style Card
 */

interface GameCardProps {
  title: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function GameCard({
  title,
  description,
  icon,
  onClick,
  className = '',
  children,
}: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-3xl
        p-6
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
        hover:scale-[1.02]
        transition-all duration-300 ease-out
        border-2 border-gray-100
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {icon && (
        <div className="text-5xl mb-4 text-center">
          {icon}
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-[#3C3C3C] text-center mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-[#777777] text-center mb-4">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}
