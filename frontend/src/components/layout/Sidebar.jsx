import React, { useState, useRef, useEffect } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { THEMES, TAG_COLOR_MAP } from '../../utils/theme-config';
import BloomLogo from '../ui/BloomLogo';
import EmojiPickerPopover from '../ui/EmojiPickerPopover';
import DeviceStorageModal from '../ui/DeviceStorageModal';
import {
  Plus, Star, FileText, Trash2, HelpCircle, CheckSquare,
  CalendarDays, ShieldCheck, BookOpen, Sparkles
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
    setShowCalendar,
    calendarEvents = [],
    folderThemes,
    journalViewMode,
    setJournalViewMode,
    setActiveFolderId,
    setActiveTagId,
    setShowTrash,
    setShowFavorites,
    addFolder,
    deleteFolder,
    updateFolder,
    setFolderTheme,
    addTag,
    deleteTag,
    notes,
  } = useSlateStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderTheme, setNewFolderTheme] = useState('matcha');
  const [showAddFolder, setShowAddFolder] = useState(false);

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('lavender');
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

  const allChecklistItems = notes
    .filter((n) => n.deletedAt === null && n.type === 'checklist')
    .flatMap((n) => n.checklist || []);
  const completedTasksCount = allChecklistItems.filter((i) => i.done).length;
  const totalTasksCount = allChecklistItems.length;
  const tasksPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

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
    if (type === 'all') {
      setActiveFolderId(null);
      setActiveTagId(null);
      setShowTrash(false);
      setShowFavorites(false);
      setShowCalendar(false);
      setJournalViewMode('notes');
    } else if (type === 'favorites') {
      setShowFavorites(true);
      setShowCalendar(false);
      setShowTrash(false);
      setActiveFolderId(null);
      setActiveTagId(null);
      setJournalViewMode('notes');
    } else if (type === 'journal') {
      setShowCalendar(false);
      setShowTrash(false);
      setShowFavorites(false);
      setJournalViewMode('journal');
    } else if (type === 'calendar') {
      setShowCalendar(true);
      setShowTrash(false);
      setShowFavorites(false);
    } else if (type === 'folder') {
      setActiveFolderId(id);
      setShowCalendar(false);
      setShowTrash(false);
      setShowFavorites(false);
      setJournalViewMode('notes');
    } else if (type === 'tag') {
      setActiveTagId(id);
      setShowCalendar(false);
      setShowTrash(false);
      setShowFavorites(false);
      setJournalViewMode('notes');
    } else if (type === 'trash') {
      setShowTrash(true);
      setShowCalendar(false);
      setShowFavorites(false);
      setJournalViewMode('notes');
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--color-sidebar-bg)] border-r border-black/[0.08] dark:border-white/[0.08] p-4 flex flex-col h-screen overflow-y-auto select-none transition-colors">
      {/* Brand Header */}
      <div className="px-1 pt-1 pb-4 mb-3 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
        <BloomLogo />
      </div>

      {/* Main Views (All Notes, Favorites, Journal, Calendar) */}
      <div className="mb-4 space-y-1">
        <button
          onClick={() => selectView('all')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            activeFolderId === null && !activeTagId && !showTrash && !showFavorites && !showCalendar && journalViewMode !== 'journal'
              ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] font-bold shadow-2xs'
              : 'text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 opacity-70" />
            <span>All Notes</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] opacity-75">
            {activeNotesCount}
          </span>
        </button>

        <button
          onClick={() => selectView('favorites')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            showFavorites
              ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] font-bold shadow-2xs'
              : 'text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Favorites</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] opacity-75">
            {favoritesCount}
          </span>
        </button>

        <button
          onClick={() => selectView('journal')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            journalViewMode === 'journal' && !showCalendar
              ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] font-bold shadow-2xs'
              : 'text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Daily Journal</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
            Today
          </span>
        </button>

        <button
          onClick={() => selectView('calendar')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            showCalendar
              ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] font-bold shadow-2xs'
              : 'text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Calendar & Planner</span>
          </div>
          {calendarEvents.length > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] opacity-75">
              {calendarEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* Folders Section with Theme World Assignment */}
      <div className="mb-5">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase">
            Folders & Worlds
          </span>
          <button
            onClick={() => setShowAddFolder(!showAddFolder)}
            className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Create Folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Folder Form */}
        {showAddFolder && (
          <form onSubmit={handleAddFolder} className="mb-2.5 p-2 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl shadow-xs space-y-2">
            <input
              type="text"
              placeholder="Folder name…"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              className="w-full text-xs bg-transparent outline-none px-1 text-[var(--color-text)] placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-[10px] font-medium text-[var(--color-text-muted)]">Theme:</span>
              <div className="flex items-center gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNewFolderTheme(t.id)}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      newFolderTheme === t.id ? 'scale-125 ring-2 ring-black/30 dark:ring-white/50' : 'opacity-70 hover:opacity-100'
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
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newFolderName.trim()}
                className="px-2.5 py-1 bg-[var(--color-accent)] text-white text-[11px] font-bold rounded-lg hover:opacity-90 disabled:opacity-40"
              >
                Add Folder
              </button>
            </div>
          </form>
        )}

        {/* Folder List */}
        <div className="space-y-0.5">
          {folders.map((folder) => {
            const count = notes.filter((n) => n.folderId === folder.id && n.deletedAt === null).length;
            const isSelected = activeFolderId === folder.id && !showTrash && !showFavorites;
            const assignedThemeId = folderThemes?.[folder.id] || 'caramel';
            const assignedTheme = THEMES.find((t) => t.id === assignedThemeId) || THEMES[0];

            return (
              <div
                key={folder.id}
                className={`group relative flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] font-bold shadow-2xs'
                    : 'text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
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
                      className="w-3 h-3 rounded-full border border-black/15 dark:border-white/20 transition-transform hover:scale-125 cursor-pointer"
                      style={{ backgroundColor: assignedTheme.accentColor }}
                      title={`Folder Theme: ${assignedTheme.name} (Click to change)`}
                    />

                    {/* Folder Theme Switcher Popover */}
                    {themeMenuFolderId === folder.id && (
                      <div
                        ref={themeMenuRef}
                        className="absolute right-0 top-full mt-1.5 p-2 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl shadow-lg z-50 flex items-center gap-1.5 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {THEMES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setFolderTheme(folder.id, t.id);
                              setThemeMenuFolderId(null);
                            }}
                            className={`w-4 h-4 rounded-full transition-transform hover:scale-125 cursor-pointer ${
                              assignedThemeId === t.id ? 'scale-125 ring-2 ring-black/40 dark:ring-white/60' : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: t.accentColor }}
                            title={t.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] opacity-60 px-1 py-0.5 rounded-full">
                    {count}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${folder.name}"? Notes inside will stay in All Notes.`)) {
                        deleteFolder(folder.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500 rounded transition-opacity"
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

      {/* Colorful Tags Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase">
            Tags
          </span>
          <button
            onClick={() => setShowAddTag(!showAddTag)}
            className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Create Tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Tag Form with Color Picker */}
        {showAddTag && (
          <form onSubmit={handleAddTag} className="mb-2.5 p-2 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl shadow-xs space-y-2">
            <input
              type="text"
              placeholder="Tag name…"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              autoFocus
              className="w-full text-xs bg-transparent outline-none px-1 text-[var(--color-text)] placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-[10px] font-medium text-[var(--color-text-muted)]">Color:</span>
              <div className="flex items-center gap-1.5">
                {['pink', 'lavender', 'mint', 'amber', 'sky'].map((colorName) => {
                  const item = TAG_COLOR_MAP[colorName];
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => setNewTagColor(colorName)}
                      className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                        newTagColor === colorName ? 'scale-125 ring-2 ring-black/30 dark:ring-white/50' : 'opacity-70 hover:opacity-100'
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
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTagName.trim()}
                className="px-2.5 py-1 bg-[var(--color-accent)] text-white text-[11px] font-bold rounded-lg hover:opacity-90 disabled:opacity-40"
              >
                Add Tag
              </button>
            </div>
          </form>
        )}

        {/* Colorful Tag Badges */}
        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.map((tag) => {
            const count = notes.filter((n) => n.tags?.includes(tag.id) && n.deletedAt === null).length;
            const isSelected = activeTagId === tag.id && !showTrash && !showFavorites;
            const styleConfig = TAG_COLOR_MAP[tag.color] || TAG_COLOR_MAP.lavender;

            return (
              <button
                key={tag.id}
                onClick={() => selectView('tag', tag.id)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-xs'
                    : styleConfig.badge
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : styleConfig.dot }}
                />
                <span>#{tag.name}</span>
                <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-black/5 dark:bg-white/10'}`}>
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

      {/* Spacer to push controls down */}
      <div className="flex-1" />

      {/* Bottom Progress & Memory Box */}
      <div className="pt-3 border-t border-black/[0.08] dark:border-white/[0.08] space-y-3">
        {/* Daily Tasks Progress */}
        {totalTasksCount > 0 && (
          <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06]">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <div className="flex items-center gap-1.5 text-[var(--color-text)]">
                <CheckSquare className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Tasks Done</span>
              </div>
              <span className="text-[11px] font-bold text-[var(--color-accent)]">
                {completedTasksCount}/{totalTasksCount} ({tasksPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/[0.06] dark:bg-white/[0.1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                style={{ width: `${tasksPercent}%` }}
              />
            </div>
            {tasksPercent === 100 && (
              <div className="flex items-center gap-1 mt-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>All tasks done today! Great job 🌸</span>
              </div>
            )}
          </div>
        )}

        {/* Memory Box / Trash */}
        <button
          onClick={() => selectView('trash')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
            showTrash
              ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold'
              : 'text-[var(--color-text)] opacity-70 hover:opacity-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 opacity-70" />
            <span>Memory Box</span>
          </div>
          {deletedNotesCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
              {deletedNotesCount}
            </span>
          )}
        </button>

        {/* Device Storage & Privacy */}
        <button
          onClick={() => setShowStorageModal(true)}
          className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center justify-between cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Device Storage</span>
          </div>
          <span className="text-[10px] font-medium opacity-60">Private</span>
        </button>

        {/* Keyboard Shortcuts Hint */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('show-shortcuts'))}
          className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center justify-between cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] text-[10px] font-mono">
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
