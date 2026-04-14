'use client';

import { use, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, ChevronDown, MoreVertical, Smile,
  Copy, Check, Trash2, Theater, X, ChevronRight
} from 'lucide-react';
import {
  getLanguage, getDefaultLevel, getLevelInfo, getLevels,
  ROLEPLAY_SCENARIOS, type LanguageCode,
} from '@/lib/languages';
import {
  getMessages, saveMessages, getLanguageSettings, saveLanguageSettings,
  buildMemorySummary, setLastLanguage, type StoredMessage,
} from '@/lib/storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PageProps {
  params: Promise<{ language: string }>;
}

function toStoredMessages(msgs: Message[]): StoredMessage[] {
  return msgs.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp.getTime() }));
}

function fromStoredMessages(stored: StoredMessage[]): Message[] {
  return stored.map((m, i) => ({
    id: String(i),
    role: m.role,
    content: m.content,
    timestamp: new Date(m.timestamp),
  }));
}

// Opening messages per language (first visit only)
const OPENERS: Record<string, string[]> = {
  chinese: [
    "ok hi 👋 so you want to learn Chinese huh",
    "bold move honestly. I respect it.",
    "don't worry I won't make you memorize stroke order on day 1 lol",
    "so what brings you here — K-drama? travel? just chaotic energy? 😂",
  ],
  korean: [
    "안녕 👋 I'm 지민, your Korean chaos coordinator",
    "warning: I might slip into ㅋㅋ sometimes at higher levels but we'll get there",
    "so — K-drama got you here? food? just vibes?",
    "tell me something about yourself and we'll figure out where to start 😄",
  ],
  spanish: [
    "¡hola! I'm Mía, your overly opinionated Madrid friend 👋",
    "I will absolutely judge your Spanish. lovingly. but still.",
    "first thing you need to know: tortilla española > tortilla mexicana. this is not a debate.",
    "anyway — what's your deal? why Spanish? 🙄 (I'm genuinely curious tho)",
  ],
  french: [
    "salut ! I'm Théo 👋",
    "yes, I'm Parisian. no, I won't be rude about your accent. probably.",
    "French gets a bad rep for being hard but honestly the grammar is just... chaotic. lovably chaotic.",
    "so — qu'est-ce qui t'amène ici? what brings you here? 😄",
  ],
  english: [
    "hey! I'm Sam 👋",
    "so you want to improve your English — respect, honestly",
    "fair warning: I switch between British and American English randomly and I refuse to apologize for it",
    "right so — what's your deal? where are you from and what do you actually want to talk about? 😄",
  ],
};

export default function ChatPage({ params }: PageProps) {
  const { language } = use(params);
  const searchParams = useSearchParams();
  const lang = getLanguage(language);

  // Load settings from storage
  const savedSettings = typeof window !== 'undefined' ? getLanguageSettings(language) : { level: '', messageCount: 0 };
  const defaultLevel = getDefaultLevel(lang.levelSystem);
  const [levelCode, setLevelCode] = useState(savedSettings.level || defaultLevel);

  // Scenario & UI state
  const [activeScenario, setActiveScenario] = useState<typeof ROLEPLAY_SCENARIOS[0] | null>(null);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showScenarioSheet, setShowScenarioSheet] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize: load history or create opener
  useEffect(() => {
    setLastLanguage(language);
    const stored = getMessages(language);
    const starter = searchParams.get('starter');
    const scenario = searchParams.get('scenario');

    if (scenario) {
      const found = ROLEPLAY_SCENARIOS.find(s => s.id === scenario || s.title.toLowerCase() === scenario.toLowerCase());
      if (found) setActiveScenario(found);
    }

    if (stored.length > 0) {
      setMessages(fromStoredMessages(stored));
    } else {
      // Build opening sequence
      const openers = OPENERS[language] || OPENERS.spanish;
      const openingMsgs: Message[] = openers.map((content, i) => ({
        id: `opener_${i}`,
        role: 'assistant' as const,
        content,
        timestamp: new Date(Date.now() - (openers.length - i) * 1000),
      }));

      // If there's a starter topic from daily
      if (starter) {
        openingMsgs.push({
          id: 'starter',
          role: 'assistant',
          content: `btw I saw you clicked on a topic 👀 here's what I wanna know: ${starter}`,
          timestamp: new Date(),
        });
      }

      setMessages(openingMsgs);
    }
    setInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Save messages whenever they change
  useEffect(() => {
    if (!initialized || messages.length === 0) return;
    saveMessages(language, toStoredMessages(messages));
    saveLanguageSettings(language, {
      level: levelCode,
      lastChatAt: Date.now(),
      messageCount: messages.filter(m => m.role === 'user').length,
    });
  }, [messages, initialized, language, levelCode]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const levelInfo = getLevelInfo(lang.levelSystem, levelCode);
  const allLevels = getLevels(lang.levelSystem);

  // ─── Send message ─────────────────────────────────────────────────────────

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const assistantId = `ai_${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      const memory = buildMemorySummary(language);
      const apiMessages = updatedMessages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          language,
          levelCode,
          scenario: activeScenario
            ? `${activeScenario.title}: ${activeScenario.context} You play: ${activeScenario.aiRole}. User plays: ${activeScenario.userRole}.`
            : null,
          memory,
        }),
      });

      if (!response.ok) {
        // Read the JSON error body and surface it directly
        const errData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No stream');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: m.content + parsed.text } : m
                )
              );
            }
          } catch { /* ignore */ }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Chat error:', msg);
      setError(`⚠️ ${msg}`);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    const openers = OPENERS[language] || OPENERS.spanish;
    const openingMsgs: Message[] = openers.map((content, i) => ({
      id: `opener_${i}`,
      role: 'assistant' as const,
      content,
      timestamp: new Date(Date.now() - (openers.length - i) * 1000),
    }));
    setMessages(openingMsgs);
    setActiveScenario(null);
    setShowMenu(false);
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render markdown-ish bold
  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  // ─── UI ───────────────────────────────────────────────────────────────────

  return (
    <div
      className="mobile-shell"
      style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#F8F7FF' }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 flex items-center gap-3"
        style={{
          background: '#1A1A2E',
          paddingTop: 'max(env(safe-area-inset-top), 44px)',
          paddingBottom: '12px',
        }}
      >
        <Link href="/">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={18} style={{ color: 'white' }} />
          </div>
        </Link>

        {/* Avatar */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: lang.bgColor }}
          >
            {lang.flag}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: '#4ADE80', borderColor: '#1A1A2E' }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-white">{lang.aiName}</p>
            {activeScenario && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                {activeScenario.emoji} roleplay
              </span>
            )}
          </div>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {lang.name} · always online
          </p>
        </div>

        {/* Level badge - tappable */}
        <div className="relative">
          <button
            onClick={() => { setShowLevelPicker(!showLevelPicker); setShowMenu(false); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold"
            style={{ background: lang.bgColor, color: '#1A1A2E' }}
          >
            {levelCode} <ChevronDown size={10} />
          </button>

          {showLevelPicker && (
            <div
              className="absolute right-0 top-10 rounded-2xl overflow-hidden z-20 w-52 shadow-2xl"
              style={{ background: '#1E1E35', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="px-3 pt-3 pb-1">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {lang.levelSystem} Level
                </p>
              </div>
              {allLevels.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLevelCode(l.code);
                    saveLanguageSettings(language, { level: l.code });
                    setShowLevelPicker(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5"
                  style={{ background: l.code === levelCode ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                >
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-white">{l.label}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{l.canDo}</p>
                  </div>
                  {l.code === levelCode && <div className="w-2 h-2 rounded-full" style={{ background: lang.color === '#FFE566' ? '#D4A800' : lang.color }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => { setShowMenu(!showMenu); setShowLevelPicker(false); }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <MoreVertical size={16} style={{ color: 'white' }} />
          </div>
        </button>

        {showMenu && (
          <div
            className="absolute right-4 top-20 rounded-2xl overflow-hidden z-20 w-44 shadow-2xl"
            style={{ background: 'white', border: '1px solid #F0EEF8' }}
          >
            <button
              onClick={() => { setShowScenarioSheet(true); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium"
              style={{ color: '#1A1A2E', borderBottom: '1px solid #F8F7FF' }}
            >
              <Theater size={15} style={{ color: lang.color === '#FFE566' ? '#D4A800' : lang.color }} />
              Roleplay
            </button>
            <button
              onClick={resetChat}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium"
              style={{ color: '#EF4444' }}
            >
              <Trash2 size={15} style={{ color: '#EF4444' }} />
              Reset chat
            </button>
          </div>
        )}
      </div>

      {/* Active Scenario Banner */}
      {activeScenario && (
        <div
          className="flex-shrink-0 px-4 py-2 flex items-center gap-3"
          style={{ background: 'rgba(26,26,46,0.05)', borderBottom: '1px solid #F0EEF8' }}
        >
          <span className="text-lg">{activeScenario.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: '#1A1A2E' }}>{activeScenario.title} Roleplay</p>
            <p className="text-[10px] truncate" style={{ color: '#9CA3AF' }}>You: {activeScenario.userRole}</p>
          </div>
          <button onClick={() => setActiveScenario(null)}>
            <X size={14} style={{ color: '#9CA3AF' }} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        onClick={() => { setShowLevelPicker(false); setShowMenu(false); }}
      >
        {/* Level context hint */}
        <div className="flex justify-center mb-4">
          <div className="px-3 py-1.5 rounded-full text-[10px] font-medium" style={{ background: 'rgba(26,26,46,0.06)', color: '#9CA3AF' }}>
            {levelInfo.label} · {levelInfo.vocabulary} · {levelInfo.canDo}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isStreaming = msg.content === '' && !isUser;
            const showAvatar = !isUser && (idx === 0 || messages[idx - 1]?.role === 'user');

            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
                {/* AI avatar - shown only at start of AI block */}
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: lang.bgColor }}>
                    {lang.flag}
                  </div>
                )}

                <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} max-w-[76%]`}>
                  {isStreaming ? (
                    <div className="chat-bubble-ai px-4 py-3">
                      <div className="flex gap-1.5 items-center h-5">
                        <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#C9B8FF' }} />
                        <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#C9B8FF' }} />
                        <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#C9B8FF' }} />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}
                      style={{ padding: '10px 14px', fontSize: '14px', lineHeight: '1.5' }}
                    >
                      {renderContent(msg.content)}
                    </div>
                  )}

                  {msg.content && (
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px]" style={{ color: '#D1D5DB' }}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button onClick={() => copyMessage(msg.id, msg.content)} className="opacity-40 hover:opacity-80">
                        {copiedId === msg.id
                          ? <Check size={11} style={{ color: '#4ADE80' }} />
                          : <Copy size={11} style={{ color: '#9CA3AF' }} />
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-3 px-4 py-3 rounded-2xl text-xs flex flex-col gap-1" style={{ background: '#FFE4E6', color: '#E11D48' }}>
            <span className="font-bold">Error</span>
            <span style={{ wordBreak: 'break-word' }}>{error}</span>
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="underline mt-1 font-semibold"
              style={{ color: '#C81E3A' }}
            >
              → Check /api/health to diagnose
            </a>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: 'white',
          borderTop: '1px solid #F0EEF8',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
        }}
      >
        <div className="flex items-end gap-2">
          {/* Scenario quick button */}
          <button
            onClick={() => setShowScenarioSheet(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mb-0.5"
            style={{ background: activeScenario ? lang.bgColor : '#F8F7FF' }}
          >
            <Theater size={18} style={{ color: activeScenario ? '#1A1A2E' : '#9CA3AF' }} />
          </button>

          <div
            className="flex-1 rounded-2xl flex items-end gap-2 px-4 py-2.5"
            style={{ background: '#F8F7FF', border: '1.5px solid #EDEAF8', minHeight: 44 }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="say something..."
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none"
              style={{ color: '#1A1A2E', maxHeight: '120px', lineHeight: '1.5' }}
            />
            <Smile size={16} style={{ color: '#C4C4C4', flexShrink: 0, marginBottom: 2 }} />
          </div>

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mb-0.5"
            style={{
              background: input.trim() && !isLoading ? '#1A1A2E' : '#E5E7EB',
              transition: 'background 0.2s',
            }}
          >
            <Send size={16} style={{ color: input.trim() && !isLoading ? 'white' : '#9CA3AF' }} />
          </button>
        </div>
      </div>

      {/* Scenario Sheet */}
      {showScenarioSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ maxWidth: 430, left: '50%', transform: 'translateX(-50%)' }}
          onClick={() => setShowScenarioSheet(false)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div
            className="relative w-full rounded-t-3xl pb-10 pt-5"
            style={{ background: 'white', maxHeight: '70vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 mb-4">
              <div>
                <h2 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>Roleplay Scenarios</h2>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Pick a situation to practice</p>
              </div>
              <button onClick={() => setShowScenarioSheet(false)}>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={14} style={{ color: '#6B7280' }} />
                </div>
              </button>
            </div>

            {activeScenario && (
              <div className="mx-5 mb-4">
                <button
                  onClick={() => { setActiveScenario(null); setShowScenarioSheet(false); }}
                  className="w-full py-2.5 rounded-2xl text-sm font-semibold"
                  style={{ background: '#FFE4E6', color: '#E11D48' }}
                >
                  Exit current roleplay
                </button>
              </div>
            )}

            <div className="px-5 grid grid-cols-2 gap-3">
              {ROLEPLAY_SCENARIOS.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setActiveScenario(scenario);
                    setShowScenarioSheet(false);
                    // Inject a scenario start message
                    const startMsg: Message = {
                      id: `roleplay_${Date.now()}`,
                      role: 'assistant',
                      content: `ok switching to ${scenario.emoji} **${scenario.title}** mode!\n\nI'm playing: ${scenario.aiRole}\nYou're: ${scenario.userRole}\n\nlet's go 👇`,
                      timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, startMsg]);
                  }}
                  className="text-left rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    background: activeScenario?.id === scenario.id ? lang.bgColor : '#F8F7FF',
                    border: activeScenario?.id === scenario.id ? `2px solid ${lang.color}` : '2px solid transparent',
                  }}
                >
                  <span className="text-2xl">{scenario.emoji}</span>
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{scenario.title}</p>
                  <p className="text-[10px] leading-snug" style={{ color: '#9CA3AF' }}>
                    {scenario.userRole}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
