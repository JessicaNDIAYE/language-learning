'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, BookOpen, Volume2, ChevronRight, Lock, CheckCircle2, Play } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ProgressRing from '@/components/ProgressRing';
import { getLanguage, getLanguageProgress, type LanguageCode } from '@/lib/languages';

interface PageProps {
  params: Promise<{ language: string }>;
}

const lessonData = {
  korean: [
    { id: 1, title: 'Hangul Basics', subtitle: 'Learn the Korean alphabet', xp: 50, done: true, icon: '🔤' },
    { id: 2, title: 'Greetings & Introductions', subtitle: '안녕하세요, 저는...', xp: 60, done: true, icon: '👋' },
    { id: 3, title: 'Numbers 1–100', subtitle: 'Counting in Korean', xp: 70, done: true, icon: '🔢' },
    { id: 4, title: 'Daily Phrases', subtitle: 'Essential survival Korean', xp: 80, done: false, icon: '💬', current: true },
    { id: 5, title: 'Food Vocabulary', subtitle: 'Korean cuisine words', xp: 90, done: false, icon: '🍜' },
    { id: 6, title: 'K-Pop Phrases', subtitle: 'Slang from Korean pop culture', xp: 100, done: false, icon: '🎵', locked: true },
    { id: 7, title: 'Verb Endings', subtitle: '-아요/-어요 forms', xp: 110, done: false, icon: '📝', locked: true },
  ],
  chinese: [
    { id: 1, title: 'Pinyin System', subtitle: 'Master Chinese pronunciation', xp: 50, done: true, icon: '🔤' },
    { id: 2, title: 'The 4 Tones', subtitle: 'Rising, falling, dipping, neutral', xp: 60, done: true, icon: '🎶' },
    { id: 3, title: 'Basic Greetings', subtitle: '你好, 谢谢, 再见', xp: 70, done: false, icon: '👋', current: true },
    { id: 4, title: 'Numbers & Money', subtitle: 'Counting and prices', xp: 80, done: false, icon: '💰' },
    { id: 5, title: 'Family Members', subtitle: 'Dad, mom, siblings', xp: 90, done: false, icon: '👨‍👩‍👧', locked: true },
    { id: 6, title: 'Food & Restaurants', subtitle: 'Ordering food in Chinese', xp: 100, done: false, icon: '🥢', locked: true },
  ],
  spanish: [
    { id: 1, title: 'The Alphabet & Sounds', subtitle: 'Pronunciation guide', xp: 40, done: true, icon: '🔤' },
    { id: 2, title: 'Greetings & Farewells', subtitle: 'Hola, Buenos días...', xp: 50, done: true, icon: '👋' },
    { id: 3, title: 'Numbers & Time', subtitle: 'Counting and telling time', xp: 60, done: true, icon: '🕐' },
    { id: 4, title: 'Present Tense Verbs', subtitle: 'Ser, Estar, Tener...', xp: 80, done: true, icon: '📝' },
    { id: 5, title: 'Food & Restaurants', subtitle: 'Order like a local', xp: 90, done: false, icon: '🥘', current: true },
    { id: 6, title: 'Travel Phrases', subtitle: 'Navigating Spanish cities', xp: 100, done: false, icon: '✈️' },
    { id: 7, title: 'Past Tense (Pretérito)', subtitle: 'Talking about the past', xp: 120, done: false, icon: '⏮️', locked: true },
    { id: 8, title: 'Subjunctive Mood', subtitle: 'Wishes and doubts', xp: 150, done: false, icon: '💭', locked: true },
  ],
};

export default function LanguagePage({ params }: PageProps) {
  const { language } = use(params);
  const lang = getLanguage(language);
  const progress = getLanguageProgress();
  const prog = progress[language as LanguageCode] || { level: 'Beginner', progress: 0, xp: 0 };
  const lessons = lessonData[language as keyof typeof lessonData] || lessonData.spanish;

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        {/* Hero Header */}
        <div
          className="px-5 pt-12 pb-6"
          style={{ background: `linear-gradient(180deg, ${lang.bgColor} 0%, #F8F7FF 100%)` }}
        >
          <div className="flex items-center justify-between mb-5">
            <Link href="/learn">
              <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center">
                <ArrowLeft size={20} style={{ color: '#1A1A2E' }} />
              </div>
            </Link>
            <div className="flex gap-2">
              <Link href={`/chat/${language}`}>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/70 text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  <MessageCircle size={14} />
                  <span>Chat</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-5xl">{lang.flag}</div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{lang.name}</h1>
              <p className="text-sm font-medium" style={{ color: 'rgba(26,26,46,0.6)' }}>
                {lang.nativeName} · {prog.level}
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <p className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{prog.progress}%</p>
              <p className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>Complete</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <p className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{prog.xp}</p>
              <p className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>XP earned</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <p className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
                {lessons.filter(l => l.done).length}/{lessons.length}
              </p>
              <p className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>Lessons</p>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="px-5 mt-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>Topics</h2>
            <span className="text-sm font-medium" style={{ color: '#9CA3AF' }}>{lang.topics.length} topics</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {lang.topics.map((topic) => (
              <Link key={topic.id} href={`/chat/${language}?topic=${topic.id}`}>
                <div
                  className="flex-shrink-0 rounded-2xl p-3 flex flex-col gap-1 w-28 text-center"
                  style={{ background: lang.bgColor }}
                >
                  <span className="text-2xl">{topic.icon}</span>
                  <p className="text-xs font-bold leading-tight" style={{ color: '#1A1A2E' }}>{topic.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>{topic.wordCount} words</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Lessons */}
        <div className="px-5 mb-4">
          <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A2E' }}>Lessons</h2>
          <div className="flex flex-col gap-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="card p-4 flex items-center gap-4"
                style={{ opacity: lesson.locked ? 0.6 : 1 }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: lesson.done
                      ? '#B8F5D0'
                      : lesson.current
                      ? lang.color
                      : lesson.locked
                      ? '#F3F4F6'
                      : lang.bgColor,
                  }}
                >
                  {lesson.locked ? (
                    <Lock size={18} style={{ color: '#9CA3AF' }} />
                  ) : lesson.done ? (
                    <CheckCircle2 size={20} style={{ color: '#16A34A' }} />
                  ) : (
                    <span>{lesson.icon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{lesson.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{lesson.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#FFE566', color: '#8B7300' }}
                  >
                    +{lesson.xp} XP
                  </span>
                  {lesson.current && !lesson.locked && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: '#1A1A2E' }}
                    >
                      <Play size={12} fill="white" style={{ color: 'white' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 mb-5">
          <Link href={`/chat/${language}`}>
            <div
              className="rounded-3xl p-5 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)' }}
            >
              <div>
                <p className="text-white font-bold text-base">Practice with AI</p>
                <p className="text-white/60 text-xs mt-0.5">Have a real conversation in {lang.name}</p>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: lang.color }}
              >
                <MessageCircle size={22} style={{ color: '#1A1A2E' }} />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
