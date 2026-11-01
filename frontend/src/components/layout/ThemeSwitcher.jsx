import React from 'react';
import useSlateStore from '../../store/useSlateStore';
import { THEMES } from '../../utils/theme-config';

const ThemeSwitcher = () => {
  const {
    activeAestheticTheme,
    setAestheticTheme,
  } = useSlateStore();

  const currentThemeId = activeAestheticTheme || 'caramel';

  return (
    <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
      {THEMES.map((theme) => {
        const isActive = currentThemeId === theme.id ||
          (currentThemeId === 'toffee' && theme.id === 'caramel') ||
          (currentThemeId === 'sage' && theme.id === 'matcha');

        return (
          <button
            key={theme.id}
            onClick={() => setAestheticTheme(theme.id)}
            title={theme.name}
            aria-label={`Select ${theme.name} theme`}
            className={`w-5 h-5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
              isActive
                ? 'scale-110 shadow-sm ring-2 ring-offset-1 ring-offset-transparent'
                : 'opacity-70 hover:opacity-100 hover:scale-105'
            }`}
            style={{
              backgroundColor: theme.accentColor,
              ringColor: theme.accentColor,
            }}
          >
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
