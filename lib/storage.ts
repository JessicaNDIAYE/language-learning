'use client';

import type { LanguageCode } from './languages';
import type { VibeLevel } from './prompts';

export type { VibeLevel };

export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LanguageSettings {
  level: string;
  lastChatAt?: number;
  messageCount: number;
  vibeLevel?: VibeLevel;
  languageMode?: 'immersive' | 'mixed';
}

export interface UserMemory {
  name?: string;
  favoriteTopics: string[];
  commonMistakes: string[];
  languages: Partial<Record<LanguageCode, LanguageSettings>>;
}

const KEYS = {
  messages: (lang: string) => `lingua_msgs_${lang}`,
  settings: (lang: string) => `lingua_settings_${lang}`,
  memory: 'lingua_memory',
  lastLang: 'lingua_last_lang',
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export function getMessages(language: string): StoredMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.messages(language));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMessages(language: string, messages: StoredMessage[]) {
  if (typeof window === 'undefined') return;
  // Keep last 60 messages to avoid storage bloat
  const trimmed = messages.slice(-60);
  localStorage.setItem(KEYS.messages(language), JSON.stringify(trimmed));
}

export function clearMessages(language: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.messages(language));
}

// ─── Language Settings ────────────────────────────────────────────────────────

export function getLanguageSettings(language: string): LanguageSettings {
  if (typeof window === 'undefined') return { level: '', messageCount: 0 };
  try {
    const raw = localStorage.getItem(KEYS.settings(language));
    return raw ? JSON.parse(raw) : { level: '', messageCount: 0 };
  } catch {
    return { level: '', messageCount: 0 };
  }
}

export function saveLanguageSettings(language: string, settings: Partial<LanguageSettings>) {
  if (typeof window === 'undefined') return;
  const current = getLanguageSettings(language);
  localStorage.setItem(KEYS.settings(language), JSON.stringify({ ...current, ...settings }));
}

// ─── User Memory ──────────────────────────────────────────────────────────────

export function getUserMemory(): UserMemory {
  if (typeof window === 'undefined') return { favoriteTopics: [], commonMistakes: [], languages: {} };
  try {
    const raw = localStorage.getItem(KEYS.memory);
    return raw ? JSON.parse(raw) : { favoriteTopics: [], commonMistakes: [], languages: {} };
  } catch {
    return { favoriteTopics: [], commonMistakes: [], languages: {} };
  }
}

export function saveUserMemory(memory: Partial<UserMemory>) {
  if (typeof window === 'undefined') return;
  const current = getUserMemory();
  localStorage.setItem(KEYS.memory, JSON.stringify({ ...current, ...memory }));
}

// ─── Last language ─────────────────────────────────────────────────────────────

export function getLastLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.lastLang);
}

export function setLastLanguage(lang: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.lastLang, lang);
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return true; // SSR: assume complete to avoid flash
  return localStorage.getItem('lingua_onboarding') === 'done';
}

export function completeOnboarding(language: string, levelCode: string, reason: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lingua_onboarding', 'done');
  localStorage.setItem('lingua_primary', language);
  localStorage.setItem('lingua_reason', reason);
  void levelCode; // caller will call saveLanguageSettings separately
}

// ─── Primary Language ─────────────────────────────────────────────────────────

export function getPrimaryLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lingua_primary');
}

export function setPrimaryLanguage(language: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lingua_primary', language);
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getStreak(): StreakData {
  if (typeof window === 'undefined') return { count: 0, lastDate: '' };
  try {
    const raw = localStorage.getItem('lingua_streak');
    return raw ? JSON.parse(raw) : { count: 0, lastDate: '' };
  } catch {
    return { count: 0, lastDate: '' };
  }
}

export function updateStreak(): StreakData {
  if (typeof window === 'undefined') return { count: 0, lastDate: '' };
  const today = todayStr();
  const streak = getStreak();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
  const updated: StreakData = { count: newCount, lastDate: today };
  localStorage.setItem('lingua_streak', JSON.stringify(updated));
  return updated;
}

// ─── Daily Goal ───────────────────────────────────────────────────────────────

export interface DailyData {
  date: string;
  messagesSent: number;
  goal: number;
}

export function getDailyData(): DailyData {
  if (typeof window === 'undefined') return { date: '', messagesSent: 0, goal: 5 };
  try {
    const raw = localStorage.getItem('lingua_daily');
    const data: DailyData = raw ? JSON.parse(raw) : { date: '', messagesSent: 0, goal: 5 };
    if (data.date !== todayStr()) return { date: todayStr(), messagesSent: 0, goal: 5 };
    return data;
  } catch {
    return { date: todayStr(), messagesSent: 0, goal: 5 };
  }
}

export function incrementDailyMessages(): DailyData {
  if (typeof window === 'undefined') return { date: '', messagesSent: 0, goal: 5 };
  const data = getDailyData();
  const updated: DailyData = { ...data, date: todayStr(), messagesSent: data.messagesSent + 1 };
  localStorage.setItem('lingua_daily', JSON.stringify(updated));
  return updated;
}

// ─── Memory summary for AI ────────────────────────────────────────────────────

export function buildMemorySummary(language: string): string | null {
  const memory = getUserMemory();
  const settings = getLanguageSettings(language);
  const messages = getMessages(language);

  const parts: string[] = [];

  if (memory.name) parts.push(`User's name: ${memory.name}`);
  if (settings.messageCount > 0) parts.push(`You've had ${settings.messageCount} exchanges with them before`);
  if (memory.favoriteTopics.length > 0) parts.push(`Topics they enjoy: ${memory.favoriteTopics.join(', ')}`);
  if (memory.commonMistakes.length > 0) parts.push(`Mistakes they often make: ${memory.commonMistakes.join(', ')}`);

  // Extract some context from recent messages
  if (messages.length > 5) {
    const recentTopics = messages
      .filter(m => m.role === 'user')
      .slice(-5)
      .map(m => m.content.slice(0, 50))
      .join(' | ');
    parts.push(`Recent conversation context: ${recentTopics}`);
  }

  return parts.length > 0 ? parts.join('\n') : null;
}
