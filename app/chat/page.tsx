'use client';

import Link from 'next/link';
import { MessageCircle, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { LANGUAGES } from '@/lib/languages';

const conversationStarters = [
  { emoji: '☕', text: 'Order coffee at a cafe', level: 'Beginner' },
  { emoji: '🛒', text: 'Go grocery shopping', level: 'Beginner' },
  { emoji: '🏨', text: 'Check into a hotel', level: 'Elementary' },
  { emoji: '👔', text: 'Job interview practice', level: 'Intermediate' },
  { emoji: '📺', text: 'Discuss favorite shows', level: 'Elementary' },
  { emoji: '🌍', text: 'Plan a trip together', level: 'Intermediate' },
];

export default function ChatPage() {
  const languages = Object.values(LANGUAGES);

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>AI Conversations</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Practice with your personal AI tutor</p>
        </div>

        {/* Language Selection */}
        <div className="px-5 mb-6">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
            Choose language
          </h2>
          <div className="flex flex-col gap-3">
            {languages.map((lang) => (
              <Link key={lang.code} href={`/chat/${lang.code}`}>
                <div
                  className="rounded-3xl p-4 flex items-center gap-4"
                  style={{ background: lang.bgColor }}
                >
                  <div className="text-3xl">{lang.flag}</div>
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: '#1A1A2E' }}>{lang.name}</p>
                    <p className="text-sm" style={{ color: 'rgba(26,26,46,0.55)' }}>
                      {lang.greeting} · Chat with AI tutor
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: '#1A1A2E' }}
                  >
                    <MessageCircle size={16} style={{ color: 'white' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scenario starters */}
        <div className="px-5 mb-5">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
            Practice scenarios
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {conversationStarters.map((s, i) => (
              <Link key={i} href={`/chat/spanish?scenario=${encodeURIComponent(s.text)}`}>
                <div className="card p-3 flex flex-col gap-2 h-24">
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="text-xs font-semibold leading-tight" style={{ color: '#1A1A2E' }}>{s.text}</p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full self-start"
                    style={{ background: '#F0EEF8', color: '#9CA3AF' }}
                  >
                    {s.level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
