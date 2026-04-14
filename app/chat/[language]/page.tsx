'use client';

import { use, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Send, RotateCcw, ChevronDown, Sparkles,
  BookOpen, Volume2, Copy, Check, Info
} from 'lucide-react';
import { getLanguage } from '@/lib/languages';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PageProps {
  params: Promise<{ language: string }>;
}

const QUICK_REPLIES: Record<string, string[]> = {
  korean: ['안녕하세요!', '잘 모르겠어요', '다시 말해주세요', '고마워요!', '어떻게 써요?'],
  chinese: ['你好！', '我不明白', '请再说一遍', '谢谢！', '怎么写？'],
  spanish: ['¡Hola!', 'No entiendo', 'Repite por favor', '¡Gracias!', '¿Cómo se escribe?'],
};

const LEVEL_OPTIONS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];

const INITIAL_MESSAGES: Record<string, string> = {
  korean: `안녕하세요! 👋 I'm your Korean AI tutor! I'm so excited to help you learn Korean!

Let's start with something fun. How about I teach you how to introduce yourself in Korean?

You can say: **저는 [your name]이에요/예요** (Jeoneun [name]ieyo/yeyo) — "I am [name]"

What's your name? Try introducing yourself in Korean! 😊🇰🇷`,
  chinese: `你好！👋 I'm your Mandarin Chinese AI tutor! I'm thrilled to guide you on your Chinese journey!

Let's start with the most important phrase: **你好** (Nǐ hǎo - tone 3, tone 3) means "Hello"!

Chinese has 4 tones — they change the meaning of words completely! 🎶

Can you tell me a little about yourself? What brings you to learn Chinese? 😊🇨🇳`,
  spanish: `¡Hola! 👋 I'm your Spanish AI tutor — you can call me Profe! I'm so excited to help you learn Spanish!

Spanish is spoken by over 500 million people worldwide — you're joining a huge community! 🌍

Let's start easy. Can you tell me: **¿Cómo te llamas?** (What's your name?)

You can reply: **Me llamo [your name]** (My name is [name]) 😊🇪🇸`,
};

export default function ChatPage({ params }: PageProps) {
  const { language } = use(params);
  const lang = getLanguage(language);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: INITIAL_MESSAGES[language] || INITIAL_MESSAGES.spanish,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState('Beginner');
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          language,
          level: level.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response stream');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.text }
                      : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection issue. Please check your API key and try again.');
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: INITIAL_MESSAGES[language] || INITIAL_MESSAGES.spanish,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderMessageContent = (content: string) => {
    // Bold text with **
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const quickReplies = QUICK_REPLIES[language] || QUICK_REPLIES.spanish;

  return (
    <div className="mobile-shell" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: 'white', borderBottom: '1px solid #F0EEF8', paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
        <Link href={`/learn/${language}`}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F8F7FF' }}>
            <ArrowLeft size={18} style={{ color: '#1A1A2E' }} />
          </div>
        </Link>

        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: lang.bgColor }}
        >
          {lang.flag}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight" style={{ color: '#1A1A2E' }}>
            {lang.name} AI Tutor
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Always available · Infinite practice</p>
          </div>
        </div>

        {/* Level Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLevelPicker(!showLevelPicker)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: lang.bgColor, color: '#1A1A2E' }}
          >
            {level} <ChevronDown size={12} />
          </button>
          {showLevelPicker && (
            <div
              className="absolute right-0 top-9 rounded-2xl overflow-hidden shadow-lg z-10 min-w-[130px]"
              style={{ background: 'white', border: '1px solid #F0EEF8' }}
            >
              {LEVEL_OPTIONS.map(l => (
                <button
                  key={l}
                  onClick={() => { setLevel(l); setShowLevelPicker(false); }}
                  className="w-full px-4 py-2.5 text-xs font-medium text-left hover:bg-gray-50"
                  style={{
                    color: l === level ? lang.color === '#FFE566' ? '#8B7300' : lang.color : '#1A1A2E',
                    fontWeight: l === level ? 700 : 500,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={resetConversation}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F8F7FF' }}>
            <RotateCcw size={16} style={{ color: '#6B7280' }} />
          </div>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ background: '#F8F7FF' }}
      >
        {/* Info banner */}
        <div
          className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2 text-xs"
          style={{ background: lang.bgColor }}
        >
          <Info size={14} style={{ color: '#1A1A2E', flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: 'rgba(26,26,46,0.7)' }}>
            Practice {lang.name} infinitely! Your AI tutor will correct mistakes, teach vocabulary, and have real conversations with you.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {message.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1"
                  style={{ background: lang.bgColor }}
                >
                  {lang.flag}
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[78%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                {message.content === '' && message.role === 'assistant' ? (
                  <div className="chat-bubble-ai px-4 py-3">
                    <div className="flex gap-1.5 items-center h-5">
                      <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#C9B8FF' }} />
                      <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#C9B8FF' }} />
                      <div className="typing-dot w-2 h-2 rounded-full" style={{ background: '#C9B8FF' }} />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                    }`}
                    style={{ color: message.role === 'user' ? '#1A1A2E' : '#1A1A2E' }}
                  >
                    {renderMessageContent(message.content)}
                  </div>
                )}

                {message.content && (
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs" style={{ color: '#C4C4C4' }}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => copyMessage(message.id, message.content)}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                    >
                      {copiedId === message.id ? (
                        <Check size={12} style={{ color: '#4ADE80' }} />
                      ) : (
                        <Copy size={12} style={{ color: '#9CA3AF' }} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 rounded-2xl text-xs" style={{ background: '#FFE4E6', color: '#E11D48' }}>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div
        className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0"
        style={{ background: 'white', borderTop: '1px solid #F0EEF8', scrollbarWidth: 'none' }}
      >
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => sendMessage(reply)}
            disabled={isLoading}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
            style={{ background: lang.bgColor, color: '#1A1A2E', opacity: isLoading ? 0.5 : 1 }}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{
          background: 'white',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div
            className="flex-1 rounded-2xl px-4 py-3 flex items-end gap-2"
            style={{ background: '#F8F7FF', border: '1.5px solid #E8E6F0' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Write in ${lang.name} or English...`}
              className="flex-1 bg-transparent text-sm outline-none resize-none"
              style={{ color: '#1A1A2E', maxHeight: '100px', minHeight: '20px' }}
              rows={1}
              disabled={isLoading}
            />
            <Sparkles size={16} style={{ color: lang.color === '#FFE566' ? '#D4A800' : lang.color, flexShrink: 0, marginBottom: 2 }} />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-opacity"
            style={{
              background: input.trim() && !isLoading ? '#1A1A2E' : '#E5E7EB',
              opacity: input.trim() && !isLoading ? 1 : 0.6,
            }}
          >
            <Send size={18} style={{ color: input.trim() && !isLoading ? 'white' : '#9CA3AF' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
