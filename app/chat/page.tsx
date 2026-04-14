'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { LANGUAGES, getDefaultLevel, type LanguageCode } from '@/lib/languages';
import { getLanguageSettings } from '@/lib/storage';

const LANG_ORDER: LanguageCode[] = ['spanish', 'french', 'korean', 'chinese', 'english'];

export default function ChatPickerPage() {
  const [levels, setLevels] = useState<Record<string, string>>({});

  useEffect(() => {
    const result: Record<string, string> = {};
    for (const code of LANG_ORDER) {
      const settings = getLanguageSettings(code);
      result[code] = settings.level || getDefaultLevel(LANGUAGES[code].levelSystem);
    }
    setLevels(result);
  }, []);

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        <div className="px-5 pt-14 pb-4" style={{ background: 'white', borderBottom: '1px solid #F0EEF8' }}>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Start chatting</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Pick your AI friend to talk to</p>
        </div>

        <div className="px-5 pt-5 flex flex-col gap-3">
          {LANG_ORDER.map((code) => {
            const lang = LANGUAGES[code];
            const level = levels[code] || getDefaultLevel(lang.levelSystem);

            return (
              <Link key={code} href={`/chat/${code}`}>
                <div className="rounded-3xl p-4 flex items-center gap-4" style={{ background: lang.bgColor }}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.5)' }}
                  >
                    {lang.flag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold" style={{ color: '#1A1A2E' }}>{lang.aiName}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.5)', color: '#1A1A2E' }}
                      >
                        {level}
                      </span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'rgba(26,26,46,0.7)' }}>
                      {lang.name} · {lang.nativeName}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(26,26,46,0.5)' }}>
                      {lang.aiPersona}
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(26,26,46,0.12)' }}
                  >
                    <MessageCircle size={16} style={{ color: '#1A1A2E' }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
