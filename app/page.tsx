'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import AIAvatar from '@/components/AIAvatar';
import LanguageFlag from '@/components/LanguageFlag';
import { LANGUAGES, getDailyStarter, getDefaultLevel, type LanguageCode } from '@/lib/languages';
import {
  getLanguageSettings, getMessages,
  getPrimaryLanguage, getStreak, getDailyData, isOnboardingComplete, updateStreak,
  type StreakData, type DailyData,
} from '@/lib/storage';

const LANG_ORDER: LanguageCode[] = ['spanish', 'french', 'korean', 'chinese', 'japanese', 'dutch', 'thai', 'english'];

function timeAgo(ms: number): string {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HomePage() {
  const router = useRouter();
  const [daily, setDaily] = useState(() => getDailyStarter());
  const [greeting, setGreeting] = useState('hey there');
  const [langData, setLangData] = useState<Record<string, { level: string; lastActive?: number; msgCount: number; preview: string }>>({});
  const [primaryLang, setPrimaryLang] = useState<string | null>(null);
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastDate: '' });
  const [dailyData, setDailyData] = useState<DailyData>({ date: '', messagesSent: 0, goal: 5 });

  useEffect(() => {
    // First-launch redirect
    if (!isOnboardingComplete()) {
      router.replace('/onboarding');
      return;
    }
    updateStreak();

    const hour = new Date().getHours();
    setGreeting(
      hour < 5  ? 'still up? same' :
      hour < 12 ? 'good morning!' :
      hour < 17 ? 'hey there' :
      hour < 21 ? 'good evening' : 'night owl?'
    );
    setDaily(getDailyStarter());

    setPrimaryLang(getPrimaryLanguage());
    setStreak(getStreak());
    setDailyData(getDailyData());

    const data: typeof langData = {};
    for (const code of LANG_ORDER) {
      const lang = LANGUAGES[code];
      const settings = getLanguageSettings(code);
      const messages = getMessages(code);
      const lastAI = messages.filter(m => m.role === 'assistant').slice(-1)[0];
      data[code] = {
        level: settings.level || getDefaultLevel(lang.levelSystem),
        lastActive: settings.lastChatAt,
        msgCount: settings.messageCount || 0,
        preview: lastAI?.content?.slice(0, 60) || lang.lastMessage,
      };
    }
    setLangData(data);
  }, [router]);

  return (
    <div className="mobile-shell" style={{ background: '#F0EDE8' }}>
      <div className="screen-content">
        {/* Header */}
        <div className="pt-14 pb-4 px-5 bg-transparent">
          <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{greeting}</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold leading-tight" style={{ color: '#1C1917' }}>
              Your AI Friends
            </h1>
            {streak.count > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                🔥 {streak.count}
              </span>
            )}
          </div>
        </div>

        {/* Daily Starter Card */}
        <div
          className="mx-5 mb-5 p-5 rounded-3xl"
          style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          {/* Topic pill + emoji */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: '#F0EDE8' }}
            >
              <span className="text-sm">{daily.emoji}</span>
              <span className="text-xs font-semibold" style={{ color: '#78716C' }}>{daily.topic}</span>
            </div>
          </div>

          {/* Hook text */}
          <p className="text-sm font-medium leading-relaxed mb-3" style={{ color: '#1C1917' }}>
            &ldquo;{daily.hook}&rdquo;
          </p>

          {/* Language chips */}
          <p className="text-[10px] mb-2" style={{ color: '#9CA3AF' }}>talk about it in &rarr;</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {LANG_ORDER.map((code) => {
              const lang = LANGUAGES[code];
              return (
                <Link
                  key={code}
                  href={`/chat/${code}?starter=${encodeURIComponent(daily.hook)}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{ background: lang.bgColor }}
                >
                  <div className="w-4 h-[10px] overflow-hidden rounded-sm flex-shrink-0">
                    <LanguageFlag language={code} />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: lang.color }}>{lang.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chat List */}
        <div className="px-5">
          {/* Daily goal progress */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400">Objectif du jour</span>
            <div className="flex gap-1">
              {Array.from({ length: dailyData.goal }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: i < dailyData.messagesSent ? '#F97316' : '#E5E7EB' }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
            your chats
          </p>
          <div className="flex flex-col">
            {(primaryLang ? [primaryLang as LanguageCode, ...LANG_ORDER.filter(c => c !== primaryLang)] : LANG_ORDER).map((code) => {
              const lang = LANGUAGES[code];
              const data = langData[code];
              const isPrimary = code === primaryLang;

              return (
                <Link key={code} href={`/chat/${code}`}>
                  <div
                    className="flex items-center gap-3 p-3.5 rounded-2xl mb-3 relative"
                    style={{
                      background: 'white',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                      borderLeft: isPrimary ? `3px solid ${lang.color}` : undefined,
                    }}
                  >
                    {/* Primary badge */}
                    {isPrimary && (
                      <span
                        className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: lang.bgColor, color: lang.color }}
                      >
                        ⭐ Principal
                      </span>
                    )}
                    {/* Avatar zone */}
                    <div className="relative flex-shrink-0">
                      <div className={`${isPrimary ? 'w-[72px] h-[72px]' : 'w-16 h-16'} rounded-2xl overflow-hidden`}>
                        <AIAvatar language={code} />
                      </div>
                      {/* Flag badge */}
                      <div
                        className="absolute overflow-hidden"
                        style={{
                          bottom: -4,
                          right: -4,
                          width: 28,
                          height: 18,
                          borderRadius: 3,
                          border: '2px solid white',
                        }}
                      >
                        <LanguageFlag language={code} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: name + time */}
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-sm" style={{ color: '#1C1917' }}>
                          {lang.aiName}
                        </span>
                        <span className="text-[10px]" style={{ color: '#D1D5DB' }}>
                          {data?.lastActive ? timeAgo(data.lastActive) : 'never'}
                        </span>
                      </div>
                      {/* Row 2: language name + level badge */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{lang.name}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: lang.bgColor, color: lang.color }}
                        >
                          {data?.level || getDefaultLevel(lang.levelSystem)}
                        </span>
                      </div>
                      {/* Preview */}
                      <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>
                        {data?.preview || lang.lastMessage}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronRight size={14} style={{ color: '#E5E7EB', flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="px-5 py-6 text-center">
          <p className="text-xs" style={{ color: '#C4C4C4' }}>
            tap a language to start chatting &bull; all conversations saved locally
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
