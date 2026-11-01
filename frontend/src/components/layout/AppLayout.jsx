import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainCanvas from './MainCanvas';
import ConfettiPortal from '../ui/ConfettiPortal';
import ClickSpark from '../ui/ClickSpark';
import ShortcutsModal from '../ui/ShortcutsModal';
import useSlateStore from '../../store/useSlateStore';
import { themes, applyTheme } from '../../utils/theme-config';
import { Menu, X } from 'lucide-react';

const AppLayout = () => {
  const activeAestheticTheme = useSlateStore((state) => state.activeAestheticTheme || 'caramel');
  const folderThemes = useSlateStore((state) => state.folderThemes || {});
  const activeFolderId = useSlateStore((state) => state.activeFolderId);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply visual theme custom properties dynamically
  useEffect(() => {
    const folderOverride = activeFolderId ? folderThemes[activeFolderId] : null;
    const currentThemeId = folderOverride || activeAestheticTheme;
    const activeTheme = themes[currentThemeId] || themes.caramel;
    applyTheme(activeTheme);
  }, [activeFolderId, activeAestheticTheme, folderThemes]);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden relative transition-colors duration-300 text-[var(--color-text)] select-none"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, var(--color-bg-from), var(--color-bg-via), var(--color-bg-to))'
      }}
    >
      <ConfettiPortal />
      <ShortcutsModal />
      <ClickSpark
        sparkColor="var(--color-accent)"
        sparkSize={8}
        sparkRadius={14}
        sparkCount={6}
        duration={350}
        easing="ease-out"
        extraScale={1}
      />

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden absolute top-4 left-4 z-40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-2.5 rounded-full shadow-md transition-transform active:scale-90 border border-black/10 focus:outline-none"
        title="Toggle Menu"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex-shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex`}
      >
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/25 backdrop-blur-xs z-20 md:hidden animate-fade-in"
        />
      )}

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <MainCanvas />
      </div>
    </div>
  );
};

export default AppLayout;
