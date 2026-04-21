export default function LanguageFlag({ language }: { language: string }) {
  switch (language) {
    case 'spanish':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {/* Red top band */}
          <rect x="0" y="0" width="30" height="5" fill="#AA151B"/>
          {/* Yellow middle band */}
          <rect x="0" y="5" width="30" height="10" fill="#F1BF00"/>
          {/* Red bottom band */}
          <rect x="0" y="15" width="30" height="5" fill="#AA151B"/>
          {/* Simplified coat of arms hint - narrow darker rect in yellow center */}
          <rect x="11" y="7" width="4" height="6" rx="0.5" fill="#C09000" opacity="0.7"/>
        </svg>
      );

    case 'french':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {/* Blue band */}
          <rect x="0" y="0" width="10" height="20" fill="#002395"/>
          {/* White band */}
          <rect x="10" y="0" width="10" height="20" fill="#FFFFFF"/>
          {/* Red band */}
          <rect x="20" y="0" width="10" height="20" fill="#ED2939"/>
        </svg>
      );

    case 'korean':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {/* White background */}
          <rect x="0" y="0" width="30" height="20" fill="#FFFFFF"/>
          {/* Taegeuk circle - red upper half */}
          <path d="M15,6 A4,4 0 0,1 15,14 A2,2 0 0,1 15,10 A2,2 0 0,0 15,6 Z" fill="#CD2E3A"/>
          <path d="M15,6 A4,4 0 0,0 15,14 A2,2 0 0,0 15,10 A2,2 0 0,1 15,6 Z" fill="#003478"/>
          {/* Trigrams - top-left (3 lines) */}
          <line x1="2" y1="3" x2="6" y2="3" stroke="#000000" strokeWidth="0.8"/>
          <line x1="2" y1="4.5" x2="6" y2="4.5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="2" y1="6" x2="6" y2="6" stroke="#000000" strokeWidth="0.8"/>
          {/* Trigrams - top-right */}
          <line x1="24" y1="3" x2="28" y2="3" stroke="#000000" strokeWidth="0.8"/>
          <line x1="24" y1="4.5" x2="26" y2="4.5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="26.5" y1="4.5" x2="28" y2="4.5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="24" y1="6" x2="28" y2="6" stroke="#000000" strokeWidth="0.8"/>
          {/* Trigrams - bottom-left */}
          <line x1="2" y1="14" x2="6" y2="14" stroke="#000000" strokeWidth="0.8"/>
          <line x1="2" y1="15.5" x2="4" y2="15.5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="4.5" y1="15.5" x2="6" y2="15.5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="2" y1="17" x2="6" y2="17" stroke="#000000" strokeWidth="0.8"/>
          {/* Trigrams - bottom-right */}
          <line x1="24" y1="14" x2="28" y2="14" stroke="#000000" strokeWidth="0.8"/>
          <line x1="24" y1="15.5" x2="28" y2="15.5" stroke="#000000" strokeWidth="0.8"/>
          <line x1="24" y1="17" x2="28" y2="17" stroke="#000000" strokeWidth="0.8"/>
        </svg>
      );

    case 'chinese':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {/* Red background */}
          <rect x="0" y="0" width="30" height="20" fill="#DE2910"/>
          {/* Large star at (6,5) size 3.5 */}
          <polygon
            points="6,1.5 7.03,4.73 10.42,4.73 7.69,6.74 8.73,9.97 6,7.96 3.27,9.97 4.31,6.74 1.58,4.73 4.97,4.73"
            fill="#FFDE00"
          />
          {/* Small star at (12,2) size 1.5 */}
          <polygon
            points="12,0.5 12.44,1.85 13.85,1.85 14.71,2.48 14.27,3.84 12,2.97 9.73,3.84 9.29,2.48 10.15,1.85 11.56,1.85"
            fill="#FFDE00"
          />
          {/* Small star at (14,5) size 1.5 */}
          <polygon
            points="14,3 14.44,4.35 15.85,4.35 14.71,5.0 15.15,6.35 14,5.7 12.85,6.35 13.29,5.0 12.15,4.35 13.56,4.35"
            fill="#FFDE00"
          />
          {/* Small star at (14,8) size 1.5 */}
          <polygon
            points="14,6 14.44,7.35 15.85,7.35 14.71,8.0 15.15,9.35 14,8.7 12.85,9.35 13.29,8.0 12.15,7.35 13.56,7.35"
            fill="#FFDE00"
          />
          {/* Small star at (12,11) size 1.5 */}
          <polygon
            points="12,9.5 12.44,10.85 13.85,10.85 14.71,11.48 14.27,12.84 12,11.97 9.73,12.84 9.29,11.48 10.15,10.85 11.56,10.85"
            fill="#FFDE00"
          />
        </svg>
      );

    case 'japanese':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="30" height="20" fill="white"/>
          <circle cx="15" cy="10" r="6" fill="#BC002D"/>
        </svg>
      );

    case 'dutch':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="30" height="20" fill="#21468B"/>
          <rect width="30" height="14" fill="white"/>
          <rect width="30" height="7" fill="#AE1C28"/>
        </svg>
      );

    case 'thai':
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <rect width="30" height="20" fill="#A51931"/>
          <rect y="4" width="30" height="12" fill="white"/>
          <rect y="7" width="30" height="6" fill="#2D2A4A"/>
        </svg>
      );

    case 'english':
    default:
      return (
        <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {/* Blue background */}
          <rect x="0" y="0" width="30" height="20" fill="#012169"/>
          {/* White diagonal X - thick */}
          <line x1="0" y1="0" x2="30" y2="20" stroke="white" strokeWidth="6"/>
          <line x1="30" y1="0" x2="0" y2="20" stroke="white" strokeWidth="6"/>
          {/* Red diagonal X - thinner, offset */}
          <line x1="0" y1="0" x2="30" y2="20" stroke="#C8102E" strokeWidth="3"/>
          <line x1="30" y1="0" x2="0" y2="20" stroke="#C8102E" strokeWidth="3"/>
          {/* White horizontal + vertical cross thick */}
          <rect x="0" y="7.5" width="30" height="5" fill="white"/>
          <rect x="12.5" y="0" width="5" height="20" fill="white"/>
          {/* Red horizontal + vertical cross thinner on top */}
          <rect x="0" y="8.5" width="30" height="3" fill="#C8102E"/>
          <rect x="13.5" y="0" width="3" height="20" fill="#C8102E"/>
        </svg>
      );
  }
}
