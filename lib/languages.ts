export type LanguageCode = 'korean' | 'chinese' | 'spanish';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  bgColor: string;
  gradient: string;
  greeting: string;
  levels: Level[];
  topics: Topic[];
  dailyPhrases: DailyPhrase[];
}

export interface Level {
  id: string;
  name: string;
  description: string;
  lessonCount: number;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  wordCount: number;
}

export interface DailyPhrase {
  original: string;
  romanization?: string;
  translation: string;
  example: string;
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  korean: {
    code: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    color: '#C9B8FF',
    bgColor: '#EDE9FF',
    gradient: 'from-purple-200 to-purple-100',
    greeting: '안녕하세요!',
    levels: [
      { id: 'beginner', name: 'Beginner', description: 'Hangul, greetings & basics', lessonCount: 20 },
      { id: 'elementary', name: 'Elementary', description: 'Daily conversations', lessonCount: 30 },
      { id: 'intermediate', name: 'Intermediate', description: 'Complex sentences', lessonCount: 40 },
      { id: 'advanced', name: 'Advanced', description: 'Fluency & culture', lessonCount: 35 },
    ],
    topics: [
      { id: 'greetings', name: 'Greetings', icon: '👋', description: 'Hello, goodbye, introductions', wordCount: 45 },
      { id: 'food', name: 'Food & Drink', icon: '🍜', description: 'Korean cuisine vocabulary', wordCount: 80 },
      { id: 'kpop', name: 'K-Pop & Culture', icon: '🎵', description: 'Music, TV shows, trends', wordCount: 60 },
      { id: 'travel', name: 'Travel', icon: '✈️', description: 'Getting around Korea', wordCount: 70 },
      { id: 'numbers', name: 'Numbers', icon: '🔢', description: 'Counting & telling time', wordCount: 40 },
      { id: 'emotions', name: 'Emotions', icon: '💭', description: 'Expressing feelings', wordCount: 55 },
    ],
    dailyPhrases: [
      { original: '감사합니다', romanization: 'Gamsahamnida', translation: 'Thank you', example: '도움 주셔서 감사합니다 (Thank you for your help)' },
      { original: '어디에 있어요?', romanization: 'Eodie isseoyo?', translation: 'Where is it?', example: '화장실이 어디에 있어요? (Where is the bathroom?)' },
      { original: '얼마예요?', romanization: 'Eolmayeyo?', translation: 'How much is it?', example: '이거 얼마예요? (How much is this?)' },
    ],
  },
  chinese: {
    code: 'chinese',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    color: '#FFB5C8',
    bgColor: '#FFE8EF',
    gradient: 'from-pink-200 to-pink-100',
    greeting: '你好！',
    levels: [
      { id: 'beginner', name: 'Beginner', description: 'Pinyin, tones & basics', lessonCount: 25 },
      { id: 'elementary', name: 'Elementary', description: 'Daily conversations', lessonCount: 35 },
      { id: 'intermediate', name: 'Intermediate', description: 'Characters & grammar', lessonCount: 45 },
      { id: 'advanced', name: 'Advanced', description: 'Business & literature', lessonCount: 40 },
    ],
    topics: [
      { id: 'tones', name: 'Tones & Pinyin', icon: '🎶', description: 'Master the 4 tones', wordCount: 50 },
      { id: 'food', name: 'Food & Dining', icon: '🥢', description: 'Chinese cuisine & restaurants', wordCount: 90 },
      { id: 'business', name: 'Business', icon: '💼', description: 'Professional vocabulary', wordCount: 75 },
      { id: 'travel', name: 'Travel', icon: '🏮', description: 'Exploring China', wordCount: 65 },
      { id: 'characters', name: 'Characters', icon: '✍️', description: 'Learn to write Hanzi', wordCount: 100 },
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧', description: 'Family & relationships', wordCount: 50 },
    ],
    dailyPhrases: [
      { original: '谢谢', romanization: 'Xièxie', translation: 'Thank you', example: '非常谢谢你 (Thank you very much)' },
      { original: '多少钱？', romanization: 'Duōshao qián?', translation: 'How much?', example: '这个多少钱？(How much is this?)' },
      { original: '你好吗？', romanization: 'Nǐ hǎo ma?', translation: 'How are you?', example: '你最近好吗？(How have you been lately?)' },
    ],
  },
  spanish: {
    code: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    color: '#FFE566',
    bgColor: '#FFFAE0',
    gradient: 'from-yellow-200 to-yellow-100',
    greeting: '¡Hola!',
    levels: [
      { id: 'beginner', name: 'Beginner', description: 'Alphabet, greetings & basics', lessonCount: 18 },
      { id: 'elementary', name: 'Elementary', description: 'Daily life conversations', lessonCount: 28 },
      { id: 'intermediate', name: 'Intermediate', description: 'Verb tenses & grammar', lessonCount: 38 },
      { id: 'advanced', name: 'Advanced', description: 'Fluency & idioms', lessonCount: 30 },
    ],
    topics: [
      { id: 'greetings', name: 'Greetings', icon: '¡', description: 'Hola, Buenos días & more', wordCount: 40 },
      { id: 'food', name: 'Food & Tapas', icon: '🥘', description: 'Spanish cuisine vocabulary', wordCount: 85 },
      { id: 'travel', name: 'Travel', icon: '🌍', description: 'Navigating Spanish cities', wordCount: 70 },
      { id: 'verbs', name: 'Verb Conjugation', icon: '📝', description: 'Master Spanish verbs', wordCount: 120 },
      { id: 'culture', name: 'Culture', icon: '💃', description: 'Flamenco, fiestas & more', wordCount: 60 },
      { id: 'numbers', name: 'Numbers & Time', icon: '🕐', description: 'Numbers, dates & time', wordCount: 45 },
    ],
    dailyPhrases: [
      { original: '¿Cómo estás?', translation: 'How are you?', example: '¡Buenos días! ¿Cómo estás? (Good morning! How are you?)' },
      { original: '¿Cuánto cuesta?', translation: 'How much does it cost?', example: '¿Cuánto cuesta este libro? (How much does this book cost?)' },
      { original: '¿Dónde está...?', translation: 'Where is...?', example: '¿Dónde está el baño? (Where is the bathroom?)' },
    ],
  },
};

export const getLanguage = (code: string): Language => {
  return LANGUAGES[code as LanguageCode] || LANGUAGES.spanish;
};

export const getUserStats = () => ({
  streak: 12,
  totalXP: 2450,
  wordsLearned: 347,
  minutesToday: 23,
  level: 'Intermediate',
  weeklyGoal: 70,
  weeklyProgress: 52,
});

export const getLanguageProgress = () => ({
  korean: { level: 'Elementary', progress: 42, xp: 820, streak: 7 },
  chinese: { level: 'Beginner', progress: 28, xp: 540, streak: 3 },
  spanish: { level: 'Intermediate', progress: 65, xp: 1090, streak: 12 },
});
