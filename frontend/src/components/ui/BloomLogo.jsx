import React from 'react';
import useSlateStore from '../../store/useSlateStore';

export const BloomIcon = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Bloom Emblem"
  >
    <defs>
      <linearGradient id="bloomPetalGrad1" x1="18" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D96328" />
        <stop offset="100%" stopColor="#B34415" />
      </linearGradient>
      <linearGradient id="bloomPetalGrad2" x1="2" y1="18" x2="34" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E27236" />
        <stop offset="100%" stopColor="#96350E" />
      </linearGradient>
    </defs>
    
    {/* Delicate background radiating aura */}
    <circle cx="18" cy="18" r="16" fill="rgba(194, 83, 28, 0.08)" stroke="rgba(194, 83, 28, 0.2)" strokeWidth="1" />
    
    {/* Botanical Overlapping Petals (Artisanal Linework & Warm Terracotta Fill) */}
    {/* North Petal */}
    <path
      d="M18 4.5C21 8.5 22 13 18 18C14 13 15 8.5 18 4.5Z"
      fill="url(#bloomPetalGrad1)"
      stroke="#7C2607"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    {/* South Petal */}
    <path
      d="M18 31.5C15 27.5 14 23 18 18C22 23 21 27.5 18 31.5Z"
      fill="url(#bloomPetalGrad1)"
      stroke="#7C2607"
      strokeWidth="1.1"
      strokeLinejoin="round"
      opacity="0.9"
    />
    {/* East Petal */}
    <path
      d="M31.5 18C27.5 21 23 22 18 18C23 14 27.5 15 31.5 18Z"
      fill="url(#bloomPetalGrad2)"
      stroke="#7C2607"
      strokeWidth="1.1"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* West Petal */}
    <path
      d="M4.5 18C8.5 15 13 14 18 18C13 22 8.5 21 4.5 18Z"
      fill="url(#bloomPetalGrad2)"
      stroke="#7C2607"
      strokeWidth="1.1"
      strokeLinejoin="round"
      opacity="0.9"
    />

    {/* Center Botanical Stamen Core */}
    <circle cx="18" cy="18" r="3.2" fill="#FAF5EE" stroke="#7C2607" strokeWidth="1.2" />
    <circle cx="18" cy="18" r="1.4" fill="#C2531C" />
  </svg>
);

export const BloomLogo = ({ onClick }) => {
  const setWorkspaceView = useSlateStore((s) => s.setWorkspaceView);
  const setActiveFolderId = useSlateStore((s) => s.setActiveFolderId);
  const setActiveTagId = useSlateStore((s) => s.setActiveTagId);
  const setShowTrash = useSlateStore((s) => s.setShowTrash);
  const setShowFavorites = useSlateStore((s) => s.setShowFavorites);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setActiveFolderId(null);
      setActiveTagId(null);
      setShowTrash(false);
      setShowFavorites(false);
      setWorkspaceView('spine');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 select-none cursor-pointer group py-0.5"
      title="Bloom — Return to Daily Flow"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FAF6F0] to-[#EFE7DC] border border-[#DDD3C4] shadow-xs flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-[#C2531C]/40 group-hover:shadow-sm">
        <BloomIcon size={24} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-serif text-[20px] font-semibold tracking-tight text-[#1F1D1A] group-hover:text-[#C2531C] transition-colors">
            Bloom
          </span>
          <span className="text-[10px] font-mono text-[#C2531C] font-semibold opacity-85">
            studio
          </span>
        </div>
        <span className="text-[9px] font-sans font-semibold tracking-[0.16em] uppercase text-[#7A746C] mt-1">
          Desk &amp; Timeline
        </span>
      </div>
    </div>
  );
};

export default BloomLogo;
