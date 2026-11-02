import React from 'react';

export const BloomIcon = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="bloomGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--color-accent)" />
        <stop offset="100%" stopColor="var(--frame-color-dark, var(--color-accent))" />
      </linearGradient>
    </defs>
    {/* 4 organic geometric overlapping petals */}
    <path
      d="M16 3C18.8 3 20.8 6.2 19.8 9.2C18.6 12.8 16 16 16 16C16 16 13.4 12.8 12.2 9.2C11.2 6.2 13.2 3 16 3Z"
      fill="url(#bloomGrad)"
      opacity="0.95"
    />
    <path
      d="M29 16C29 18.8 25.8 20.8 22.8 19.8C19.2 18.6 16 16 16 16C16 16 19.2 13.4 22.8 12.2C25.8 11.2 29 13.2 29 16Z"
      fill="url(#bloomGrad)"
      opacity="0.9"
    />
    <path
      d="M16 29C13.2 29 11.2 25.8 12.2 22.8C13.4 19.2 16 16 16 16C16 16 18.6 19.2 19.8 22.8C20.8 25.8 18.8 29 16 29Z"
      fill="url(#bloomGrad)"
      opacity="0.85"
    />
    <path
      d="M3 16C3 13.2 6.2 11.2 9.2 12.2C12.8 13.4 16 16 16 16C16 16 12.8 19.2 9.2 19.8C6.2 20.8 3 18.8 3 16Z"
      fill="url(#bloomGrad)"
      opacity="0.9"
    />
    {/* Subtle center pistil dot */}
    <circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />
  </svg>
);

export const BloomLogo = () => (
  <div className="flex items-center gap-2.5 select-none">
    <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shadow-xs">
      <BloomIcon size={22} />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-[17px] font-bold tracking-tight text-[var(--color-text)]">
          Bloom
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-80" />
      </div>
      <span className="text-[10px] font-medium tracking-wider text-[var(--color-text-muted)] opacity-70 uppercase mt-0.5">
        Notes & Ideas
      </span>
    </div>
  </div>
);

export default BloomLogo;

