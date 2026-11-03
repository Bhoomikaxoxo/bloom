import React, { useState, useRef, useEffect } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { THEMES } from '../../utils/theme-config';
import { Palette, Check } from 'lucide-react';

const THEME_DESCRIPTIONS = {
  caramel: 'Warm parchment & cozy amber',
  matcha: 'Earthy herbal green & focus',
  rose: 'Soft blush & gentle creativity',
  lavender: 'Dreamy lilac & evening calm',
  slate: 'Crisp mist & mindful clarity',
};

const ThemeSwitcher = () => {
  const {
    activeAestheticTheme,
    setAestheticTheme,
  } = useSlateStore();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const currentThemeId = activeAestheticTheme || 'caramel';
  const activeTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Compact Aesthetic Theme Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[var(--color-text)] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-all cursor-pointer shadow-2xs"
        title="Change Aesthetic Theme"
        aria-label="Change Theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs ring-1 ring-black/20 dark:ring-white/30"
          style={{ backgroundColor: activeTheme.accentColor }}
        />
        <Palette className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
        <span className="hidden xl:inline text-[11px] font-bold">{activeTheme.name}</span>
      </button>

      {/* Aesthetic Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-[var(--color-card-bg)] rounded-2xl border border-black/10 dark:border-white/10 shadow-xl backdrop-blur-xl z-50 animate-fade-in space-y-1">
          <div className="px-2.5 py-1.5 border-b border-black/[0.06] dark:border-white/[0.06] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Color Atmosphere
            </span>
          </div>

          {THEMES.map((theme) => {
            const isSelected = currentThemeId === theme.id ||
              (currentThemeId === 'toffee' && theme.id === 'caramel') ||
              (currentThemeId === 'sage' && theme.id === 'matcha');

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setAestheticTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] font-bold shadow-2xs'
                    : 'text-[var(--color-text)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs ring-1 ring-black/20 dark:ring-white/30"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold leading-tight truncate">{theme.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] leading-tight truncate">
                      {THEME_DESCRIPTIONS[theme.id] || 'Stationery theme'}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
