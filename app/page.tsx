'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Zap, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { LANGUAGES, getDailyStarter, getDefaultLevel } from '@/lib/languages';
import { getLanguageSettings, getMessages } from '@/lib/storage';

const LANG_ORDER = ['spanish', 'french', 'korean', 'chinese', 'english'] as const;

function timeAgo(ms: number): string {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HomePage() {
  const daily = getDailyStarter();
  const [langData, setLangData] = useState<Record<string, { level: string; lastActive?: number; msgCount: number; preview: string }>>({});

  useEffect(() => {
    const data: typeof langData = {};
    for (const code of LANG_ORDER) {
      const lang = LANGUAGES[code];
      const settings = getLanguageSettings(code);
      const messages = getMessages(code);
      const lastUser = messages.filter(m => m.role === 'user').slice(-1)[0];
      const lastAI = messages.filter(m => m.role === 'assistant').slice(-1)[0];

      data[code] = {
        level: settings.level || getDefaultLevel(lang.levelSystem),
        lastActive: settings.lastChatAt,
        msgCount: settings.messageCount || 0,
        preview: lastAI?.content?.slice(0, 60) || lang.lastMessage,
      };
    }
    setLangData(data);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "still up? same 👀" :
    hour < 12 ? "good morning!" :
    hour < 17 ? "hey there 👋" :
    hour < 21 ? "evening 🌆" : "night owl? 🌙";

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        {/* Header */}
        <div
          className="px-5 pt-14 pb-5"
          style={{ background: 'white', borderBottom: '1px solid #F0EEF8' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{greeting}</p>
              <h1 className="text-2xl font-bold leading-tight" style={{ color: '#1A1A2E' }}>
                Your AI Friends
              </h1>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                <Search size={16} style={{ color: '#6B7280' }} />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center relative">
                <Bell size={16} style={{ color: '#6B7280' }} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Topic Card */}
        <div className="px-5 pt-5 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
            Today's conversation starter
          </p>
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)' }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{daily.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {daily.topic}
                </p>
                <p className="text-white font-medium text-sm leading-relaxed">
                  "{daily.hook}"
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Pick a language to answer this →
              </p>
              <Zap size={14} fill="#FFE566" style={{ color: '#FFE566' }} />
            </div>
          </div>
        </div>

        {/* Quick language picker for daily */}
        <div className="px-5 mb-5">
          <div className="flex gap-2 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
            {LANG_ORDER.map((code) => {
              const lang = LANGUAGES[code];
              return (
                <Link
                  key={code}
                  href={`/chat/${code}?starter=${encodeURIComponent(daily.hook)}`}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl"
                  style={{ background: lang.bgColor }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-xs font-semibold" style={{ color: '#1A1A2E' }}>{lang.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Language Chat List */}
        <div className="px-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
            Your chats
          </p>
          <div className="flex flex-col">
            {LANG_ORDER.map((code, i) => {
              const lang = LANGUAGES[code];
              const data = langData[code];
              const isLastItem = i === LANG_ORDER.length - 1;

              return (
                <Link key={code} href={`/chat/${code}`}>
                  <div
                    className="flex items-center gap-4 py-4"
                    style={{ borderBottom: isLastItem ? 'none' : '1px solid #F8F7FF' }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: lang.bgColor }}
                      >
                        {lang.flag}
                      </div>
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
                        style={{ background: '#4ADE80' }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: '#1A1A2E' }}>
                            {lang.aiName}
                          </span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: lang.bgColor, color: '#1A1A2E' }}
                          >
                            {data?.level || getDefaultLevel(lang.levelSystem)}
                          </span>
                        </div>
                        <span className="text-[10px]" style={{ color: '#C4C4C4' }}>
                          {data?.lastActive ? timeAgo(data.lastActive) : 'never'}
                        </span>
                      </div>
                      <p className="text-xs leading-snug truncate" style={{ color: '#9CA3AF' }}>
                        {data?.preview || lang.lastMessage}
                      </p>
                    </div>

                    {/* Unread / chevron */}
                    <div className="flex-shrink-0 flex items-center">
                      {!data?.lastActive ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ background: lang.color === '#FFE566' ? '#D4A800' : lang.color }}
                        >
                          N
                        </div>
                      ) : (
                        <ChevronRight size={14} style={{ color: '#D1D5DB' }} />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="px-5 py-6 text-center">
          <p className="text-xs" style={{ color: '#C4C4C4' }}>
            tap a language to start chatting • all conversations saved locally
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
