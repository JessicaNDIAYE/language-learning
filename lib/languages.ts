export type LanguageCode = 'chinese' | 'korean' | 'spanish' | 'french' | 'english';
export type LevelSystem = 'HSK' | 'TOPIK' | 'CEFR';

export interface LevelInfo {
  code: string;
  label: string;
  description: string;
  canDo: string;
  vocabulary: string;
}

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  bgColor: string;
  levelSystem: LevelSystem;
  levels: LevelInfo[];
  aiName: string;
  aiPersona: string;
  greeting: string;
  lastMessage: string; // shown on home screen as preview
}

export interface RoleplayScenario {
  id: string;
  emoji: string;
  title: string;
  context: string;
  aiRole: string;
  userRole: string;
}

export interface DailyStarter {
  emoji: string;
  topic: string;
  hook: string; // the actual opening question
}

// ─── Level Systems ──────────────────────────────────────────────────────────

export const HSK_LEVELS: LevelInfo[] = [
  { code: 'HSK1', label: 'HSK 1', description: 'Absolute beginner', canDo: 'Greet people, say your name, count to 10', vocabulary: '150 words' },
  { code: 'HSK2', label: 'HSK 2', description: 'Elementary', canDo: 'Talk about daily routines, family, food', vocabulary: '300 words' },
  { code: 'HSK3', label: 'HSK 3', description: 'Pre-intermediate', canDo: 'Handle most travel situations, express opinions', vocabulary: '600 words' },
  { code: 'HSK4', label: 'HSK 4', description: 'Intermediate', canDo: 'Discuss a wide range of topics fluently', vocabulary: '1,200 words' },
  { code: 'HSK5', label: 'HSK 5', description: 'Upper-intermediate', canDo: 'Read newspapers, give presentations', vocabulary: '2,500 words' },
  { code: 'HSK6', label: 'HSK 6', description: 'Advanced/Native-like', canDo: 'Fully natural conversation, idioms, culture', vocabulary: '5,000+ words' },
];

export const TOPIK_LEVELS: LevelInfo[] = [
  { code: 'TOPIK1', label: 'TOPIK I (1)', description: 'Survival Korean', canDo: 'Self-introduction, simple requests, numbers', vocabulary: '800 words' },
  { code: 'TOPIK2', label: 'TOPIK I (2)', description: 'Basic daily life', canDo: 'Everyday conversations, shopping, transportation', vocabulary: '1,500 words' },
  { code: 'TOPIK3', label: 'TOPIK II (3)', description: 'Intermediate', canDo: 'Express feelings, opinions, handle most situations', vocabulary: '3,000 words' },
  { code: 'TOPIK4', label: 'TOPIK II (4)', description: 'Upper-intermediate', canDo: 'Discuss social and cultural topics', vocabulary: '5,000 words' },
  { code: 'TOPIK5', label: 'TOPIK II (5)', description: 'Advanced', canDo: 'Professional topics, formal writing, debates', vocabulary: '8,000 words' },
  { code: 'TOPIK6', label: 'TOPIK II (6)', description: 'Near-native fluency', canDo: 'Fully natural Korean, all registers, culture', vocabulary: '10,000+ words' },
];

export const CEFR_LEVELS: LevelInfo[] = [
  { code: 'A1', label: 'A1 – Beginner', description: 'Absolute beginner', canDo: 'Introduce yourself, ask simple questions, understand slow speech', vocabulary: '500 words' },
  { code: 'A2', label: 'A2 – Elementary', description: 'Elementary', canDo: 'Routine tasks, immediate environment, short conversations', vocabulary: '1,000 words' },
  { code: 'B1', label: 'B1 – Intermediate', description: 'Intermediate', canDo: 'Travel, express opinions, describe experiences', vocabulary: '2,000 words' },
  { code: 'B2', label: 'B2 – Upper-intermediate', description: 'Upper-intermediate', canDo: 'Complex texts, fluent with native speakers, argue a point', vocabulary: '4,000 words' },
  { code: 'C1', label: 'C1 – Advanced', description: 'Advanced', canDo: 'Fluent, flexible, precise, professional use', vocabulary: '8,000 words' },
  { code: 'C2', label: 'C2 – Mastery', description: 'Mastery/Native-like', canDo: 'Everything — humor, nuance, culture, literature', vocabulary: '16,000+ words' },
];

// ─── Languages ───────────────────────────────────────────────────────────────

export const LANGUAGES: Record<LanguageCode, Language> = {
  chinese: {
    code: 'chinese',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    color: '#C2410C',
    bgColor: '#FFF7ED',
    levelSystem: 'HSK',
    levels: HSK_LEVELS,
    aiName: '小明',
    aiPersona: 'A funny Shanghainese friend who loves bubble tea and pretending to be dramatic',
    greeting: '你好！',
    lastMessage: "ok spill — what do you actually want to learn first 👀",
  },
  korean: {
    code: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    color: '#BE185D',
    bgColor: '#FDF2F8',
    levelSystem: 'TOPIK',
    levels: TOPIK_LEVELS,
    aiName: '지민',
    aiPersona: 'A witty Seoul friend obsessed with K-drama and street food who judges your pronunciation lovingly',
    greeting: '안녕!',
    lastMessage: "we're NOT starting with formal speech. trust me on this 😤",
  },
  spanish: {
    code: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    color: '#B45309',
    bgColor: '#FEF3C7',
    levelSystem: 'CEFR',
    levels: CEFR_LEVELS,
    aiName: 'Mía',
    aiPersona: 'A sarcastic Madrid girl who will drag you into conversations about food and then somehow you\'ll learn Spanish',
    greeting: '¡Hola!',
    lastMessage: "so... did you actually try saying hola to someone today or nah 🙄",
  },
  french: {
    code: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    color: '#1D4ED8',
    bgColor: '#EFF6FF',
    levelSystem: 'CEFR',
    levels: CEFR_LEVELS,
    aiName: 'Théo',
    aiPersona: 'A witty Parisian who sighs dramatically at bad accents but secretly loves helping',
    greeting: 'Salut !',
    lastMessage: "bon, tu es là. on commence par quelque chose d'important 🥐",
  },
  english: {
    code: 'english',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    color: '#B8F5D0',
    bgColor: '#E8FFF4',
    levelSystem: 'CEFR',
    levels: CEFR_LEVELS,
    aiName: 'Sam',
    aiPersona: 'A casual British-American mix who talks too fast and uses too much slang but makes it work',
    greeting: 'Hey!',
    lastMessage: "right so what do you actually wanna talk about, no pressure 😄",
  },
};

// ─── Roleplay Scenarios ───────────────────────────────────────────────────────

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'restaurant',
    emoji: '🍽️',
    title: 'Restaurant',
    context: 'User is at a local restaurant, ordering food and dealing with the menu.',
    aiRole: 'a waiter/waitress who is slightly impatient but helpful',
    userRole: 'a hungry customer trying to order',
  },
  {
    id: 'airport',
    emoji: '✈️',
    title: 'Airport',
    context: 'User is at the airport, checking in, going through security, asking for help.',
    aiRole: 'an airport staff member at the check-in counter',
    userRole: 'a traveler who needs assistance',
  },
  {
    id: 'hotel',
    emoji: '🏨',
    title: 'Hotel Check-In',
    context: 'User is checking into a hotel, asking about facilities, dealing with issues.',
    aiRole: 'a hotel receptionist who is professionally friendly',
    userRole: 'a guest checking in',
  },
  {
    id: 'friends',
    emoji: '🤝',
    title: 'Meeting Friends',
    context: 'User is meeting new people at a social event, introducing themselves, making small talk.',
    aiRole: 'a friendly local at a social gathering',
    userRole: 'a newcomer meeting people',
  },
  {
    id: 'interview',
    emoji: '💼',
    title: 'Job Interview',
    context: 'User is in a job interview, answering questions about themselves and their experience.',
    aiRole: 'an interviewer at a tech company',
    userRole: 'a candidate being interviewed',
  },
  {
    id: 'market',
    emoji: '🛒',
    title: 'Street Market',
    context: 'User is shopping at a local market, negotiating prices, asking about products.',
    aiRole: 'a market vendor selling local products',
    userRole: 'a shopper browsing the market',
  },
  {
    id: 'taxi',
    emoji: '🚕',
    title: 'Taking a Taxi',
    context: 'User is in a taxi, giving directions, making conversation with the driver.',
    aiRole: 'a chatty taxi driver',
    userRole: 'a passenger',
  },
  {
    id: 'party',
    emoji: '🎉',
    title: 'At a Party',
    context: 'User is at a house party, mingling, telling stories, being social.',
    aiRole: 'an outgoing local at a party',
    userRole: 'a guest at the party',
  },
];

// ─── Daily Starters ───────────────────────────────────────────────────────────

export const DAILY_STARTERS: DailyStarter[] = [
  { emoji: '🍜', topic: 'Food confession', hook: "okay real talk — what's the most embarrassing thing you've eaten alone at 2am" },
  { emoji: '✈️', topic: 'Dream trip', hook: "if money didn't exist and you had to leave tomorrow, where are you going" },
  { emoji: '😭', topic: 'Awkward moment', hook: "tell me your most painfully awkward moment. mine involves an elevator and a very loud sneeze" },
  { emoji: '🎵', topic: 'Music mood', hook: "what song are you on repeat right now and why does it say too much about you" },
  { emoji: '📱', topic: 'Phone habit', hook: "what app do you always say you'll delete but absolutely never will" },
  { emoji: '🌙', topic: 'Night owl', hook: "it's midnight. you can't sleep. what are you actually doing" },
  { emoji: '🎬', topic: 'Movie take', hook: "give me your most controversial movie opinion. go." },
  { emoji: '🤔', topic: 'Unpopular opinion', hook: "what's something everyone loves that you genuinely do not understand the hype for" },
  { emoji: '🏙️', topic: 'City vibes', hook: "describe your city in 3 words but make them a little mean" },
  { emoji: '💭', topic: 'Random thought', hook: "what's a thought that randomly hits you in the shower that you've never told anyone" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getLanguage = (code: string): Language =>
  LANGUAGES[code as LanguageCode] || LANGUAGES.spanish;

export const getLevels = (system: LevelSystem): LevelInfo[] => {
  if (system === 'HSK') return HSK_LEVELS;
  if (system === 'TOPIK') return TOPIK_LEVELS;
  return CEFR_LEVELS;
};

export const getLevelInfo = (system: LevelSystem, code: string): LevelInfo => {
  const levels = getLevels(system);
  return levels.find(l => l.code === code) || levels[0];
};

export const getDefaultLevel = (system: LevelSystem): string => {
  if (system === 'HSK') return 'HSK1';
  if (system === 'TOPIK') return 'TOPIK1';
  return 'A1';
};

export const getDailyStarter = (): DailyStarter => {
  const dayOfYear = Math.floor(Date.now() / 86400000) % DAILY_STARTERS.length;
  return DAILY_STARTERS[dayOfYear];
};
