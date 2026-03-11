/**
 * BottomNav Component - Fixed Navigation Bar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link href={href}>
      <motion.div
        className={`
          flex flex-col items-center gap-1 py-2 px-4 rounded-2xl
          transition-all duration-200
          ${active 
            ? 'text-[#58CC02] bg-[#D7FFB8]' 
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          className="text-3xl"
          animate={active ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
        <span className="text-xs font-bold">{label}</span>
      </motion.div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="
      fixed bottom-0 left-0 right-0
      bg-white border-t-2 border-gray-100
      flex justify-around items-center
      h-20 px-4
      shadow-[0_-4px_12px_rgba(0,0,0,0.08)]
      z-50
    ">
      <NavItem 
        href="/" 
        icon="🏠" 
        label="首页" 
        active={pathname === '/'} 
      />
      <NavItem 
        href="/english" 
        icon="📚" 
        label="英语" 
        active={pathname === '/english'} 
      />
      <NavItem 
        href="/math" 
        icon="🔢" 
        label="数学" 
        active={pathname === '/math'} 
      />
      <NavItem 
        href="/achievements" 
        icon="⭐" 
        label="成就" 
        active={pathname === '/achievements'} 
      />
    </nav>
  );
}
