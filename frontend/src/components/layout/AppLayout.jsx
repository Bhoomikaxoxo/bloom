import React, { useState, useEffect } from 'react';
import IconRail from './IconRail';
import Sidebar from './Sidebar';
import MainCanvas from './MainCanvas';
import ConfettiPortal from '../ui/ConfettiPortal';
import ClickSpark from '../ui/ClickSpark';
import ShortcutsModal from '../ui/ShortcutsModal';
import DeviceStorageModal from '../ui/DeviceStorageModal';
import useSlateStore from '../../store/useSlateStore';
import { themes, applyTheme } from '../../utils/theme-config';
import { Menu, X } from 'lucide-react';

const AppLayout = () => {
  const activeAestheticTheme = useSlateStore((state) => state.activeAestheticTheme || 'bloom-v2');
  const folderThemes = useSlateStore((state) => state.folderThemes || {});
  const folders = useSlateStore((state) => state.folders || []);
  const activeFolderId = useSlateStore((state) => state.activeFolderId);
  const sidebarCollapsed = useSlateStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useSlateStore((state) => state.toggleSidebarCollapsed);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  // Apply visual theme custom properties dynamically
  useEffect(() => {
    const activeFolder = folders.find((f) => f.id === activeFolderId);
    const folderOverride = activeFolder?.theme || (activeFolderId ? folderThemes[activeFolderId] : null);
    const currentThemeId = folderOverride || activeAestheticTheme;
    const activeTheme = themes[currentThemeId] || themes['bloom-v2'] || themes.caramel;
    applyTheme(activeTheme);
  }, [activeFolderId, activeAestheticTheme, folderThemes, folders]);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden relative transition-colors duration-300 text-[var(--color-text,#1B2420)] select-none bg-[var(--bone,#EFE9DC)]"
    >
      <ConfettiPortal />
      <ShortcutsModal />
      <ClickSpark
        sparkColor="var(--color-accent, #A8491F)"
        sparkSize={8}
        sparkRadius={14}
        sparkCount={6}
        duration={350}
        easing="ease-out"
        extraScale={1}
      />

      {/* 1. Left Icon Rail (64px, Dark Forest Ink #1B2420 from Bloom v2) */}
      <IconRail
        onOpenStorage={() => setShowStorageModal(true)}
        onFocusSearch={() => {
          const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
          if (searchInput) searchInput.focus();
        }}
      />

      {/* 2. Folders & Worlds Drawer (Slide-Over Overlay Drawer summoned on demand) */}
      <div
        className={`fixed inset-y-0 left-16 z-40 transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarCollapsed ? '-translate-x-[110%] pointer-events-none' : 'translate-x-0'
        }`}
      >
        <Sidebar onCloseMobile={toggleSidebarCollapsed} />
      </div>

      {/* Gentle Backdrop for drawer dismissal */}
      {!sidebarCollapsed && (
        <div
          onClick={toggleSidebarCollapsed}
          className="fixed inset-0 left-16 bg-black/25 backdrop-blur-2xs z-35 animate-fade-in cursor-pointer"
          title="Click to dismiss collections drawer"
        />
      )}

      {/* 3. Main Workspace Canvas (Spacious, Classy, Perfectly Centered) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[var(--bone,#EFE9DC)]">
        <MainCanvas />
      </div>

      <DeviceStorageModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
      />
    </div>
  );
};

export default AppLayout;
