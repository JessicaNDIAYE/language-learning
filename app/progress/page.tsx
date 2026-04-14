'use client';

import Link from 'next/link';
import { Trophy, Flame, Zap, BookOpen, MessageCircle, TrendingUp, Calendar, Star, Award } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ProgressRing from '@/components/ProgressRing';
import { LANGUAGES, getUserStats, getLanguageProgress } from '@/lib/languages';

const ACHIEVEMENTS = [
  { id: 1, icon: '🔥', title: 'Hot Streak', desc: '7-day streak', unlocked: true, color: '#FFE566' },
  { id: 2, icon: '🌸', title: 'Hangul Hero', desc: 'Complete Korean intro', unlocked: true, color: '#C9B8FF' },
  { id: 3, icon: '💬', title: 'Chatterbox', desc: '50 AI conversations', unlocked: true, color: '#B8F5D0' },
  { id: 4, icon: '📚', title: 'Word Wizard', desc: 'Learn 300 words', unlocked: true, color: '#FFB5C8' },
  { id: 5, icon: '🏆', title: 'Trilingual', desc: 'Start all 3 languages', unlocked: false, color: '#B8E4FF' },
  { id: 6, icon: '⚡', title: 'Speed Learner', desc: '30 days in a row', unlocked: false, color: '#FFE566' },
  { id: 7, icon: '🌍', title: 'Globetrotter', desc: 'Reach intermediate', unlocked: false, color: '#B8F5D0' },
  { id: 8, icon: '🎓', title: 'Master', desc: 'Complete one language', unlocked: false, color: '#C9B8FF' },
];

const WEEKLY_ACTIVITY = [
  { day: 'M', minutes: 20, active: true },
  { day: 'T', minutes: 35, active: true },
  { day: 'W', minutes: 15, active: true },
  { day: 'T', minutes: 0, active: false },
  { day: 'F', minutes: 25, active: true },
  { day: 'S', minutes: 40, active: true },
  { day: 'S', minutes: 10, active: true },
];

const MAX_MINUTES = 40;

export default function ProgressPage() {
  const stats = getUserStats();
  const progress = getLanguageProgress();

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Your Progress</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Track your learning journey</p>
        </div>

        {/* Key Stats */}
        <div className="px-5 mb-5">
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Overall Progress</p>
                <p className="text-white text-3xl font-bold">
                  {Math.round((progress.korean.progress + progress.chinese.progress + progress.spanish.progress) / 3)}%
                </p>
              </div>
              <ProgressRing
                progress={Math.round((progress.korean.progress + progress.chinese.progress + progress.spanish.progress) / 3)}
                size={80}
                strokeWidth={7}
                color="#FFE566"
                bgColor="rgba(255,229,102,0.2)"
              >
                <Star size={20} fill="#FFE566" style={{ color: '#FFE566' }} />
              </ProgressRing>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Streak', value: `${stats.streak}d`, icon: '🔥' },
                { label: 'Total XP', value: stats.totalXP.toLocaleString(), icon: '⚡' },
                { label: 'Words', value: stats.wordsLearned, icon: '📖' },
                { label: 'Min/day', value: `${stats.minutesToday}m`, icon: '⏱️' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-base">{s.icon}</p>
                  <p className="text-white font-bold text-sm">{s.value}</p>
                  <p className="text-white/50 text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="px-5 mb-5">
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-base" style={{ color: '#1A1A2E' }}>Weekly Activity</h2>
              <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>This week</span>
            </div>
            <div className="flex justify-between items-end gap-2 h-20">
              {WEEKLY_ACTIVITY.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: 60 }}>
                    <div
                      className="w-full rounded-xl"
                      style={{
                        height: day.minutes > 0 ? `${(day.minutes / MAX_MINUTES) * 100}%` : '8%',
                        background: day.active && day.minutes > 0
                          ? `linear-gradient(180deg, #C9B8FF, #B8E4FF)`
                          : '#F0EEF8',
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: day.active ? '#1A1A2E' : '#9CA3AF' }}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs" style={{ color: '#9CA3AF' }}>
              <span>Total: 145 minutes</span>
              <span>Goal: 175 min</span>
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="px-5 mb-5">
          <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A2E' }}>Languages</h2>
          <div className="flex flex-col gap-3">
            {Object.values(LANGUAGES).map((lang) => {
              const prog = progress[lang.code];
              return (
                <Link key={lang.code} href={`/learn/${lang.code}`}>
                  <div className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{lang.name}</p>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>{prog.level}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{prog.progress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full" style={{ background: '#F0EEF8' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${prog.progress}%`, background: lang.color }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs" style={{ color: '#9CA3AF' }}>
                      <span>⚡ {prog.xp} XP</span>
                      <span>🔥 {prog.streak} day streak</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="px-5 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>Achievements</h2>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>
              {ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: achievement.unlocked ? achievement.color : '#F0EEF8',
                    opacity: achievement.unlocked ? 1 : 0.5,
                  }}
                >
                  {achievement.icon}
                </div>
                <p
                  className="text-[10px] font-medium text-center leading-tight"
                  style={{ color: achievement.unlocked ? '#1A1A2E' : '#9CA3AF' }}
                >
                  {achievement.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
