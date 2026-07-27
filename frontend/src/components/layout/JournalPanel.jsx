import React, { useState } from 'react';
import useSlateStore from '../../store/useSlateStore';
import useAuthStore from '../../store/useAuthStore';
import { themes } from '../../utils/theme-config';
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';

// ==========================================
// --- DECORATIVE DOODLES & MASCOTS ---
// ==========================================

// Teddy Bear perched on TOP-LEFT edge of outer frame
const TeddyPeekingTopLeft = () => (
  <div className="absolute -top-[22px] left-[28px] w-14 h-11 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 70 50" className="w-full h-full drop-shadow-xs">
      {/* Outer Ears */}
      <circle cx="18" cy="18" r="9" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="2.8" />
      <circle cx="52" cy="18" r="9" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="2.8" />
      {/* Inner Ears */}
      <circle cx="18" cy="18" r="5" fill="#E8A98C" stroke="var(--ink-color)" strokeWidth="1.5" />
      <circle cx="52" cy="18" r="5" fill="#E8A98C" stroke="var(--ink-color)" strokeWidth="1.5" />
      {/* Head */}
      <path d="M12 36 Q12 18 35 18 Q58 18 58 36 Z" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="2.8" />
      {/* Snout */}
      <ellipse cx="35" cy="29" rx="7" ry="5.5" fill="#F3E6D3" stroke="var(--ink-color)" strokeWidth="1.8" />
      <ellipse cx="35" cy="26.5" rx="3" ry="2" fill="var(--ink-color)" />
      <path d="M35 28.5 L35 31 Q32 33 30 32 M35 31 Q38 33 40 32" stroke="var(--ink-color)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="25" cy="25" r="2.2" fill="var(--ink-color)" />
      <circle cx="45" cy="25" r="2.2" fill="var(--ink-color)" />
      {/* Blush Cheeks */}
      <ellipse cx="21" cy="29" rx="3.5" ry="2" fill="#E8A98C" opacity="0.85" />
      <ellipse cx="49" cy="29" rx="3.5" ry="2" fill="#E8A98C" opacity="0.85" />
      {/* Paws perched on outer frame border */}
      <ellipse cx="18" cy="36" rx="6" ry="4" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="2.2" />
      <ellipse cx="52" cy="36" rx="6" ry="4" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="2.2" />
    </svg>
  </div>
);

// Sticky Note Tab poking out from left side
const StickyTabLeft = () => (
  <div className="absolute top-1/2 -translate-y-1/2 -left-[14px] w-5 h-10 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 24 40" className="w-full h-full drop-shadow-xs">
      <path d="M14 0 L4 0 Q0 0 0 4 L0 36 Q0 40 4 40 L14 40 Z" fill="#8CA0B3" stroke="var(--ink-color)" strokeWidth="2.5" />
      <line x1="4" y1="12" x2="10" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="4" y1="20" x2="10" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <line x1="4" y1="28" x2="8" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  </div>
);

const ToffeeMushroom = () => (
  <div className="absolute top-2 right-4 w-9 h-9 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M16 32 Q16 20 20 20 Q24 20 24 32" fill="var(--paper-color)" stroke="var(--ink-color)" strokeWidth="2.2" />
      <path d="M8 22 C8 10 32 10 32 22 Z" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="2.2" />
      <circle cx="16" cy="15" r="1.5" fill="var(--paper-color)" />
      <circle cx="24" cy="16" r="1" fill="var(--paper-color)" />
    </svg>
  </div>
);

const SageLeaf = () => (
  <div className="absolute top-2.5 right-4 w-9 h-9 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M8 32 C12 16 28 8 32 8 C32 8 24 24 8 32 Z" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="2.2" />
      <line x1="8" y1="32" x2="25" y2="15" stroke="var(--ink-color)" strokeWidth="1.8" />
    </svg>
  </div>
);

const LilacSparkle = () => (
  <div className="absolute top-2.5 right-4 w-9 h-9 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 40 40" className="w-full h-full" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="2.2">
      <path d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" strokeLinejoin="round" />
    </svg>
  </div>
);

const FrogPerched = () => (
  <div className="absolute -top-[16px] right-[40px] w-14 h-12 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 70 60" className="w-full h-full">
      <ellipse cx="35" cy="38" rx="25" ry="16" fill="#A8C98A" stroke="var(--ink-color)" strokeWidth="2.2" />
      <circle cx="19" cy="19" r="9" fill="#A8C98A" stroke="var(--ink-color)" strokeWidth="2" />
      <circle cx="51" cy="19" r="9" fill="#A8C98A" stroke="var(--ink-color)" strokeWidth="2" />
      <circle cx="19" cy="19" r="3.2" fill="var(--ink-color)" />
      <circle cx="51" cy="19" r="3.2" fill="var(--ink-color)" />
      <path d="M22 41 Q35 47 48 41" stroke="var(--ink-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="25" cy="37" rx="3.5" ry="2" fill="#F2B7B0" opacity="0.8" />
      <ellipse cx="45" cy="37" rx="3.5" ry="2" fill="#F2B7B0" opacity="0.8" />
    </svg>
  </div>
);

const DaisiesTopLeft = () => (
  <div className="absolute -top-[10px] -left-[10px] w-10 h-10 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 50 50" className="w-full h-full">
      <g transform="translate(20,20)">
        <circle r="4" fill="#F5C84C" stroke="var(--ink-color)" strokeWidth="1.2" />
        <ellipse rx="3" ry="7" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(0)" />
        <ellipse rx="3" ry="7" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(60)" />
        <ellipse rx="3" ry="7" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(120)" />
        <ellipse rx="3" ry="7" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(180)" />
        <ellipse rx="3" ry="7" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(240)" />
        <ellipse rx="3" ry="7" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(300)" />
        <circle r="3.5" fill="#F5C84C" />
      </g>
    </svg>
  </div>
);

const MatchaCup = () => (
  <div className="absolute bottom-[6px] right-[50px] w-10 h-11 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 45 50" className="w-full h-full">
      <path d="M8 18 L32 18 L29 44 L11 44 Z" fill="#F7F0DC" stroke="var(--ink-color)" strokeWidth="2.2" />
      <ellipse cx="20" cy="18" rx="12" ry="3.5" fill="#A8C98A" stroke="var(--ink-color)" strokeWidth="2" />
      <path d="M32 22 Q40 22 39 30 Q38 36 31 35" stroke="var(--ink-color)" strokeWidth="2" fill="none" />
      <path d="M15 13 Q17 8 15 4" stroke="var(--ink-color)" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M22 13 Q24 7 22 3" stroke="var(--ink-color)" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
    </svg>
  </div>
);

const StickyNoteStack = () => (
  <div className="absolute top-[48%] -left-[10px] w-10 h-10 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <rect x="14" y="18" width="32" height="32" rx="2" fill="#A8C98A" stroke="var(--ink-color)" strokeWidth="2" transform="rotate(-8 30 34)" />
      <rect x="10" y="14" width="32" height="32" rx="2" fill="#F7F0DC" stroke="var(--ink-color)" strokeWidth="2" transform="rotate(4 26 30)" />
      <path d="M10 14 L18 14 L18 8 Z" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.5" />
    </svg>
  </div>
);

const BunnyTucked = () => (
  <div className="absolute bottom-[35px] -left-[10px] w-12 h-12 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <ellipse cx="30" cy="42" rx="17" ry="13" fill="#FBEFD8" stroke="var(--ink-color)" strokeWidth="2.2" />
      <circle cx="22" cy="28" r="9" fill="#FBEFD8" stroke="var(--ink-color)" strokeWidth="2.2" />
      <path d="M14 20 Q10 6 15 4 Q17 12 17 20 Z" fill="#FBEFD8" stroke="var(--ink-color)" strokeWidth="2" />
      <path d="M26 20 Q28 6 23 4 Q23 12 23 20 Z" fill="#FBEFD8" stroke="var(--ink-color)" strokeWidth="2" />
      <circle cx="18" cy="27" r="1.2" fill="var(--ink-color)" />
      <circle cx="25" cy="27" r="1.2" fill="var(--ink-color)" />
      <ellipse cx="15" cy="31" rx="2.5" ry="1.5" fill="#F2B7B0" opacity="0.8" />
    </svg>
  </div>
);

const WildflowerSprigs = ({ isLeft = true }) => (
  <div className={`absolute -top-[16px] ${isLeft ? 'left-6' : 'right-6'} w-8 h-12 pointer-events-none z-20 transition-all duration-300`}>
    <svg viewBox="0 0 30 50" className="w-full h-full">
      <line x1="15" y1="50" x2="15" y2="15" stroke="var(--ink-color)" strokeWidth="2" />
      <g transform="translate(15,12)">
        <circle r="3.2" fill="var(--accent-color)" />
        <circle cx="-5" r="3.5" fill="var(--accent-color)" opacity="0.9" stroke="var(--ink-color)" strokeWidth="0.8" />
        <circle cx="5" r="3.5" fill="var(--accent-color)" opacity="0.9" stroke="var(--ink-color)" strokeWidth="0.8" />
        <circle cy="-5" r="3.5" fill="var(--accent-color)" opacity="0.9" stroke="var(--ink-color)" strokeWidth="0.8" />
      </g>
      <g transform="translate(8,28)">
        <circle r="4.5" fill="#D9534F" stroke="var(--ink-color)" strokeWidth="1" />
      </g>
    </svg>
  </div>
);

const ButterflyFlight = () => (
  <div className="absolute top-[48%] -left-[10px] w-10 h-8 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 40 30" className="w-full h-full">
      <path d="M20 15 Q8 2 4 12 Q6 20 20 15" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.8" opacity="0.9" />
      <path d="M20 15 Q32 2 36 12 Q34 20 20 15" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.8" opacity="0.9" />
      <line x1="20" y1="8" x2="20" y2="22" stroke="var(--ink-color)" strokeWidth="1.8" />
    </svg>
  </div>
);

const WovenBasket = () => (
  <div className="absolute bottom-[6px] right-[50px] w-11 h-10 pointer-events-none z-20 transition-all duration-300">
    <svg viewBox="0 0 50 40" className="w-full h-full">
      <path d="M8 15 L42 15 L37 37 L13 37 Z" fill="#FBEFD8" stroke="var(--ink-color)" strokeWidth="2.2" />
      <line x1="12" y1="20" x2="38" y2="20" stroke="var(--ink-color)" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="26" x2="37" y2="26" stroke="var(--ink-color)" strokeWidth="1" opacity="0.4" />
      <line x1="13" y1="32" x2="36" y2="32" stroke="var(--ink-color)" strokeWidth="1" opacity="0.4" />
      <path d="M14 15 Q25 2 36 15" fill="none" stroke="var(--ink-color)" strokeWidth="2" />
    </svg>
  </div>
);


// Mascot avatar button in bottom-right corner of inner card
const MascotCornerAvatar = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-3 right-3 w-11 h-11 rounded-full border-[2.5px] hover:scale-105 active:scale-95 shadow-md flex items-center justify-center transition-all z-25 group theme-transition cursor-pointer"
    style={{
      backgroundColor: '#C9A574',
      borderColor: 'var(--ink-color)'
    }}
    title="Expand Journal (Lightbox Focus Mode)"
  >
    <svg viewBox="0 0 40 40" className="w-7 h-7">
      <circle cx="20" cy="20" r="15" fill="#C9A574" />
      <circle cx="11" cy="11" r="4.5" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="1.8" />
      <circle cx="29" cy="11" r="4.5" fill="#C9A574" stroke="var(--ink-color)" strokeWidth="1.8" />
      <circle cx="11" cy="11" r="2.2" fill="#E8A98C" />
      <circle cx="29" cy="11" r="2.2" fill="#E8A98C" />
      <ellipse cx="20" cy="23" rx="4.5" ry="3.5" fill="#F3E6D3" stroke="var(--ink-color)" strokeWidth="1.5" />
      <circle cx="20" cy="21" r="1.2" fill="var(--ink-color)" />
      <circle cx="15" cy="18" r="1.4" fill="var(--ink-color)" />
      <circle cx="25" cy="18" r="1.4" fill="var(--ink-color)" />
      <ellipse cx="13" cy="21" rx="2" ry="1.2" fill="#E8A98C" opacity="0.85" />
      <ellipse cx="27" cy="21" rx="2" ry="1.2" fill="#E8A98C" opacity="0.85" />
    </svg>
    <div
      className="absolute -right-1 -bottom-1 text-white rounded-full p-1 border-[1.8px] scale-90 group-hover:scale-105 transition-transform shadow-xs"
      style={{
        backgroundColor: 'var(--accent-color)',
        borderColor: 'var(--ink-color)'
      }}
    >
      <Maximize2 className="w-2.5 h-2.5" strokeWidth={3} />
    </div>
  </button>
);


const JournalPanel = () => {
  const {
    activeFolderId,
    folders,
    journals,
    updateJournal,
    journalViewMode,
    activeAestheticTheme,
    folderThemes
  } = useSlateStore();
  const user = useAuthStore((state) => state.user);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Find active folder details
  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const journalKey = activeFolderId || 'global';
  const journalData = journals[journalKey] || { title: '', content1: '', content2: '' };

  const handleTitleChange = (e) => {
    updateJournal(activeFolderId, { title: e.target.value });
  };

  const handleContent1Change = (e) => {
    updateJournal(activeFolderId, { content1: e.target.value });
  };

  const handleContent2Change = (e) => {
    updateJournal(activeFolderId, { content2: e.target.value });
  };

  // Determine active theme for doodle set rendering
  const folderOverride = activeFolderId ? folderThemes[activeFolderId] : null;
  const currentThemeId = folderOverride || activeAestheticTheme || 'toffee';
  const activeTheme = themes[currentThemeId] || themes.toffee;
  const doodleSet = activeTheme.doodleSet || 'toffee';

  const displayTitle = journalData.title !== undefined ? journalData.title : '';
  const defaultPlaceholder = activeFolder ? `${activeFolder.icon} ${activeFolder.name} Log` : 'Today';

  // Get user details
  const displayName = user?.name || user?.email?.split('@')[0] || 'Mereyemi';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const getAvatarBg = (name) => {
    const colors = ['bg-rose-200 text-rose-700', 'bg-emerald-200 text-emerald-700', 'bg-amber-200 text-amber-700', 'bg-indigo-200 text-indigo-700', 'bg-purple-200 text-purple-700'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColorClass = getAvatarBg(displayName);

  const isJournalOnly = journalViewMode === 'journal';
  const panelWidthClass = isJournalOnly
    ? 'w-full flex-1'
    : 'w-full lg:w-[380px] xl:w-[425px] flex-shrink-0';

  // Helper to render doodles based on active theme's doodle set
  const renderDoodles = () => {
    switch (doodleSet) {
      case 'toffee':
        return (
          <>
            <TeddyPeekingTopLeft />
            <StickyTabLeft />
            <ToffeeMushroom />
          </>
        );
      case 'sage':
        return <SageLeaf />;
      case 'lilac':
        return <LilacSparkle />;
      case 'matcha':
        return (
          <>
            <FrogPerched />
            <DaisiesTopLeft />
            <StickyNoteStack />
            <MatchaCup />
          </>
        );
      case 'sunset':
        return (
          <>
            <BunnyTucked />
            <WildflowerSprigs isLeft={true} />
            <WildflowerSprigs isLeft={false} />
            <ButterflyFlight />
            <WovenBasket />
          </>
        );
      case 'minimal':
      default:
        return null;
    }
  };


  const renderJournalContent = (isLightbox = false) => (
    <div
      className={`rounded-[22px] border-[2.5px] p-4 lg:p-5 flex flex-col flex-1 relative overflow-y-auto bg-journal-grid theme-transition z-10 ${isLightbox ? 'h-full' : 'max-h-[calc(100vh-210px)] min-h-[400px] lg:min-h-[450px]'
        }`}
      style={{
        borderColor: 'var(--ink-color)',
        backgroundColor: 'var(--paper-color)'
      }}
    >
      {/* Rectangular "Today" Title Input Box */}
      <div className="w-full mb-4 px-1 relative">
        <input
          type="text"
          value={displayTitle}
          onChange={handleTitleChange}
          placeholder={defaultPlaceholder}
          className="w-full text-center font-sans-rounded font-extrabold px-4 py-2 border-[2px] rounded-[16px] outline-none shadow-xs focus:ring-2 text-base transition-all theme-transition tracking-wide uppercase"
          style={{
            backgroundColor: '#FAFAFA',
            borderColor: 'var(--ink-color)',
            color: '#8CA0B3',
            fontFamily: 'var(--header-font)',
            '--tw-ring-color': 'var(--accent-color)'
          }}
        />
      </div>

      {/* Full Page Journal Ruled Area */}
      <div className="flex-1 flex flex-col min-h-[260px] relative">
        <textarea
          value={journalData.content1 || ''}
          onChange={handleContent1Change}
          placeholder="Write your thoughts, daily priorities, or notes here..."
          className="w-full flex-1 bg-transparent font-handwritten text-[22px] leading-[28px] outline-none border-none resize-none p-0 pt-[4px] overflow-y-auto theme-transition"
          style={{
            backgroundImage: 'none',
            color: 'var(--ink-color)',
            fontFamily: 'var(--handwriting-font)'
          }}
        />
      </div>

      {/* Bottom Right Mascot Corner Avatar & Lightbox Trigger */}
      {!isLightbox && <MascotCornerAvatar onClick={() => setIsZoomed(true)} />}
    </div>
  );

  // Outer frame style with evenly-spaced dots matrix grid running along border area in clean straight rows
  const frameStyle = {
    backgroundColor: activeTheme?.frameColor || '#8A6E4E',
    borderColor: 'var(--ink-color, #3A2A1A)',
    backgroundImage: `radial-gradient(${activeTheme?.gridColor || '#EADFCF'} 2px, transparent 2px)`,
    backgroundSize: '16px 16px',
    backgroundPosition: '4px 4px'
  };

  const framePaddingClass = 'p-5 lg:p-6';

  return (
    <>
      <div className={`${panelWidthClass} p-4 lg:p-6 transition-all duration-300 flex flex-col h-full overflow-hidden`}>
        {/* Mobile Header Accordion */}
        {!isJournalOnly && (
          <div className="lg:hidden flex items-center justify-between mb-3 p-3 rounded-2xl border theme-transition"
            style={{
              backgroundColor: 'rgba(var(--accent-color), 0.1)',
              borderColor: 'rgba(var(--accent-color), 0.2)'
            }}
          >
            <div className="flex items-center gap-2 font-sans-rounded font-extrabold" style={{ color: 'var(--ink-color)' }}>
              <span>📔</span>
              <span>Journal Page {activeFolder ? `(${activeFolder.name})` : ''}</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 active:scale-95 transition-transform"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Outer Frame (Rounded Rectangle 28px, 3px outline, warm caramel fill with dot matrix texture) */}
        <div
          className={`rounded-[28px] border-[3px] relative shadow-lg flex flex-col transition-all duration-300 theme-transition ${framePaddingClass} ${!isJournalOnly && isCollapsed ? 'hidden lg:flex lg:h-full h-0 opacity-0 overflow-hidden' : 'flex h-full'
            }`}
          style={frameStyle}
        >
          {/* Decorative Mascot & Tab SVGs */}
          {renderDoodles()}

          {/* Inner Cream Paper Zone */}
          {renderJournalContent(false)}
        </div>


      </div>


      {/* Lightbox Focus Mode Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-[#2B2620]/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 animate-fade-in">
          <div
            className={`relative w-full max-w-4xl h-[90vh] rounded-[28px] border-[4px] shadow-2xl flex flex-col theme-transition ${framePaddingClass}`}
            style={frameStyle}
          >
            {/* Lightbox SVGs */}
            {renderDoodles()}

            {/* Close / Minimize Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 left-4 lg:left-6 w-10 h-10 rounded-full border-2 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30 shadow-md theme-transition"
              style={{
                backgroundColor: 'var(--paper-color)',
                borderColor: 'var(--ink-color)'
              }}
              title="Close Lightbox"
            >
              <Minimize2 className="w-4 h-4" style={{ color: 'var(--ink-color)' }} strokeWidth={2.5} />
            </button>

            {/* Scale title in Lightbox */}
            <div className="w-full text-center py-2 font-sans-rounded font-extrabold text-sm tracking-widest uppercase mb-2" style={{ color: 'var(--paper-color)' }}>
              Focus Mode Journal
            </div>

            {/* Paper content */}
            {renderJournalContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default JournalPanel;
