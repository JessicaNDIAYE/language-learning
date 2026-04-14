'use client';

import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ProgressRing from '@/components/ProgressRing';
import { LANGUAGES, getLanguageProgress } from '@/lib/languages';

export default function LearnPage() {
  const progress = getLanguageProgress();
  const languages = Object.values(LANGUAGES);

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        <div className="px-5 pt-14 pb-4">
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Choose a Language</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Pick a language to continue learning</p>
        </div>

        <div className="px-5 flex flex-col gap-4">
          {languages.map((lang) => {
            const prog = progress[lang.code];
            return (
              <Link key={lang.code} href={`/learn/${lang.code}`}>
                <div
                  className="rounded-3xl p-5 flex items-center gap-4"
                  style={{ background: lang.bgColor }}
                >
                  <div className="text-4xl">{lang.flag}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>{lang.name}</span>
                      <span className="text-sm font-medium" style={{ color: 'rgba(26,26,46,0.5)' }}>{lang.nativeName}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'rgba(26,26,46,0.6)' }}>{prog.level} · {prog.xp} XP</p>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(26,26,46,0.12)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${prog.progress}%`, background: '#1A1A2E' }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'rgba(26,26,46,0.5)' }}>{prog.progress}% complete</p>
                  </div>
                  <ProgressRing
                    progress={prog.progress}
                    size={52}
                    strokeWidth={5}
                    color="#1A1A2E"
                    bgColor="rgba(26,26,46,0.12)"
                  >
                    <span className="text-xs font-bold" style={{ color: '#1A1A2E' }}>{prog.progress}%</span>
                  </ProgressRing>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Tips section */}
        <div className="px-5 mt-6">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#B8E4FF' }}>
              <BookOpen size={20} style={{ color: '#1A1A2E' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>Learning tip</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Practice 15 minutes daily for 3x faster progress</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
