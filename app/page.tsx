'use client';

import Link from 'next/link';
import { Bell, Search, Flame, Zap, BookOpen, MessageCircle, Trophy, TrendingUp, ChevronRight, Star } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ProgressRing from '@/components/ProgressRing';
import { LANGUAGES, getUserStats, getLanguageProgress } from '@/lib/languages';

const userName = 'Alex';

export default function HomePage() {
  const stats = getUserStats();
  const progress = getLanguageProgress();
  const languages = Object.values(LANGUAGES);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        {/* Header */}
        <div className="px-5 pt-14 pb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>{greeting} 👋</p>
            <h1 className="text-2xl font-bold mt-0.5" style={{ color: '#1A1A2E' }}>
              Hello, {userName}!
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Search size={18} style={{ color: '#6B7280' }} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
              <Bell size={18} style={{ color: '#6B7280' }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="px-5 mb-5">
          <div className="card p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Flame size={18} className="pulse-flame" style={{ color: '#FF6B35' }} />
                  <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{stats.streak}</span>
                </div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Day Streak</span>
              </div>
              <div className="w-px h-10" style={{ background: '#F0EEF8' }} />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Zap size={18} style={{ color: '#FFE566', fill: '#FFE566' }} />
                  <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{stats.totalXP.toLocaleString()}</span>
                </div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Total XP</span>
              </div>
              <div className="w-px h-10" style={{ background: '#F0EEF8' }} />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={18} style={{ color: '#4ADE80' }} />
                  <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{stats.wordsLearned}</span>
                </div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Words</span>
              </div>
              <div className="w-px h-10" style={{ background: '#F0EEF8' }} />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={18} style={{ color: '#C9B8FF' }} />
                  <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{stats.minutesToday}m</span>
                </div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="px-5 mb-5">
          <div
            className="rounded-3xl p-5 flex items-center gap-5"
            style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)' }}
          >
            <ProgressRing
              progress={Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}
              size={72}
              strokeWidth={7}
              color="#FFE566"
              bgColor="rgba(255,229,102,0.2)"
            >
              <span className="text-sm font-bold text-white">
                {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
              </span>
            </ProgressRing>
            <div className="flex-1">
              <p className="text-white font-bold text-lg leading-tight">Weekly Goal</p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {stats.weeklyProgress} / {stats.weeklyGoal} minutes
              </p>
              <div className="mt-2 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%`,
                    background: '#FFE566',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Your Languages */}
        <div className="px-5 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>Your Languages</h2>
            <Link href="/learn" className="text-sm font-medium" style={{ color: '#C9B8FF' }}>
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {languages.map((lang) => {
              const prog = progress[lang.code];
              return (
                <Link key={lang.code} href={`/learn/${lang.code}`} className="block">
                  <div className="card p-4 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: lang.bgColor }}
                    >
                      {lang.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-base" style={{ color: '#1A1A2E' }}>{lang.name}</span>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: lang.bgColor,
                            color: lang.code === 'spanish' ? '#8B7300' : lang.color,
                          }}
                        >
                          {prog.level}
                        </span>
                      </div>
                      <div className="h-2 rounded-full mb-1" style={{ background: '#F0EEF8' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${prog.progress}%`, background: lang.color }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>{prog.progress}% complete</span>
                        <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
                          ⚡ {prog.xp} XP
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: '#D1D5DB', flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mb-5">
          <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A2E' }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/chat/spanish">
              <div className="rounded-3xl p-4 h-28 flex flex-col justify-between" style={{ background: '#C9B8FF' }}>
                <MessageCircle size={24} style={{ color: '#1A1A2E' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>AI Conversation</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(26,26,46,0.6)' }}>Practice speaking</p>
                </div>
              </div>
            </Link>
            <Link href="/learn/korean">
              <div className="rounded-3xl p-4 h-28 flex flex-col justify-between" style={{ background: '#FFE566' }}>
                <BookOpen size={24} style={{ color: '#1A1A2E' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>Daily Lesson</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(26,26,46,0.6)' }}>Continue Korean</p>
                </div>
              </div>
            </Link>
            <Link href="/progress">
              <div className="rounded-3xl p-4 h-28 flex flex-col justify-between" style={{ background: '#B8F5D0' }}>
                <Trophy size={24} style={{ color: '#1A1A2E' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>Achievements</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(26,26,46,0.6)' }}>3 new badges</p>
                </div>
              </div>
            </Link>
            <Link href="/learn/chinese">
              <div className="rounded-3xl p-4 h-28 flex flex-col justify-between" style={{ background: '#FFB5C8' }}>
                <Star size={24} style={{ color: '#1A1A2E' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>Word of Day</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(26,26,46,0.6)' }}>Learn Chinese</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Daily Phrase */}
        <div className="px-5 mb-5">
          <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A2E' }}>Phrase of the Day</h2>
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(135deg, #FFB5C8 0%, #C9B8FF 100%)' }}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/30 text-white">🇰🇷 Korean</span>
              <span className="text-2xl">🌸</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">감사합니다</p>
            <p className="text-white/80 text-sm mb-2">Gamsahamnida</p>
            <p className="text-white font-semibold text-lg">Thank you</p>
            <p className="text-white/70 text-xs mt-2">도움 주셔서 감사합니다 – Thank you for your help</p>
            <Link
              href="/chat/korean"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
            >
              Practice this <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
