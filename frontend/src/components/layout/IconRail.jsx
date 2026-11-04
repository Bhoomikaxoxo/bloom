import React from 'react';
import useSlateStore from '../../store/useSlateStore';
import {
  Clock, Search, CalendarDays, LayoutGrid, BookOpen,
  FolderTree, ShieldCheck, Flame, Layers
} from 'lucide-react';

const IconRail = ({ onOpenStorage, onFocusSearch }) => {
  const {
    workspaceView,
    setWorkspaceView,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    followThroughStreak = 1,
    setActiveFolderId,
    setActiveTagId,
    setShowTrash,
    setShowFavorites,
  } = useSlateStore();

  const handleNav = (view) => {
    setActiveFolderId(null);
    setActiveTagId(null);
    setShowTrash(false);
    setShowFavorites(false);
    setWorkspaceView(view);
  };

  return (
    <aside
      className="w-16 flex-shrink-0 bg-[#1B2420] text-[#8A9A82] flex flex-col items-center py-5 select-none z-30 transition-colors shadow-md"
      aria-label="Bloom Navigation Rail"
    >
      {/* 1. Bloom v2 Gold & Brick Flame Mark */}
      <div
        onClick={() => handleNav('spine')}
        className="cursor-pointer mb-5 p-1 hover:scale-110 transition-transform"
        title="Bloom — Return to Daily Flow"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C12 3 8 6 8 10.5C8 13 9.8 15 12 15C14.2 15 16 13 16 10.5C16 6 12 3 12 3Z"
            fill="#C9A135"
          />
          <path
            d="M12 21C12 21 15 18.5 15 15.5C15 13.5 13.6 12 12 12C10.4 12 9 13.5 9 15.5C9 18.5 12 21 12 21Z"
            fill="#A8491F"
          />
        </svg>
      </div>

      {/* 2. Core Navigation Icons */}
      <nav className="flex flex-col items-center gap-3 w-full px-2">
        {/* Today / Daily Flow */}
        <button
          type="button"
          onClick={() => handleNav('spine')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            workspaceView === 'spine'
              ? 'bg-[#C9A135]/20 text-[#C9A135]'
              : 'hover:text-[#EFE9DC] hover:bg-white/[0.06]'
          }`}
          title="Daily Flow"
        >
          <Clock className="w-5 h-5 stroke-[1.7]" />
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onFocusSearch}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:text-[#EFE9DC] hover:bg-white/[0.06] cursor-pointer"
          title="Search (⌘K)"
        >
          <Search className="w-5 h-5 stroke-[1.7]" />
        </button>

        {/* Calendar & Planner */}
        <button
          type="button"
          onClick={() => handleNav('calendar')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            workspaceView === 'calendar'
              ? 'bg-[#C9A135]/20 text-[#C9A135]'
              : 'hover:text-[#EFE9DC] hover:bg-white/[0.06]'
          }`}
          title="Calendar & Planner"
        >
          <CalendarDays className="w-5 h-5 stroke-[1.7]" />
        </button>

        {/* Everything / Desk Canvas */}
        <button
          type="button"
          onClick={() => handleNav('canvas')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            workspaceView === 'canvas'
              ? 'bg-[#C9A135]/20 text-[#C9A135]'
              : 'hover:text-[#EFE9DC] hover:bg-white/[0.06]'
          }`}
          title="Desk Canvas (All Notes & Tasks)"
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.7]" />
        </button>

        {/* Daily Journal */}
        <button
          type="button"
          onClick={() => handleNav('journal')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            workspaceView === 'journal'
              ? 'bg-[#C9A135]/20 text-[#C9A135]'
              : 'hover:text-[#EFE9DC] hover:bg-white/[0.06]'
          }`}
          title="Daily Journal & Notebook"
        >
          <BookOpen className="w-5 h-5 stroke-[1.7]" />
        </button>

        <div className="w-6 h-px bg-white/10 my-1" />

        {/* Folders & Worlds Drawer Toggle */}
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            !sidebarCollapsed
              ? 'bg-white/10 text-[#EFE9DC]'
              : 'hover:text-[#EFE9DC] hover:bg-white/[0.06]'
          }`}
          title={sidebarCollapsed ? "Open Collections & Folders" : "Collapse Folders Drawer"}
        >
          <FolderTree className="w-5 h-5 stroke-[1.7]" />
        </button>
      </nav>

      {/* 3. Spacer */}
      <div className="flex-1" />

      {/* 4. Bottom Streak Circle (From Bloom v2) */}
      <button
        type="button"
        onClick={onOpenStorage}
        className="w-[38px] h-[38px] rounded-full border-2 border-[#6B7F63] hover:border-[#C9A135] flex items-center justify-center text-[10.5px] font-sans font-semibold text-[#EFE9DC] transition-all cursor-pointer group"
        title={`Follow-through streak: ${followThroughStreak} days. Click to view on-device storage.`}
      >
        <span className="group-hover:scale-105 transition-transform">
          {followThroughStreak}/7
        </span>
      </button>
    </aside>
  );
};

export default IconRail;
