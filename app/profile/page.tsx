'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Edit3, MessageCircle, Flame, Trash2, Info } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import {
  LANGUAGES, getDefaultLevel, getLevels, getLevelInfo,
  type LanguageCode,
} from '@/lib/languages';
import {
  getLanguageSettings, saveLanguageSettings, clearMessages,
  getUserMemory, saveUserMemory, getMessages,
} from '@/lib/storage';

const LANG_ORDER: LanguageCode[] = ['spanish', 'french', 'korean', 'chinese', 'english'];

interface LangStats {
  level: string;
  msgCount: number;
  lastActive?: number;
}

export default function ProfilePage() {
  const [stats, setStats] = useState<Record<string, LangStats>>({});
  const [userName, setUserName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [expandedLang, setExpandedLang] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);

  useEffect(() => {
    const memory = getUserMemory();
    setUserName(memory.name || '');

    const s: Record<string, LangStats> = {};
    for (const code of LANG_ORDER) {
      const settings = getLanguageSettings(code);
      const msgs = getMessages(code);
      s[code] = {
        level: settings.level || getDefaultLevel(LANGUAGES[code].levelSystem),
        msgCount: msgs.filter(m => m.role === 'user').length,
        lastActive: settings.lastChatAt,
      };
    }
    setStats(s);
  }, []);

  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      saveUserMemory({ name: trimmed });
    }
    setEditingName(false);
  };

  const setLevel = (langCode: string, levelCode: string) => {
    saveLanguageSettings(langCode, { level: levelCode });
    setStats(prev => ({ ...prev, [langCode]: { ...prev[langCode], level: levelCode } }));
  };

  const resetChat = (langCode: string) => {
    clearMessages(langCode);
    saveLanguageSettings(langCode, { messageCount: 0, lastChatAt: undefined });
    setStats(prev => ({ ...prev, [langCode]: { ...prev[langCode], msgCount: 0, lastActive: undefined } }));
    setResetConfirm(null);
  };

  const totalMessages = Object.values(stats).reduce((sum, s) => sum + (s.msgCount || 0), 0);
  const activeLangs = Object.values(stats).filter(s => s.msgCount > 0).length;

  return (
    <div className="mobile-shell">
      <div className="screen-content">
        {/* Header */}
        <div className="px-5 pt-14 pb-5" style={{ background: 'white', borderBottom: '1px solid #F0EEF8' }}>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Profile</h1>
        </div>

        {/* User card */}
        <div className="px-5 pt-5 mb-5">
          <div
            className="rounded-3xl p-5"
            style={{ background: 'linear-gradient(135deg, #C9B8FF 0%, #FFB5C8 100%)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.35)' }}>
                🧑‍💻
              </div>
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                      placeholder="your name"
                      className="flex-1 bg-white/30 rounded-xl px-3 py-1.5 text-sm font-bold outline-none placeholder-white/50 text-white"
                    />
                    <button onClick={saveName} className="text-white text-xs font-bold px-3 py-1.5 rounded-xl bg-white/20">
                      save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {userName || 'Your name'}
                    </h2>
                    <button onClick={() => { setEditingName(true); setNameInput(userName); }}>
                      <Edit3 size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    </button>
                  </div>
                )}
                <p className="text-white/60 text-sm">Language learner</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { v: totalMessages, l: 'Messages sent', e: '💬' },
                { v: activeLangs, l: 'Languages active', e: '🌍' },
                { v: LANG_ORDER.length, l: 'Available', e: '🤝' },
              ].map(s => (
                <div key={s.l} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.25)' }}>
                  <p className="text-lg">{s.e}</p>
                  <p className="text-white font-bold text-lg leading-tight">{s.v}</p>
                  <p className="text-white/60 text-[10px] leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Language level managers */}
        <div className="px-5 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
            Manage your languages
          </p>
          <div className="flex flex-col gap-3">
            {LANG_ORDER.map((code) => {
              const lang = LANGUAGES[code];
              const s = stats[code] || { level: getDefaultLevel(lang.levelSystem), msgCount: 0 };
              const levelInfo = getLevelInfo(lang.levelSystem, s.level);
              const allLevels = getLevels(lang.levelSystem);
              const isExpanded = expandedLang === code;

              return (
                <div key={code} className="card p-0 overflow-hidden">
                  {/* Collapsed row */}
                  <button
                    className="w-full p-4 flex items-center gap-3"
                    onClick={() => setExpandedLang(isExpanded ? null : code)}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: lang.bgColor }}>
                      {lang.flag}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{lang.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: lang.bgColor, color: '#1A1A2E' }}>
                          {s.level}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                        {s.msgCount > 0 ? `${s.msgCount} messages sent` : 'Not started yet'}
                        {' · '}{levelInfo.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {s.msgCount > 0 && (
                        <Link
                          href={`/chat/${code}`}
                          onClick={e => e.stopPropagation()}
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: lang.bgColor }}
                        >
                          <MessageCircle size={14} style={{ color: '#1A1A2E' }} />
                        </Link>
                      )}
                      <ChevronRight
                        size={14}
                        style={{
                          color: '#D1D5DB',
                          transform: isExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </div>
                  </button>

                  {/* Expanded: level picker */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #F8F7FF' }}>
                      <div className="px-4 py-3">
                        <p className="text-xs font-semibold mb-3" style={{ color: '#9CA3AF' }}>
                          Your {lang.levelSystem} level
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {allLevels.map(level => (
                            <button
                              key={level.code}
                              onClick={() => setLevel(code, level.code)}
                              className="flex items-center gap-3 p-3 rounded-2xl text-left"
                              style={{
                                background: s.level === level.code ? lang.bgColor : '#F8F7FF',
                                border: s.level === level.code ? `1.5px solid ${lang.color === '#FFE566' ? '#D4A800' : lang.color}` : '1.5px solid transparent',
                              }}
                            >
                              <div className="flex-1">
                                <p className="text-xs font-bold" style={{ color: '#1A1A2E' }}>{level.label}</p>
                                <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{level.canDo}</p>
                              </div>
                              <p className="text-[10px] font-medium flex-shrink-0" style={{ color: '#C4C4C4' }}>
                                {level.vocabulary}
                              </p>
                            </button>
                          ))}
                        </div>

                        {/* Reset chat */}
                        {s.msgCount > 0 && (
                          <div className="mt-3">
                            {resetConfirm === code ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => resetChat(code)}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold"
                                  style={{ background: '#FFE4E6', color: '#E11D48' }}
                                >
                                  Yes, reset {lang.aiName}'s chat
                                </button>
                                <button
                                  onClick={() => setResetConfirm(null)}
                                  className="flex-1 py-2 rounded-xl text-xs font-bold"
                                  style={{ background: '#F8F7FF', color: '#6B7280' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setResetConfirm(code)}
                                className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                                style={{ background: '#F8F7FF', color: '#9CA3AF' }}
                              >
                                <Trash2 size={12} /> Reset {lang.aiName}'s conversation
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info card */}
        <div className="px-5 mb-6">
          <div className="card p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDE9FF' }}>
              <Info size={16} style={{ color: '#C9B8FF' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>All data stays on your device</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9CA3AF' }}>
                Conversations are stored locally in your browser. Only messages you send are processed by Claude AI to generate responses.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <p className="text-xs" style={{ color: '#C4C4C4' }}>
            LinguaAI · Powered by Claude · Made for real conversations
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
