import React, { useState, useRef, useEffect } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { THEMES, TAG_COLOR_MAP } from '../../utils/theme-config';
import BloomLogo from '../ui/BloomLogo';
import EmojiPickerPopover from '../ui/EmojiPickerPopover';
import DeviceStorageModal from '../ui/DeviceStorageModal';
import {
  Plus, Star, FileText, Trash2, HelpCircle, CheckSquare,
  CalendarDays, ShieldCheck, Compass, LayoutGrid, BookOpen,
  X, Check, Flame, ChevronRight
} from 'lucide-react';

const Sidebar = ({ onCloseMobile }) => {
  const {
    folders,
    tags,
    activeFolderId,
    activeTagId,
    showTrash,
    showFavorites,
    showCalendar,
    workspaceView,
    setWorkspaceView,
    setAestheticTheme,
    calendarEvents = [],
    folderThemes,
    setActiveFolderId,
    setActiveTagId,
    setShowTrash,
    setShowFavorites,
    setShowCalendar,
    addFolder,
    deleteFolder,
    updateFolder,
    setFolderTheme,
    addTag,
    deleteTag,
    notes,
    followThroughStreak = 1,
  } = useSlateStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderTheme, setNewFolderTheme] = useState('matcha');
  const [showAddFolder, setShowAddFolder] = useState(false);

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('pink');
  const [showAddTag, setShowAddTag] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  const [themeMenuFolderId, setThemeMenuFolderId] = useState(null);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuFolderId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeNotesCount = notes.filter((n) => n.deletedAt === null).length;
  const favoritesCount = notes.filter((n) => n.isFavorite && n.deletedAt === null).length;
  const deletedNotesCount = notes.filter((n) => n.deletedAt !== null).length;

  const handleAddFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim(), newFolderTheme);
      setNewFolderName('');
      setShowAddFolder(false);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setShowAddTag(false);
    }
  };

  const selectView = (type, id = null) => {
    if (type === 'spine') {
      setWorkspaceView('spine');
      setActiveFolderId(null);
      setActiveTagId(null);
      setShowTrash(false);
      setShowFavorites(false);
    } else if (type === 'canvas') {
      setWorkspaceView('canvas');
      setActiveFolderId(null);
      setActiveTagId(null);
      setShowTrash(false);
      setShowFavorites(false);
    } else if (type === 'calendar') {
      setWorkspaceView('calendar');
      setShowTrash(false);
      setShowFavorites(false);
    } else if (type === 'favorites') {
      setWorkspaceView('canvas');
      setShowFavorites(true);
      setShowTrash(false);
      setActiveFolderId(null);
      setActiveTagId(null);
    } else if (type === 'folder') {
      const folder = folders.find((f) => f.id === id);
      const folderTheme = folder?.theme || folderThemes?.[id];
      setActiveFolderId(id);
      setActiveTagId(null);
      setShowTrash(false);
      setShowFavorites(false);
      setWorkspaceView('canvas');
      if (folderTheme && setAestheticTheme) {
        setAestheticTheme(folderTheme);
      }
    } else if (type === 'tag') {
      setActiveTagId(id);
      setActiveFolderId(null);
      setShowTrash(false);
      setShowFavorites(false);
      setWorkspaceView('canvas');
    } else if (type === 'trash') {
      setShowTrash(true);
      setShowFavorites(false);
      setWorkspaceView('canvas');
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#F8F6F1] dark:bg-[#1E1B18] border-r border-[#E8E3D8] dark:border-[#38332E] p-4 flex flex-col h-screen overflow-y-auto select-none transition-colors">
      {/* 1. Bespoke Brand Logo Header */}
      <div className="px-1 pt-1 pb-4 mb-3 border-b border-[#E8E3D8] dark:border-[#38332E]">
        <BloomLogo onClick={() => selectView('spine')} />
      </div>

      {/* 2. Core Cognitive Lenses (Attention Spine / Canvas / Calendar) */}
      <div className="mb-4 space-y-1">
        {/* Daily Flow (Attention Spine) */}
        <button
          onClick={() => selectView('spine')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            workspaceView === 'spine' && !showTrash && !showFavorites && !activeFolderId && !activeTagId
              ? 'bg-[#FDF4EF] text-[#C2531C] font-bold shadow-2xs border border-[#F2DDD1]'
              : 'text-[#1F1D1A] dark:text-[#E8E3D8] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#C2531C]" />
            <span>Daily Flow</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#C2531C] border border-[#EBDCBF]">
            <Flame className="w-2.5 h-2.5 text-[#C2531C] fill-[#C2531C]" />
            {followThroughStreak}d
          </span>
        </button>

        {/* Desk Canvas (Macro View of all Notes & Checklists) */}
        <button
          onClick={() => selectView('canvas')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            workspaceView === 'canvas' && !showTrash && !showFavorites && !activeFolderId && !activeTagId
              ? 'bg-[#FAF5EE] text-[#7D5E29] font-bold shadow-2xs border border-[#EBDCBF]'
              : 'text-[#1F1D1A] dark:text-[#E8E3D8] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4 opacity-75" />
            <span>Desk Canvas</span>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] opacity-75">
            {activeNotesCount}
          </span>
        </button>

        {/* Calendar & Planner */}
        <button
          onClick={() => selectView('calendar')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            workspaceView === 'calendar'
              ? 'bg-[#F0F5F2] text-[#244A38] font-bold shadow-2xs border border-[#C7D9CF]'
              : 'text-[#1F1D1A] dark:text-[#E8E3D8] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-[#244A38]" />
            <span>Calendar &amp; Planner</span>
          </div>
          {calendarEvents.length > 0 && (
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] opacity-75">
              {calendarEvents.length}
            </span>
          )}
        </button>

        {/* Pinned & Favorites */}
        <button
          onClick={() => selectView('favorites')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            showFavorites
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold shadow-2xs border border-amber-200'
              : 'text-[#1F1D1A] dark:text-[#E8E3D8] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Favorites</span>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] opacity-75">
            {favoritesCount}
          </span>
        </button>
      </div>

      {/* 3. Folders & Worlds (Each Folder With Its Own Color/Theme) */}
      <div className="mb-5">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-sans font-bold text-[#6B665F] tracking-wider uppercase">
            Folders &amp; Worlds
          </span>
          <button
            onClick={() => setShowAddFolder(!showAddFolder)}
            className="p-1 rounded-md text-[#6B665F] hover:text-[#C2531C] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Create Folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Folder Form */}
        {showAddFolder && (
          <form onSubmit={handleAddFolder} className="mb-2.5 p-2.5 bg-white dark:bg-slate-800 border border-[#E8E3D8] dark:border-[#38332E] rounded-xl shadow-xs space-y-2">
            <input
              type="text"
              placeholder="Folder name…"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              className="w-full text-xs bg-transparent outline-none px-1 text-[#1F1D1A] dark:text-[#E8E3D8] placeholder:text-stone-400"
            />
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-[10px] font-medium text-[#6B665F]">Color:</span>
              <div className="flex items-center gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNewFolderTheme(t.id)}
                    className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                      newFolderTheme === t.id ? 'scale-125 ring-2 ring-black/40' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: t.accentColor }}
                    title={t.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setShowAddFolder(false)}
                className="px-2 py-0.5 text-[11px] text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newFolderName.trim()}
                className="px-2.5 py-0.5 bg-[#C2531C] text-white text-[11px] font-bold rounded-lg hover:opacity-90 disabled:opacity-40 cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Folder List with Custom Theme Swatch */}
        <div className="space-y-0.5">
          {folders.map((folder) => {
            const count = notes.filter((n) => n.folderId === folder.id && n.deletedAt === null).length;
            const isSelected = activeFolderId === folder.id && !showTrash && !showFavorites && workspaceView === 'canvas';
            const assignedThemeId = folder.theme || folderThemes?.[folder.id] || 'caramel';
            const assignedTheme = THEMES.find((t) => t.id === assignedThemeId) || THEMES[0];

            return (
              <div
                key={folder.id}
                className={`group relative flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#282420] text-[#1F1D1A] dark:text-[#E8E3D8] font-bold shadow-xs border border-[#E8E3D8] dark:border-[#38332E]'
                    : 'text-[#1F1D1A] dark:text-[#E8E3D8] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
                onClick={() => selectView('folder', folder.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <EmojiPickerPopover
                    currentEmoji={folder.icon}
                    onSelectEmoji={(emoji) => updateFolder(folder.id, { icon: emoji })}
                  />
                  <span className="truncate">{folder.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Theme swatch dot */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThemeMenuFolderId(themeMenuFolderId === folder.id ? null : folder.id);
                      }}
                      className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/20 transition-transform hover:scale-125 cursor-pointer shadow-xs"
                      style={{ backgroundColor: assignedTheme.accentColor }}
                      title={`Theme: ${assignedTheme.name} (Click to change)`}
                    />

                    {/* Folder Theme Switcher Popover */}
                    {themeMenuFolderId === folder.id && (
                      <div
                        ref={themeMenuRef}
                        className="absolute right-0 top-full mt-1.5 p-2 bg-white dark:bg-slate-800 border border-[#E8E3D8] rounded-xl shadow-lg z-50 flex items-center gap-1.5 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {THEMES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setFolderTheme(folder.id, t.id);
                              updateFolder(folder.id, { theme: t.id });
                              if (setAestheticTheme) setAestheticTheme(t.id);
                              setThemeMenuFolderId(null);
                            }}
                            className={`w-4 h-4 rounded-full transition-transform hover:scale-125 cursor-pointer ${
                              assignedThemeId === t.id ? 'scale-125 ring-2 ring-black/40' : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: t.accentColor }}
                            title={t.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-mono opacity-60 px-1 py-0.2 rounded-full">
                    {count}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${folder.name}"? Notes inside will stay in All Notes.`)) {
                        deleteFolder(folder.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-red-500 rounded transition-opacity"
                    title="Delete folder"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Tags Section (Refined, Non-Clunky Inline Capture) */}
      <div className="mb-5">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-sans font-bold text-[#6B665F] tracking-wider uppercase">
            Tags
          </span>
          <button
            onClick={() => setShowAddTag(!showAddTag)}
            className="p-1 rounded-md text-[#6B665F] hover:text-[#C2531C] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Create Tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Refined Add Tag Form */}
        {showAddTag && (
          <form onSubmit={handleAddTag} className="mb-2.5 p-2 bg-white dark:bg-slate-800 border border-[#E8E3D8] rounded-xl shadow-xs space-y-2">
            <input
              type="text"
              placeholder="Tag name…"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              autoFocus
              className="w-full text-xs bg-transparent outline-none px-1 text-[#1F1D1A] placeholder:text-stone-400"
            />
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-[10px] font-medium text-[#6B665F]">Color:</span>
              <div className="flex items-center gap-1.5">
                {['pink', 'lavender', 'mint', 'amber', 'sky'].map((colorName) => {
                  const item = TAG_COLOR_MAP[colorName];
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => setNewTagColor(colorName)}
                      className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                        newTagColor === colorName ? 'scale-125 ring-2 ring-black/40' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: item.dot }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setShowAddTag(false)}
                className="px-2 py-0.5 text-[11px] text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTagName.trim()}
                className="px-2.5 py-0.5 bg-[#C2531C] text-white text-[11px] font-bold rounded-lg hover:opacity-90 disabled:opacity-40 cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.map((tag) => {
            const count = notes.filter((n) => n.tags?.includes(tag.id) && n.deletedAt === null).length;
            const isSelected = activeTagId === tag.id && !showTrash && !showFavorites && workspaceView === 'canvas';
            const styleConfig = TAG_COLOR_MAP[tag.color] || TAG_COLOR_MAP.lavender;

            return (
              <button
                key={tag.id}
                onClick={() => selectView('tag', tag.id)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C2531C] text-white border-[#C2531C] shadow-xs font-bold'
                    : styleConfig.badge
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : styleConfig.dot }}
                />
                <span>#{tag.name}</span>
                <span className={`text-[10px] px-1 rounded-full font-mono ${isSelected ? 'bg-white/20' : 'bg-black/5 dark:bg-white/10'}`}>
                  {count}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTag(tag.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-xs hover:text-red-500 ml-0.5"
                  title="Delete tag"
                >
                  ×
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer to push controls to bottom */}
      <div className="flex-1" />

      {/* 5. Memory Box, Local Storage Health, & Shortcuts */}
      <div className="pt-3 border-t border-[#E8E3D8] dark:border-[#38332E] space-y-2">
        {/* Memory Box / Trash */}
        <button
          onClick={() => selectView('trash')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            showTrash
              ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
              : 'text-[#1F1D1A] opacity-70 hover:opacity-100 hover:bg-black/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 opacity-70" />
            <span>Memory Box</span>
          </div>
          {deletedNotesCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-200 text-rose-800">
              {deletedNotesCount}
            </span>
          )}
        </button>

        {/* Device Local-First Storage (Private to this machine) */}
        <button
          onClick={() => setShowStorageModal(true)}
          className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-[#6B665F] hover:text-[#1F1D1A] flex items-center justify-between cursor-pointer opacity-75 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>On-Device Storage</span>
          </div>
          <span className="text-[10px] font-mono opacity-60">30d auto-purge</span>
        </button>

        {/* Keyboard Shortcuts */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('show-shortcuts'))}
          className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-[#6B665F] hover:text-[#1F1D1A] flex items-center justify-between cursor-pointer opacity-75 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.2 rounded bg-black/[0.06] text-[10px] font-mono">
            ⌘/
          </kbd>
        </button>
      </div>

      <DeviceStorageModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
      />
    </aside>
  );
};

export default Sidebar;
