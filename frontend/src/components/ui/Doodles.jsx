import React from 'react';

// Star rating / favorite icon
export const StarDoodle = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} filter drop-shadow-xs`}
  >
    <path
      d="M12 1.5l3.2 6.8 7.3 1-5.3 5.2 1.3 7.5L12 18.2l-6.5 3.8 1.3-7.5-5.3-5.2 7.3-1z"
      fill="#F59E0B"
      stroke="#78350F"
      strokeWidth="1.2"
    />
  </svg>
);

// High-contrast, tactile empty search / clear horizon illustration
export const CloudDoodle = ({ className = 'w-24 h-20' }) => (
  <svg
    viewBox="0 0 140 100"
    className={`${className} filter drop-shadow-sm`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sunGrad" x1="70" y1="20" x2="70" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#C2531C" />
      </linearGradient>
      <linearGradient id="inkCloudGrad" x1="20" y1="35" x2="120" y2="75" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#EDE5D8" />
      </linearGradient>
    </defs>
    
    {/* Warm Horizon Sun with High-Contrast Ink Rim */}
    <circle cx="70" cy="42" r="22" fill="url(#sunGrad)" stroke="#5A2E10" strokeWidth="2" />
    <path d="M70 12 L70 16" stroke="#5A2E10" strokeWidth="2" strokeLinecap="round" />
    <path d="M92 20 L89 23" stroke="#5A2E10" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 20 L51 23" stroke="#5A2E10" strokeWidth="2" strokeLinecap="round" />

    {/* Crisp Defined Cloud with Deep Ink Contour — Never Blends into Cream Background */}
    <path
      d="M32 72 C22 72 14 62 18 52 C12 40 24 28 38 34 C46 18 76 18 86 34 C98 26 114 34 112 48 C124 54 122 72 108 72 Z"
      fill="url(#inkCloudGrad)"
      stroke="#38281B"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* Subtle Manuscript Accent Lines */}
    <path d="M42 56 L62 56" stroke="#C2531C" strokeWidth="2" strokeLinecap="round" />
    <path d="M72 56 L96 56" stroke="#A89F91" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 63 L86 63" stroke="#A89F91" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// High-contrast Artisanal Keepsake Folio / Memory Box for deleted notes
export const MemoryBoxDoodle = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 120 120"
    className={`${className} filter drop-shadow-md`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="boxChestGrad" x1="20" y1="50" x2="100" y2="105" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9F5EC" />
        <stop offset="100%" stopColor="#DFD4C2" />
      </linearGradient>
      <linearGradient id="boxLidGrad" x1="16" y1="36" x2="104" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C2531C" />
        <stop offset="100%" stopColor="#8C330B" />
      </linearGradient>
    </defs>

    {/* Grounding Shadow */}
    <ellipse cx="60" cy="106" rx="42" ry="7" fill="rgba(40, 25, 15, 0.12)" />

    {/* Archival Box Base */}
    <rect
      x="22"
      y="50"
      width="76"
      height="50"
      rx="6"
      fill="url(#boxChestGrad)"
      stroke="#362315"
      strokeWidth="2.5"
    />

    {/* Archival Folio Lines */}
    <line x1="32" y1="64" x2="88" y2="64" stroke="#8C330B" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="32" y1="74" x2="88" y2="74" stroke="#B8AD9C" strokeWidth="1.5" />
    <line x1="32" y1="84" x2="68" y2="84" stroke="#B8AD9C" strokeWidth="1.5" />

    {/* Brass Tag Holder in Center */}
    <rect x="48" y="68" width="24" height="15" rx="3" fill="#FAF6F0" stroke="#362315" strokeWidth="1.8" />
    <circle cx="53" cy="75.5" r="1.5" fill="#C2531C" />
    <circle cx="67" cy="75.5" r="1.5" fill="#C2531C" />

    {/* Wooden / Leather Box Lid */}
    <rect
      x="18"
      y="38"
      width="84"
      height="15"
      rx="4"
      fill="url(#boxLidGrad)"
      stroke="#362315"
      strokeWidth="2.5"
    />

    {/* Brass Lid Handle */}
    <path
      d="M52 38 C52 33 68 33 68 38"
      stroke="#FDE68A"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M52 38 C52 33 68 33 68 38"
      stroke="#362315"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// High-contrast Manuscript Notebook empty state
export const EmptyNotesDoodle = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 120 120"
    className={`${className} filter drop-shadow-md`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sheetGrad" x1="26" y1="18" x2="94" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F5EFE6" />
      </linearGradient>
    </defs>

    {/* Underneath Sheet */}
    <rect
      x="36"
      y="22"
      width="64"
      height="82"
      rx="5"
      transform="rotate(6 68 63)"
      fill="#EAE2D4"
      stroke="#38281B"
      strokeWidth="2"
    />

    {/* Foreground Manuscript Sheet */}
    <rect
      x="26"
      y="18"
      width="64"
      height="82"
      rx="5"
      fill="url(#sheetGrad)"
      stroke="#38281B"
      strokeWidth="2.4"
    />

    {/* Ruled Manuscript Lines */}
    <line x1="36" y1="36" x2="76" y2="36" stroke="#C2531C" strokeWidth="2" strokeLinecap="round" />
    <line x1="36" y1="48" x2="80" y2="48" stroke="#BFB5A5" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="36" y1="58" x2="74" y2="58" stroke="#BFB5A5" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="36" y1="68" x2="78" y2="68" stroke="#BFB5A5" strokeWidth="1.8" strokeLinecap="round" />

    {/* Botanical Sprig Marker */}
    <path
      d="M78 88 C76 74 85 64 88 56"
      stroke="#244A38"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M82 66 C87 63 90 68 85 71 Z"
      fill="#244A38"
    />
    <path
      d="M79 76 C74 74 72 79 77 81 Z"
      fill="#244A38"
    />
  </svg>
);
