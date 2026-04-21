'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AIAvatar from '@/components/AIAvatar';
import LanguageFlag from '@/components/LanguageFlag';
import { LANGUAGES, type LanguageCode } from '@/lib/languages';
import {
  isOnboardingComplete,
  completeOnboarding,
  setPrimaryLanguage,
  saveLanguageSettings,
} from '@/lib/storage';

const LANG_ORDER: LanguageCode[] = ['spanish', 'french', 'korean', 'chinese', 'japanese', 'dutch', 'thai', 'english'];

const LEVELS = [
  { label: 'Zéro', sub: 'Je commence de zéro', icon: '🌱' },
  { label: 'Débutant', sub: 'Je connais quelques mots', icon: '📖' },
  { label: 'Intermédiaire', sub: 'Je me débrouille', icon: '💬' },
  { label: 'Avancé', sub: "Je suis assez à l'aise", icon: '🚀' },
  { label: 'Expert', sub: 'Je veux la perfectionner', icon: '⭐' },
];

const LEVEL_CODES: Record<string, Record<number, string>> = {
  JLPT: { 0: 'N5', 1: 'N4', 2: 'N3', 3: 'N2', 4: 'N1' },
  HSK: { 0: 'HSK1', 1: 'HSK2', 2: 'HSK3', 3: 'HSK4', 4: 'HSK5' },
  TOPIK: { 0: 'TOPIK1', 1: 'TOPIK2', 2: 'TOPIK3', 3: 'TOPIK4', 4: 'TOPIK5' },
  CEFR: { 0: 'A1', 1: 'A2', 2: 'B1', 3: 'B2', 4: 'C1' },
};

const REASONS = [
  { icon: '✈️', label: 'Voyager' },
  { icon: '💼', label: 'Travail' },
  { icon: '🎮', label: 'Fun' },
  { icon: '🎬', label: 'Culture' },
  { icon: '💕', label: 'Mon partenaire' },
  { icon: '🏠', label: "M'installer" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace('/');
    }
  }, [router]);

  const getLevelCode = (): string => {
    if (selectedLanguage === null || selectedLevelIdx === null) return 'A1';
    const lang = LANGUAGES[selectedLanguage];
    return LEVEL_CODES[lang.levelSystem]?.[selectedLevelIdx] ?? 'A1';
  };

  const handleComplete = (reason: string) => {
    if (!selectedLanguage) return;
    const levelCode = getLevelCode();
    completeOnboarding(selectedLanguage, levelCode, reason);
    setPrimaryLanguage(selectedLanguage);
    saveLanguageSettings(selectedLanguage, { level: levelCode });
    router.replace('/chat/' + selectedLanguage);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setTimeout(() => {
      handleComplete(reason);
    }, 400);
  };

  return (
    <div
      className="mobile-shell"
      style={{ background: '#F0EDE8', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingTop: 'max(env(safe-area-inset-top), 60px)', paddingBottom: 32 }}>
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {/* Back button */}
          <div style={{ width: 36 }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'white' }}
              >
                <ArrowLeft size={18} style={{ color: '#1C1917' }} />
              </button>
            )}
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className="rounded-full transition-all"
                style={{
                  width: s === step ? 20 : 8,
                  height: 8,
                  background: s <= step ? '#1C1917' : '#D1D5DB',
                }}
              />
            ))}
          </div>

          <div style={{ width: 36 }} />
        </div>

        {/* Step 1 — Language selection */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C1917' }}>
              Quelle langue tu veux apprendre ?
            </h1>
            <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>Choisis une langue pour commencer</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {LANG_ORDER.map(code => {
                const lang = LANGUAGES[code];
                const isSelected = selectedLanguage === code;
                return (
                  <button
                    key={code}
                    onClick={() => setSelectedLanguage(code)}
                    className="text-left p-4 rounded-2xl transition-all"
                    style={{
                      background: isSelected ? lang.bgColor : 'white',
                      border: isSelected ? `2px solid ${lang.color}` : '2px solid transparent',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="w-[60px] h-[60px] rounded-2xl overflow-hidden mb-2">
                      <AIAvatar language={code} />
                    </div>
                    <p className="font-bold text-sm" style={{ color: '#1C1917' }}>{lang.name}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{lang.nativeName}</p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedLanguage}
              className="w-full py-4 rounded-2xl font-semibold text-sm transition-all"
              style={{
                background: selectedLanguage ? '#1C1917' : '#E5E7EB',
                color: selectedLanguage ? 'white' : '#9CA3AF',
              }}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 2 — Level selection */}
        {step === 2 && selectedLanguage && (
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C1917' }}>
              Quel est ton niveau ?
            </h1>
            <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
              En {LANGUAGES[selectedLanguage].name}
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {LEVELS.map((level, idx) => {
                const isSelected = selectedLevelIdx === idx;
                const lang = LANGUAGES[selectedLanguage];
                const levelCode = LEVEL_CODES[lang.levelSystem]?.[idx] ?? '';
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedLevelIdx(idx)}
                    className="text-left p-4 rounded-2xl transition-all"
                    style={{
                      background: isSelected ? lang.bgColor : 'white',
                      border: isSelected ? `2px solid ${lang.color}` : '2px solid transparent',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm" style={{ color: '#1C1917' }}>{level.label}</p>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>{level.sub}</p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: lang.bgColor, color: lang.color }}
                      >
                        {levelCode}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={selectedLevelIdx === null}
              className="w-full py-4 rounded-2xl font-semibold text-sm transition-all"
              style={{
                background: selectedLevelIdx !== null ? '#1C1917' : '#E5E7EB',
                color: selectedLevelIdx !== null ? 'white' : '#9CA3AF',
              }}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 3 — Reason */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C1917' }}>
              Pourquoi tu apprends ?
            </h1>
            <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>Ta motivation principale</p>

            <div className="grid grid-cols-2 gap-3">
              {REASONS.map(reason => {
                const isSelected = selectedReason === reason.label;
                const lang = selectedLanguage ? LANGUAGES[selectedLanguage] : null;
                return (
                  <button
                    key={reason.label}
                    onClick={() => handleReasonSelect(reason.label)}
                    className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
                    style={{
                      background: isSelected && lang ? lang.bgColor : 'white',
                      border: isSelected && lang ? `2px solid ${lang.color}` : '2px solid transparent',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <span className="text-3xl">{reason.icon}</span>
                    <p className="font-bold text-sm text-center" style={{ color: '#1C1917' }}>{reason.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
