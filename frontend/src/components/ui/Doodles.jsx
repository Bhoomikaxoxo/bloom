import React from 'react';

export const StarDoodle = ({ className = 'w-6 h-6 text-yellow-300' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} animate-pulse`}
    style={{ animationDuration: '3s' }}
  >
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
  </svg>
);

export const StarPawCheckbox = ({ checked, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-6 h-6 flex items-center justify-center rounded-lg transition-transform duration-150 active:scale-75 focus:outline-none focus:ring-2 focus:ring-accent/40 ${className}`}
    aria-label={checked ? "Uncheck item" : "Check item"}
  >
    {checked ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-400 dark:text-purple-300">
        <path d="M12 1.5l3.09 6.3 6.91.95-5 4.87 1.18 6.88-6.18-3.25-6.18 3.25 1.18-6.88-5-4.87 6.91-.95z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-purple-400">
        <path d="M12 1.5l3.09 6.3 6.91.95-5 4.87 1.18 6.88-6.18-3.25-6.18 3.25 1.18-6.88-5-4.87 6.91-.95z" />
      </svg>
    )}
  </button>
);

export const CloudDoodle = ({ className = 'w-12 h-8 text-blue-200' }) => (
  <svg
    viewBox="0 0 100 60"
    fill="currentColor"
    className={`${className} animate-bounce`}
    style={{ animationDuration: '6s' }}
  >
    <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 40,15 C50,0 75,5 75,25 C90,25 90,40 75,40 C75,50 65,55 55,50 C45,58 25,58 20,40 Z" />
  </svg>
);

export const HeartDoodle = ({ className = 'w-5 h-5 text-pink-300' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} hover:scale-125 transition-transform duration-200`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const SparkleDoodle = ({ className = 'absolute text-yellow-200' }) => (
  <div className={`pointer-events-none ${className} flex gap-2`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-ping" style={{ animationDuration: '2s' }}>
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    </svg>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}>
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    </svg>
  </div>
);

export const StickerBadge = ({ type }) => {
  switch (type) {
    case 'star':
      return (
        <div className="absolute -top-3 -right-2 rotate-12 drop-shadow-md select-none pointer-events-none bg-yellow-100 dark:bg-yellow-950 border-2 border-dashed border-yellow-400 dark:border-yellow-600 rounded-full p-1.5 z-10">
          <StarDoodle className="w-5 h-5 text-yellow-500" />
        </div>
      );
    case 'heart':
      return (
        <div className="absolute -top-3 -right-2 -rotate-12 drop-shadow-md select-none pointer-events-none bg-pink-100 dark:bg-pink-950 border-2 border-dashed border-pink-400 dark:border-pink-600 rounded-full p-1.5 z-10">
          <HeartDoodle className="w-5 h-5 text-pink-500" />
        </div>
      );
    case 'bow':
    default:
      return (
        <div className="absolute -top-3 -right-2 rotate-6 drop-shadow-md select-none pointer-events-none bg-purple-100 dark:bg-purple-950 border-2 border-dashed border-purple-400 dark:border-purple-600 rounded-full px-2 py-1 text-xs font-bold text-purple-600 dark:text-purple-300 z-10 flex items-center gap-1 font-display">
          🎀 cute
        </div>
      );
  }
};
