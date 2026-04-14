'use client';

import Link from 'next/link';
import { Theater, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { LANGUAGES, ROLEPLAY_SCENARIOS } from '@/lib/languages';

const LANG_ORDER = ['spanish', 'french', 'korean', 'chinese', 'english'] as const;

const SCENARIO_COLORS = [
  '#FFE566', '#C9B8FF', '#FFB5C8', '#B8F5D0', '#B8E4FF',
  '#FFB89A', '#FFE566', '#C9B8FF',
];

export default function RoleplayPage() {
  return (
    <div className="mobile-shell">
      <div className="screen-content">
        {/* Header */}
        <div className="px-5 pt-14 pb-5" style={{ background: 'white', borderBottom: '1px solid #F0EEF8' }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: '#EDE9FF' }}>
              <Theater size={18} style={{ color: '#C9B8FF' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Roleplay</h1>
          </div>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Practice real-world situations with your AI friend. No judgment, infinite tries.
          </p>
        </div>

        {/* How it works */}
        <div className="px-5 pt-5 mb-5">
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)' }}
          >
            <p className="text-white font-bold mb-3">How it works</p>
            <div className="flex flex-col gap-2.5">
              {[
                { n: '1', t: 'Pick a scenario', d: 'Choose from 8 real-life situations' },
                { n: '2', t: 'Pick a language', d: 'Your AI friend adapts to your level' },
                { n: '3', t: 'Just chat', d: 'No scripts, no scores — pure conversation' },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: '#FFE566', color: '#1A1A2E' }}>
                    {s.n}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{s.t}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div className="px-5 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#9CA3AF' }}>
            Choose a situation
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ROLEPLAY_SCENARIOS.map((scenario, i) => (
              <div key={scenario.id} className="flex flex-col gap-2.5">
                <div
                  className="rounded-3xl p-4 flex flex-col gap-3"
                  style={{ background: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }}
                >
                  <span className="text-3xl">{scenario.emoji}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{scenario.title}</p>
                    <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'rgba(26,26,46,0.6)' }}>
                      {scenario.userRole}
                    </p>
                  </div>

                  {/* Language quick-pick */}
                  <div className="flex gap-1.5 flex-wrap">
                    {LANG_ORDER.slice(0, 3).map(code => (
                      <Link
                        key={code}
                        href={`/chat/${code}?scenario=${scenario.id}`}
                        className="flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold"
                        style={{ background: 'rgba(255,255,255,0.5)', color: '#1A1A2E' }}
                      >
                        {LANGUAGES[code].flag}
                      </Link>
                    ))}
                    <Link
                      href={`/chat/spanish?scenario=${scenario.id}`}
                      className="px-2 py-1 rounded-xl text-[10px] font-bold"
                      style={{ background: 'rgba(26,26,46,0.12)', color: '#1A1A2E' }}
                    >
                      +2
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All languages for roleplay */}
        <div className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
            All languages
          </p>
          <div className="flex gap-2 flex-wrap">
            {LANG_ORDER.map(code => {
              const lang = LANGUAGES[code];
              return (
                <Link key={code} href={`/chat/${code}`}>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                    style={{ background: lang.bgColor }}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-xs font-bold" style={{ color: '#1A1A2E' }}>{lang.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
