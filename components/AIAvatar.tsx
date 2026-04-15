export default function AIAvatar({ language }: { language: string }) {
  switch (language) {
    case 'spanish':
      // Mía: red background, dark brown wavy long hair, olive skin, bold eyebrows, gold hoop earring
      return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="100" height="100" fill="#E84040"/>
          {/* Wavy long hair - flows wide on sides and down */}
          <ellipse cx="50" cy="30" rx="30" ry="28" fill="#3B1F0A"/>
          {/* Left wavy hair flow */}
          <path d="M22 30 Q16 45 18 65 Q20 75 24 80 Q20 75 21 60 Q19 45 24 32" fill="#3B1F0A"/>
          {/* Right wavy hair flow */}
          <path d="M78 30 Q84 45 82 65 Q80 75 76 80 Q80 75 79 60 Q81 45 76 32" fill="#3B1F0A"/>
          {/* Hair wavy bottom */}
          <path d="M22 42 Q26 50 22 58 Q26 65 22 72 Q26 78 23 84" stroke="#3B1F0A" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M78 42 Q74 50 78 58 Q74 65 78 72 Q74 78 77 84" stroke="#3B1F0A" strokeWidth="8" fill="none" strokeLinecap="round"/>
          {/* Face oval */}
          <ellipse cx="50" cy="58" rx="20" ry="24" fill="#C88060"/>
          {/* Bold eyebrows */}
          <path d="M36 46 Q41 43 46 45" stroke="#3B1F0A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M54 45 Q59 43 64 46" stroke="#3B1F0A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* Eyes */}
          <ellipse cx="41" cy="52" rx="4" ry="3.5" fill="#3B1F0A"/>
          <ellipse cx="59" cy="52" rx="4" ry="3.5" fill="#3B1F0A"/>
          <circle cx="42.5" cy="50.5" r="1.2" fill="white"/>
          <circle cx="60.5" cy="50.5" r="1.2" fill="white"/>
          {/* Nose hint */}
          <path d="M50 58 Q48 62 50 64 Q52 62 50 58" fill="none" stroke="#A06040" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Mouth */}
          <path d="M43 70 Q50 75 57 70" stroke="#8B3A2A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Gold hoop earring */}
          <circle cx="29" cy="60" r="3.5" fill="none" stroke="#F0C040" strokeWidth="2"/>
        </svg>
      );

    case 'french':
      // Théo: blue background, light brown swept hair, light skin, one eyebrow raised
      return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="100" height="100" fill="#2A54E8"/>
          {/* Light brown hair swept to one side */}
          <ellipse cx="50" cy="28" rx="26" ry="22" fill="#8B6530"/>
          {/* Swept portion to left side */}
          <path d="M24 26 Q20 20 28 16 Q38 10 50 12 Q35 14 28 22 Q24 26 26 32" fill="#8B6530"/>
          {/* Hair sweep detail */}
          <path d="M24 22 Q28 16 40 14" stroke="#7A5820" strokeWidth="3" fill="none" strokeLinecap="round"/>
          {/* Face oval */}
          <ellipse cx="50" cy="58" rx="20" ry="24" fill="#FDDBB4"/>
          {/* Right eyebrow normal */}
          <path d="M54 47 Q59 45 64 46" stroke="#8B6530" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Left eyebrow slightly raised (ironic) */}
          <path d="M36 45 Q41 41 46 44" stroke="#8B6530" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Eyes */}
          <ellipse cx="41" cy="52" rx="3.5" ry="3" fill="#3B2A10"/>
          <ellipse cx="59" cy="52" rx="3.5" ry="3" fill="#3B2A10"/>
          <circle cx="42.2" cy="50.8" r="1.1" fill="white"/>
          <circle cx="60.2" cy="50.8" r="1.1" fill="white"/>
          {/* Nose hint */}
          <path d="M50 57 Q48 61 50 63 Q52 61 50 57" fill="none" stroke="#C89878" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Slight smirk */}
          <path d="M44 70 Q50 73 56 69" stroke="#B07050" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        </svg>
      );

    case 'korean':
      // Jimin: pink background, straight jet-black hair with side part, light warm skin, bright eyes
      return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="100" height="100" fill="#E8387A"/>
          {/* Straight black hair with side part */}
          <ellipse cx="50" cy="28" rx="26" ry="22" fill="#111111"/>
          {/* Side part - hair falls more to the right */}
          <path d="M38 12 Q42 8 50 8 Q58 8 68 14 Q62 12 56 12 Q48 11 38 16" fill="#111111"/>
          {/* Straight hair frame left side */}
          <rect x="22" y="26" width="7" height="28" rx="3" fill="#111111"/>
          {/* Straight hair frame right side */}
          <rect x="71" y="26" width="7" height="24" rx="3" fill="#111111"/>
          {/* Face oval */}
          <ellipse cx="50" cy="58" rx="20" ry="24" fill="#F5D5B0"/>
          {/* Thin eyebrows */}
          <path d="M37 47 Q42 45 47 46" stroke="#111111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M53 46 Q58 45 63 47" stroke="#111111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* Bright large eyes */}
          <ellipse cx="41" cy="53" rx="4.5" ry="4" fill="#111111"/>
          <ellipse cx="59" cy="53" rx="4.5" ry="4" fill="#111111"/>
          {/* Eye whites */}
          <circle cx="42.8" cy="51.5" r="1.4" fill="white"/>
          <circle cx="60.8" cy="51.5" r="1.4" fill="white"/>
          {/* Nose hint */}
          <path d="M50 59 Q48 62 50 64 Q52 62 50 59" fill="none" stroke="#C8A888" strokeWidth="1.1" strokeLinecap="round"/>
          {/* Gentle smile */}
          <path d="M44 70 Q50 75 56 70" stroke="#C08060" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        </svg>
      );

    case 'chinese':
      // Xiao Ming: orange background, short black spiky hair, medium warm skin, big grin, cheek blush
      return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="100" height="100" fill="#E87A00"/>
          {/* Short black hair base */}
          <ellipse cx="50" cy="30" rx="24" ry="18" fill="#111111"/>
          {/* 3 small spiky bits on top */}
          <polygon points="38,16 35,5 41,13" fill="#111111"/>
          <polygon points="50,13 50,2 50,13" fill="#111111"/>
          <path d="M44,8 L50,2 L56,8" fill="#111111"/>
          <polygon points="62,16 59,5 65,13" fill="#111111"/>
          {/* Face oval */}
          <ellipse cx="50" cy="58" rx="21" ry="24" fill="#E8A878"/>
          {/* Simple eyebrows */}
          <path d="M37 47 Q42 45 47 46" stroke="#111111" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M53 46 Q58 45 63 47" stroke="#111111" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Happy eyes - slightly squinted from grin */}
          <path d="M37 52 Q41 49 45 52" stroke="#111111" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M55 52 Q59 49 63 52" stroke="#111111" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          {/* Big happy grin */}
          <path d="M39 67 Q50 78 61 67" stroke="#8B3A20" strokeWidth="2.2" fill="#CC6040" strokeLinecap="round"/>
          {/* Cheek blush ellipses */}
          <ellipse cx="33" cy="62" rx="5" ry="3" fill="#E86060" opacity="0.45"/>
          <ellipse cx="67" cy="62" rx="5" ry="3" fill="#E86060" opacity="0.45"/>
          {/* Nose hint */}
          <ellipse cx="50" cy="61" rx="2" ry="1.5" fill="#C87848" opacity="0.6"/>
        </svg>
      );

    case 'english':
    default:
      // Sam: purple background, curly natural dark brown hair, medium brown skin, warm wide smile
      return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="100" height="100" fill="#7C3AED"/>
          {/* Curly hair base */}
          <ellipse cx="50" cy="30" rx="27" ry="20" fill="#3B2010"/>
          {/* Overlapping circles for curly texture on top */}
          <circle cx="35" cy="18" r="9" fill="#3B2010"/>
          <circle cx="43" cy="13" r="9" fill="#3B2010"/>
          <circle cx="52" cy="11" r="9" fill="#3B2010"/>
          <circle cx="61" cy="13" r="9" fill="#3B2010"/>
          <circle cx="68" cy="19" r="8" fill="#3B2010"/>
          {/* Side curls */}
          <circle cx="24" cy="30" r="7" fill="#3B2010"/>
          <circle cx="76" cy="30" r="7" fill="#3B2010"/>
          <circle cx="23" cy="42" r="6" fill="#3B2010"/>
          <circle cx="77" cy="42" r="6" fill="#3B2010"/>
          {/* Face oval */}
          <ellipse cx="50" cy="59" rx="20" ry="23" fill="#C8956A"/>
          {/* Eyebrows */}
          <path d="M37 48 Q42 46 47 47" stroke="#3B2010" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M53 47 Q58 46 63 48" stroke="#3B2010" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Eyes */}
          <ellipse cx="41" cy="54" rx="4" ry="3.5" fill="#3B2010"/>
          <ellipse cx="59" cy="54" rx="4" ry="3.5" fill="#3B2010"/>
          <circle cx="42.5" cy="52.8" r="1.2" fill="white"/>
          <circle cx="60.5" cy="52.8" r="1.2" fill="white"/>
          {/* Nose hint */}
          <path d="M50 59 Q48 63 50 65 Q52 63 50 59" fill="none" stroke="#A06A40" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Warm wide smile */}
          <path d="M40 71 Q50 80 60 71" stroke="#7A3A20" strokeWidth="2.2" fill="#CC7040" strokeLinecap="round"/>
          {/* Smile cheek highlight */}
          <ellipse cx="36" cy="64" rx="4" ry="2.5" fill="#D08060" opacity="0.4"/>
          <ellipse cx="64" cy="64" rx="4" ry="2.5" fill="#D08060" opacity="0.4"/>
        </svg>
      );
  }
}
