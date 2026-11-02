import React from 'react';

export const StarDoodle = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} filter drop-shadow-sm`}
  >
    <path
      d="M12 1.5l3.2 6.8 7.3 1-5.3 5.2 1.3 7.5L12 18.2l-6.5 3.8 1.3-7.5-5.3-5.2 7.3-1z"
      fill="#FBBF24"
      stroke="#D97706"
      strokeWidth="1.2"
    />
  </svg>
);

export const StarPawCheckbox = ({ checked, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-6 h-6 flex items-center justify-center rounded-lg transition-transform duration-150 active:scale-75 focus:outline-none ${className}`}
    aria-label={checked ? "Uncheck item" : "Check item"}
  >
    {checked ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--color-accent)]">
        <path d="M12 1.5l3.09 6.3 6.91.95-5 4.87 1.18 6.88-6.18-3.25-6.18 3.25 1.18-6.88-5-4.87 6.91-.95z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-gray-400 hover:text-[var(--color-accent)]">
        <path d="M12 1.5l3.09 6.3 6.91.95-5 4.87 1.18 6.88-6.18-3.25-6.18 3.25 1.18-6.88-5-4.87 6.91-.95z" />
      </svg>
    )}
  </button>
);

// High-contrast, beautifully shaded cloud illustration
export const CloudDoodle = ({ className = 'w-20 h-14' }) => (
  <svg
    viewBox="0 0 120 80"
    className={`${className} filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]`}
    fill="none"
  >
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
    </defs>
    {/* Cloud Body */}
    <path
      d="M25 60 C15 60 8 50 12 40 C6 30 18 18 32 24 C40 8 68 8 76 24 C86 16 102 24 100 38 C112 44 110 60 95 60 Z"
      fill="url(#cloudGrad)"
      stroke="#CBD5E1"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Soft Cheek Blush */}
    <ellipse cx="38" cy="48" rx="5" ry="3" fill="#FDA4AF" opacity="0.6" />
    <ellipse cx="80" cy="48" rx="5" ry="3" fill="#FDA4AF" opacity="0.6" />
  </svg>
);

// Bespoke Keepsake Memory Box for deleted notes empty state
export const MemoryBoxDoodle = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.14)]`}
    fill="none"
  >
    <defs>
      <linearGradient id="boxBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      <linearGradient id="boxLid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="100%" stopColor="#F43F5E" />
      </linearGradient>
    </defs>

    {/* Sparkle 1 */}
    <path d="M18 22 L20 28 L26 30 L20 32 L18 38 L16 32 L10 30 L16 28 Z" fill="#FBBF24" />
    {/* Sparkle 2 */}
    <path d="M84 18 L85.5 22.5 L90 24 L85.5 25.5 L84 30 L82.5 25.5 L78 24 L82.5 22.5 Z" fill="#F59E0B" />

    {/* Floating Flower Petal */}
    <path
      d="M50 16 C55 10, 62 12, 60 20 C58 26, 52 24, 50 16 Z"
      fill="url(#petalGrad)"
      opacity="0.85"
    />

    {/* Box Bottom Base */}
    <rect
      x="22"
      y="45"
      width="56"
      height="38"
      rx="6"
      fill="url(#boxBody)"
      stroke="rgba(0,0,0,0.12)"
      strokeWidth="2.5"
    />

    {/* Front Ribbon Stripe */}
    <rect x="46" y="45" width="8" height="38" fill="#F43F5E" opacity="0.15" />

    {/* Box Lid (Tilted Open slightly) */}
    <rect
      x="18"
      y="36"
      width="64"
      height="12"
      rx="4"
      fill="url(#boxBody)"
      stroke="rgba(0,0,0,0.14)"
      strokeWidth="2.5"
    />

    {/* Golden Clasp */}
    <rect x="45" y="42" width="10" height="8" rx="2" fill="url(#boxLid)" />
    <circle cx="50" cy="46" r="1.5" fill="#78350F" />
  </svg>
);

// Bespoke Aesthetic Open Notebook for Empty Notes state
export const EmptyNotesDoodle = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.12)]`}
    fill="none"
  >
    <defs>
      <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
    </defs>

    {/* Floating Star */}
    <path d="M78 18 L80 23 L85 24 L80.5 27.5 L82 32.5 L78 29.5 L74 32.5 L75.5 27.5 L71 24 L76 23 Z" fill="#FBBF24" />

    {/* Notebook Base Sheet */}
    <rect x="22" y="24" width="56" height="60" rx="8" fill="url(#coverGrad)" stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" />

    {/* Left Binder Rings */}
    <circle cx="30" cy="36" r="2.5" fill="#94A3B8" />
    <circle cx="30" cy="52" r="2.5" fill="#94A3B8" />
    <circle cx="30" cy="68" r="2.5" fill="#94A3B8" />

    {/* Decorative ruled lines */}
    <line x1="38" y1="36" x2="68" y2="36" stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="46" x2="64" y2="46" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="56" x2="60" y2="56" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />

    {/* Little Blossom Stamp */}
    <circle cx="62" cy="68" r="4" fill="#FDA4AF" />
    <circle cx="62" cy="68" r="1.5" fill="#F59E0B" />
  </svg>
);

export const HeartDoodle = ({ className = 'w-5 h-5 text-pink-400' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} hover:scale-125 transition-transform duration-200`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const SparkleDoodle = ({ className = 'absolute text-yellow-300' }) => (
  <div className={`pointer-events-none ${className} flex gap-2`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-ping" style={{ animationDuration: '2s' }}>
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    </svg>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}>
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    </svg>
  </div>
);
