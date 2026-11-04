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

  // Global High-Efficiency Keyboard Shortcuts (1-5 view switching, C for quick capture)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('.ProseMirror')
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '1') {
        e.preventDefault();
        useSlateStore.getState().setActiveFolderId(null);
        useSlateStore.getState().setActiveTagId(null);
        useSlateStore.getState().setWorkspaceView('spine');
      } else if (e.key === '2') {
        e.preventDefault();
        const firstFolder = useSlateStore.getState().folders[0]?.id || 'folder-work';
        const targetF = useSlateStore.getState().activeFolderId || firstFolder;
        useSlateStore.getState().setActiveFolderId(targetF);
        useSlateStore.getState().setFolderViewMode('split');
        useSlateStore.getState().setWorkspaceView('split');
      } else if (e.key === '3') {
        e.preventDefault();
        useSlateStore.getState().setActiveFolderId(null);
        useSlateStore.getState().setActiveTagId(null);
        useSlateStore.getState().setWorkspaceView('canvas');
      } else if (e.key === '4') {
        e.preventDefault();
        useSlateStore.getState().setWorkspaceView('calendar');
      } else if (e.key === '5') {
        e.preventDefault();
        useSlateStore.getState().setWorkspaceView('notes');
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        const captureInput = document.querySelector('input[placeholder*="Water the plants"]') ||
                             document.querySelector('input[placeholder*="Search"]');
        if (captureInput) {
          captureInput.focus();
        }
      } else if (e.key === '?') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('show-shortcuts'));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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

      {/* 2. Folders & Worlds Drawer (Collapsible) */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 z-30 ${
          sidebarCollapsed
            ? 'w-0 opacity-0 pointer-events-none'
            : 'w-64 opacity-100'
        } ${
          mobileMenuOpen
            ? 'fixed inset-y-0 left-16 z-40 bg-[var(--bone-dim,#E4DDCC)] shadow-2xl'
            : 'relative'
        }`}
      >
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-35 md:hidden animate-fade-in"
        />
      )}

      {/* 3. Main Workspace Canvas (Spacious, Classy, Focused) */}
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
