'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, MessageCircle, BarChart2, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 min-w-[60px] py-1"
            >
              <div
                className="p-2 rounded-xl transition-all duration-200"
                style={{
                  background: active ? '#1A1A2E' : 'transparent',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? 'white' : '#9CA3AF' }}
                />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? '#1A1A2E' : '#9CA3AF' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
