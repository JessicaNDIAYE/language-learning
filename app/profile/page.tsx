'use client';

import Link from 'next/link';
import { Settings, ChevronRight, Bell, Globe, Moon, HelpCircle, LogOut, Edit3, Shield } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { getUserStats, getLanguageProgress, LANGUAGES } from '@/lib/languages';

interface MenuItem {
  iconEmoji?: string;
  iconComponent?: React.ElementType;
  label: string;
  color: string;
  bg: string;
  badge?: string;
  iconColor?: string;
}

const MENU_SECTIONS: Array<{ title: string; items: MenuItem[] }> = [
  {
    title: 'Learning',
    items: [
      { iconComponent: Globe, label: 'Language preferences', color: '#C9B8FF', bg: '#EDE9FF' },
      { iconComponent: Bell, label: 'Daily reminders', color: '#FFB5C8', bg: '#FFE8EF', badge: 'On' },
      { iconEmoji: '🎯', label: 'Daily goal', color: '#FFE566', bg: '#FFFAE0', badge: '20 min' },
    ],
  },
  {
    title: 'Account',
    items: [
      { iconComponent: Shield, label: 'Privacy & data', color: '#B8F5D0', bg: '#E8FFF4' },
      { iconComponent: HelpCircle, label: 'Help & feedback', color: '#B8E4FF', bg: '#E5F5FF' },
      { iconComponent: Settings, label: 'App settings', color: '#F3F4F6', bg: '#F9FAFB', iconColor: '#6B7280' },
    ],
  },
];

export default function ProfilePage() {
  const stats = getUserStats();
  const progress = getLanguageProgress();

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        {/* Header */}
        <div className="px-5 pt-14 pb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Profile</h1>
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Settings size={18} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-5 mb-5">
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(135deg, #C9B8FF 0%, #FFB5C8 100%)' }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(255,255,255,0.4)' }}
                >
                  🧑‍💻
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: '#1A1A2E' }}
                >
                  <Edit3 size={10} style={{ color: 'white' }} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Alex</h2>
                <p className="text-white/70 text-sm">Language Learner</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/30 text-white">
                    {stats.level}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/30 text-white">
                    🔥 {stats.streak} days
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { value: stats.totalXP.toLocaleString(), label: 'Total XP' },
                { value: stats.wordsLearned, label: 'Words' },
                { value: `${Object.keys(LANGUAGES).length}`, label: 'Languages' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.3)' }}>
                  <p className="text-white font-bold text-lg">{s.value}</p>
                  <p className="text-white/70 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language Progress Summary */}
        <div className="px-5 mb-5">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
            My Languages
          </h2>
          <div className="flex flex-col gap-2">
            {Object.values(LANGUAGES).map((lang) => {
              const prog = progress[lang.code];
              return (
                <Link key={lang.code} href={`/learn/${lang.code}`}>
                  <div className="card p-3 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: lang.bgColor }}
                    >
                      {lang.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{lang.name}</span>
                        <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>{prog.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: '#F0EEF8' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${prog.progress}%`, background: lang.color }}
                        />
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Menu */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="px-5 mb-5">
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              {section.title}
            </h2>
            <div className="card p-0 overflow-hidden">
              {section.items.map((item, i) => {
                const IconComponent = item.iconComponent;
                return (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3.5"
                    style={{ borderBottom: i < section.items.length - 1 ? '1px solid #F0EEF8' : 'none' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: item.bg }}
                    >
                      {item.iconEmoji ? (
                        <span className="text-base">{item.iconEmoji}</span>
                      ) : IconComponent ? (
                        <IconComponent
                          size={18}
                          style={{ color: item.iconColor || item.color }}
                        />
                      ) : null}
                    </div>
                    <span className="flex-1 text-sm font-medium text-left" style={{ color: '#1A1A2E' }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: '#F0EEF8', color: '#6B7280' }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={14} style={{ color: '#D1D5DB' }} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* App info */}
        <div className="px-5 mb-5 text-center">
          <p className="text-xs" style={{ color: '#C4C4C4' }}>LinguaAI v1.0.0</p>
          <p className="text-xs mt-1" style={{ color: '#C4C4C4' }}>
            Powered by Claude AI · Made with ❤️ for language learners
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
