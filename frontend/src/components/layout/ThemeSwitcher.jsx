import React, { useState, useEffect } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { themes } from '../../utils/theme-config';
import { Sparkles } from 'lucide-react';

const SwatchIcon = ({ themeId }) => {
  switch (themeId) {
    case 'toffee':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 absolute text-[#543D2B] pointer-events-none opacity-85">
          {/* Mushroom */}
          <path d="M12 21 Q12 14 15 14 Q18 14 18 21" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M5 15 C5 8 25 8 25 15 Z" fill="currentColor" />
        </svg>
      );
    case 'sage':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 absolute text-[#30422B] pointer-events-none opacity-85">
          {/* Leaf */}
          <path d="M4 20 C8 10 18 4 20 4 C20 4 16 16 4 20 Z" fill="currentColor" />
          <line x1="4" y1="20" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'lilacMist':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 absolute text-[#54394E] pointer-events-none opacity-85">
          {/* Sparkle */}
          <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" fill="currentColor" />
        </svg>
      );
    case 'matchaFrog':
      return (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 absolute text-[#33422E] pointer-events-none opacity-85">
          {/* Cute frog head shape */}
          <ellipse cx="12" cy="13" rx="7.5" ry="5" fill="currentColor" />
          <circle cx="7.5" cy="8" r="2.5" fill="currentColor" />
          <circle cx="16.5" cy="8" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'sunsetMeadow':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 absolute text-[#5C3D2E] pointer-events-none opacity-85">
          {/* Butterfly silhouette */}
          <path d="M12 12 Q4 3 2 10 Q4 16 12 12 Q20 3 22 10 Q20 16 12 12" fill="currentColor" />
          <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
};

const ThemeSwitcher = () => {
  const {
    activeAestheticTheme,
    folderThemes,
    activeFolderId,
    folders,
    setAestheticTheme,
    setFolderTheme,
    removeFolderTheme,
  } = useSlateStore();

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const [isFolderSpecific, setIsFolderSpecific] = useState(false);

  useEffect(() => {
    if (activeFolderId) {
      setIsFolderSpecific(!!folderThemes[activeFolderId]);
    } else {
      setIsFolderSpecific(false);
    }
  }, [activeFolderId, folderThemes]);

  const handleThemeSelect = (themeId) => {
    if (activeFolderId && isFolderSpecific) {
      setFolderTheme(activeFolderId, themeId);
    } else {
      setAestheticTheme(themeId);
      if (activeFolderId && folderThemes[activeFolderId]) {
        removeFolderTheme(activeFolderId);
      }
    }
  };

  const handleResetFolderTheme = () => {
    if (activeFolderId) {
      removeFolderTheme(activeFolderId);
      setIsFolderSpecific(false);
    }
  };

  const currentFolderThemeId = activeFolderId ? folderThemes[activeFolderId] : null;
  const activeThemeId = currentFolderThemeId || activeAestheticTheme || 'toffee';

  return (
    <div className="flex flex-col gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/30 rounded-2xl shadow-xs">
      <div className="flex items-center gap-3.5 px-2">
        <span className="text-xs font-sans-rounded font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Theme Worlds
        </span>

        <div className="flex items-center gap-2">
          {Object.values(themes).map((theme) => {
            const isActive = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className="w-8 h-8 rounded-full relative border border-[#2B2620]/20 transition-all hover:scale-115 active:scale-90 flex-shrink-0 flex items-center justify-center overflow-hidden theme-transition"
                style={{
                  background: `linear-gradient(135deg, ${theme.frameColor} 50%, ${theme.noteColors[1] || theme.noteColors[0]} 50%)`,
                  boxShadow: isActive ? `0 0 0 3px ${theme.accentColor}` : 'none',
                  borderColor: isActive ? '#2B2620' : 'rgba(43, 38, 32, 0.2)'
                }}
                title={theme.name}
                aria-label={`Select ${theme.name} theme`}
              >
                <SwatchIcon themeId={theme.id} />
              </button>
            );
          })}
        </div>
      </div>

      {activeFolderId && (
        <div className="flex items-center justify-between gap-3 px-2 pt-1 border-t border-slate-200/30 dark:border-slate-700/30 text-[10px]">
          <label className="flex items-center gap-1.5 cursor-pointer font-sans-rounded font-extrabold text-slate-400 dark:text-slate-500 select-none">
            <input
              type="checkbox"
              checked={isFolderSpecific}
              onChange={(e) => setIsFolderSpecific(e.target.checked)}
              className="w-3 h-3 rounded border-[#2B2620]/40 text-purple-600 focus:ring-purple-400"
            />
            <span>Set for {activeFolder.icon} folder only</span>
          </label>

          {currentFolderThemeId && (
            <button
              onClick={handleResetFolderTheme}
              className="text-purple-500 hover:text-purple-600 font-bold hover:underline"
            >
              Reset to Global
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
