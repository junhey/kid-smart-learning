/**
 * BottomNav Component - Fixed Navigation Bar with Sliding Pill Indicator
 * 
 * Features:
 * - Smooth sliding pill that animates between active tabs (layoutId)
 * - Bounce animation on active icon
 * - Large tap targets (min 48x48px) for child-friendly interaction
 * - Haptic-style press feedback (scale down on tap)
 * - Accessible labels and roles
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItemProps {
  href: string;
  icon: string;
  activeIcon: string;
  label: string;
  active: boolean;
  index: number;
}

function NavItem({ href, icon, activeIcon, label, active, index }: NavItemProps) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/50"
      aria-label={`${label}${active ? '（当前页面）' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {/* Sliding pill background */}
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 rounded-2xl border border-purple-200/40 shadow-md shadow-purple-200/30"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}

      {/* Icon + Label */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-0.5"
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <motion.span
          className="text-2xl leading-none"
          animate={active ? {
            scale: [1, 1.25, 1],
            y: [0, -2, 0],
          } : { scale: 1, y: 0 }}
          transition={active ? {
            duration: 0.4,
            ease: "easeOut",
          } : { duration: 0.2 }}
          aria-hidden="true"
        >
          {active ? activeIcon : icon}
        </motion.span>
        <motion.span
          className={`text-[10px] font-bold leading-tight ${
            active ? 'text-purple-700' : 'text-gray-400'
          }`}
          animate={{ 
            opacity: 1,
            fontWeight: active ? 800 : 600,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>

      {/* Active dot indicator */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
            className="absolute -bottom-0.5 w-1 h-1 bg-purple-500 rounded-full"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </Link>
  );
}

const navItems = [
  { href: '/', icon: '🏠', activeIcon: '🏡', label: '首页' },
  { href: '/english', icon: '📖', activeIcon: '📚', label: '英语' },
  { href: '/math', icon: '🔢', activeIcon: '🧮', label: '数学' },
  { href: '/achievements', icon: '⭐', activeIcon: '🌟', label: '成就' },
];

export function BottomNav() {
  const pathname = usePathname();

  // Determine which tab is active (support sub-routes)
  const getActiveIndex = () => {
    if (pathname === '/') return 0;
    if (pathname.startsWith('/english')) return 1;
    if (pathname.startsWith('/math')) return 2;
    if (pathname.startsWith('/achievements')) return 3;
    return -1;
  };

  const activeIndex = getActiveIndex();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-white/95 backdrop-blur-lg
        border-t border-gray-100/80
        flex justify-around items-center
        h-[72px] px-3
        shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
        z-50
        safe-area-pb
      "
      role="navigation"
      aria-label="主导航"
    >
      {navItems.map((item, index) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          activeIcon={item.activeIcon}
          label={item.label}
          active={activeIndex === index}
          index={index}
        />
      ))}
    </nav>
  );
}
