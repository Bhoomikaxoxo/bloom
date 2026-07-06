import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainCanvas from './MainCanvas';
import useSlateStore from '../../store/useSlateStore';
import { Menu, X } from 'lucide-react';

const AppLayout = () => {
  const currentTheme = useSlateStore((state) => state.currentTheme);
  const setCurrentTheme = useSlateStore((state) => state.setCurrentTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize theme variable class on body/html
  useEffect(() => {
    setCurrentTheme(currentTheme);
  }, [currentTheme, setCurrentTheme]);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-gradient-to-br from-[var(--color-bg-from)] via-[var(--color-bg-via)] to-[var(--color-bg-to)] transition-all duration-500 ease-in-out text-[var(--color-text)]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden absolute bottom-5 right-5 z-40 bg-purple-500 hover:bg-purple-600 text-white p-3.5 rounded-full shadow-lg transition-transform active:scale-90 border-2 border-white/50 focus:outline-none focus:ring-4 focus:ring-purple-300"
        title="Toggle Menu"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
      </button>

      {/* Sidebar Drawer on Mobile / Standard Column on Desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex-shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex`}
      >
        <Sidebar />
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-20 md:hidden animate-fade-in"
        />
      )}

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <MainCanvas />
      </div>
    </div>
  );
};

export default AppLayout;
