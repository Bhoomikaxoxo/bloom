import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import NoteCard from '../notes/NoteCard';
import NoteEditor from '../notes/NoteEditor';
import JournalPanel from './JournalPanel';
import CalendarView from '../calendar/CalendarView';
import ThemeSwitcher from './ThemeSwitcher';
import {
  Search, Plus, Sparkles, BookOpen, Columns, FileText,
  ArrowDownUp, Clock, ArrowUpAZ, Palette, LayoutGrid, Layers,
  CheckSquare, CalendarDays, X, Check, Coffee, Sun, Moon
} from 'lucide-react';
import { CloudDoodle, MemoryBoxDoodle, EmptyNotesDoodle } from '../ui/Doodles';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: Clock },
  { value: 'oldest', label: 'Oldest First', icon: Clock },
  { value: 'az', label: 'Title (A → Z)', icon: ArrowUpAZ },
  { value: 'color', label: 'Note Color', icon: Palette },
];

const MainCanvas = () => {
  const {
    notes,
    folders,
    tags,
    activeFolderId,
    activeTagId,
    searchQuery,
    viewMode,
    showTrash,
    showFavorites,
    showCalendar,
    setShowCalendar,
    sortMode,
    openNoteId,
    setSearchQuery,
    addNote,
    emptyTrash,
    journalViewMode,
    setJournalViewMode,
    setViewMode,
    setSortMode,
    setOpenNoteId,
    setActiveFolderId,
    setActiveTagId,
  } = useSlateStore();

  const [cardFilter, setCardFilter] = useState('all'); // 'all' | 'pinned' | 'checklist' | 'text'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const boardConstraintsRef = useRef(null);
  const searchRef = useRef(null);

  // Close sort dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      const tag = document.activeElement?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;

      if (meta && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (meta && e.shiftKey && (e.key === 'N' || e.key === 'n') && !openNoteId) {
        e.preventDefault();
        const id = addNote('checklist');
        setOpenNoteId(id);
        return;
      }

      if (meta && !e.shiftKey && (e.key === 'n' || e.key === 'N') && !openNoteId && !isInput) {
        e.preventDefault();
        const id = addNote('text');
        setOpenNoteId(id);
        return;
      }

      if (!isInput && !meta && !openNoteId) {
        if (e.key === 'g' || e.key === 'G') {
          setViewMode('grid');
          setShowCalendar(false);
        } else if (e.key === 'b' || e.key === 'B') {
          setViewMode('board');
          setShowCalendar(false);
        } else if (e.key === 'p' || e.key === 'P') {
          setShowCalendar(!showCalendar);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addNote, setOpenNoteId, openNoteId, setViewMode, showCalendar, setShowCalendar]);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    if (showTrash) {
      if (note.deletedAt === null) return false;
    } else {
      if (note.deletedAt !== null) return false;
    }
    if (showFavorites && !note.isFavorite) return false;
    if (activeFolderId && note.folderId !== activeFolderId) return false;
    if (activeTagId && !note.tags?.includes(activeTagId)) return false;

    if (cardFilter === 'pinned' && !note.isPinned) return false;
    if (cardFilter === 'checklist' && note.type !== 'checklist') return false;
    if (cardFilter === 'text' && note.type !== 'text') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = note.title?.toLowerCase().includes(q);
      let bodyMatch = false;
      if (note.type === 'text') bodyMatch = (note.content || note.richText || '').toLowerCase().includes(q);
      else if (note.type === 'checklist') bodyMatch = note.checklist?.some((i) => i.text.toLowerCase().includes(q));
      if (!titleMatch && !bodyMatch) return false;
    }
    return true;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortMode) {
      case 'oldest': return a.createdAt - b.createdAt;
      case 'az': return (a.title || '').localeCompare(b.title || '');
      case 'color': return (a.colorIndex || 1) - (b.colorIndex || 1);
      case 'newest':
      default: return b.updatedAt - a.updatedAt;
    }
  });

  const pinnedNotes = sortedNotes.filter((n) => n.isPinned);
  const unpinnedNotes = sortedNotes.filter((n) => !n.isPinned);

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const activeTag = tags.find((t) => t.id === activeTagId);
  const openNote = notes.find((n) => n.id === openNoteId);

  // Active Workspace Mode
  const activeWorkspaceMode = showCalendar
    ? 'calendar'
    : journalViewMode === 'journal'
    ? 'journal'
    : journalViewMode === 'both'
    ? 'split'
    : 'notes';

  const handleSetWorkspaceMode = (mode) => {
    if (mode === 'calendar') {
      setShowCalendar(true);
    } else if (mode === 'journal') {
      setShowCalendar(false);
      setJournalViewMode('journal');
    } else if (mode === 'split') {
      setShowCalendar(false);
      setJournalViewMode('both');
    } else {
      setShowCalendar(false);
      setJournalViewMode('notes');
    }
  };

  const handleCreateNote = useCallback((type = 'text') => {
    const id = addNote(type);
    setOpenNoteId(id);
  }, [addNote, setOpenNoteId]);

  const showJournal = journalViewMode === 'both' || journalViewMode === 'journal';
  const showNotes = journalViewMode === 'both' || journalViewMode === 'notes';

  // Greeting & Date formatting
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', Icon: Sun, emoji: '🌱' };
    if (hour < 18) return { text: 'Good afternoon', Icon: Coffee, emoji: '☀️' };
    return { text: 'Good evening', Icon: Moon, emoji: '✨' };
  };

  const greeting = getGreetingData();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Calculate task completion stats
  const allTasks = notes
    .filter((n) => n.deletedAt === null && n.type === 'checklist')
    .flatMap((n) => n.checklist || []);
  const completedTasks = allTasks.filter((t) => t.done).length;
  const totalTasks = allTasks.length;

  const currentViewTitle = showCalendar
    ? 'Calendar & Planner'
    : showTrash
    ? 'Memory Box'
    : showFavorites
    ? 'Favorites'
    : activeFolder
    ? activeFolder.name
    : activeTag
    ? `#${activeTag.name}`
    : 'All Notes';

  const currentViewIcon = showCalendar
    ? '🗓️'
    : showTrash
    ? '📦'
    : showFavorites
    ? '⭐'
    : activeFolder
    ? activeFolder.icon
    : activeTag
    ? '🏷️'
    : '🌸';

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors">
      {/* =========================================================================
          TOP NAVIGATION BAR: 3 Balanced Zones (Context, Omni-Search, Ergonomics)
          ========================================================================= */}
      <header className="h-16 px-5 sm:px-6 border-b border-black/[0.08] dark:border-white/[0.08] bg-[var(--color-sidebar-bg)] backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0 z-20">
        
        {/* Zone 1 (Left): View Title & Filter Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl flex-shrink-0">{currentViewIcon}</span>
          <div className="flex items-center gap-2 truncate">
            <h2 className="text-sm sm:text-base font-bold text-[var(--color-text)] truncate">
              {currentViewTitle}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[var(--color-text-muted)] flex-shrink-0">
              {filteredNotes.length}
            </span>

            {/* Clear Filter Chip if active */}
            {(activeFolderId || activeTagId) && (
              <button
                onClick={() => {
                  setActiveFolderId(null);
                  setActiveTagId(null);
                }}
                className="hidden md:flex items-center gap-1 text-[10px] font-semibold text-[var(--color-text-muted)] hover:text-red-500 bg-black/[0.03] dark:bg-white/[0.06] hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                title="Clear current folder/tag filter"
              >
                <span>Clear filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 2 (Center): Omni-Search Bar */}
        <div className="relative w-48 sm:w-64 md:w-72 max-w-sm flex-shrink">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search notes, tasks… (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] text-[var(--color-text)] rounded-full text-xs font-medium outline-none border border-black/[0.06] dark:border-white/[0.08] focus:border-[var(--color-accent)] focus:bg-[var(--color-card-bg)] transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Zone 3 (Right): Symmetrical Workspace Modes & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Workspace Mode Switcher (Unified 4-Way Segmented Control) */}
          <div className="hidden sm:flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            {[
              { id: 'notes', label: 'Notes', Icon: FileText, title: 'Notes Canvas' },
              { id: 'journal', label: 'Journal', Icon: BookOpen, title: 'Daily Stationery Journal' },
              { id: 'calendar', label: 'Planner', Icon: CalendarDays, title: 'Calendar & Daily Agenda' },
              { id: 'split', label: 'Split', Icon: Columns, title: 'Side-by-Side View' },
            ].map(({ id, label, Icon, title }) => {
              const isActive = activeWorkspaceMode === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSetWorkspaceMode(id)}
                  title={title}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-[var(--color-text)] shadow-xs font-bold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] opacity-80 hover:opacity-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--color-accent)]' : ''}`} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Aesthetic Color Palette Popover */}
          <ThemeSwitcher />

          {/* Primary Action Buttons */}
          {!showTrash && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCreateNote('text')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)] hover:opacity-95 text-white rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Create a new note (⌘N)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>
              <button
                onClick={() => handleCreateNote('checklist')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--color-text)] hover:bg-black/[0.06] rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
                title="Create a new checklist (⇧⌘N)"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Checklist</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          WORKSPACE CANVAS BODY
          ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {showCalendar ? (
          <CalendarView />
        ) : (
          <>
            {showJournal && <JournalPanel />}

            {showNotes && (
              <div className="flex-1 overflow-auto bg-notebook-grid relative p-5 sm:p-7">
                <div className={viewMode === 'grid' || showTrash ? 'max-w-6xl mx-auto w-full' : ''}>
                  
                  {/* ===================================================================
                      DAILY GROUNDING BANNER (Psychological Orientation & Daily Anchor)
                      Only appears in Notes / Split views when not searching or in trash
                      =================================================================== */}
                  {!showTrash && !searchQuery.trim() && (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Gentle greeting & mindful status */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-accent-bg)] text-[var(--color-accent)] flex items-center justify-center flex-shrink-0 shadow-2xs text-lg">
                          {greeting.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
                              {greeting.text}, welcome back
                            </h3>
                            <span className="text-xs text-[var(--color-text-muted)] font-medium">·</span>
                            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                              {todayFormatted}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-muted)]">
                            <span>{filteredNotes.length} notes in view</span>
                            {totalTasks > 0 && (
                              <>
                                <span>•</span>
                                <span>{completedTasks}/{totalTasks} tasks complete</span>
                              </>
                            )}
                            <span>•</span>
                            <span className="text-[var(--color-accent)] font-medium">Device secured</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick-jump flow chips */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleCreateNote('text')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-[var(--color-text)] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                          <span>Quick Capture</span>
                        </button>
                        <button
                          onClick={() => handleSetWorkspaceMode('journal')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-[var(--color-text)] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                          <span>Today's Journal</span>
                        </button>
                        <button
                          onClick={() => handleSetWorkspaceMode('calendar')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-[var(--color-text)] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
                        >
                          <CalendarDays className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                          <span>Daily Planner</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ===================================================================
                      SECONDARY CONTROLS SUB-BAR (Filter Chips, Sort, & Layout Switch)
                      =================================================================== */}
                  {!showTrash && filteredNotes.length > 0 && (
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      {/* Left: Quick Content Filter Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { id: 'all', label: `All (${notes.filter((n) => n.deletedAt === null).length})` },
                          { id: 'pinned', label: `📌 Pinned (${pinnedNotes.length})`, disabled: pinnedNotes.length === 0 },
                          { id: 'checklist', label: '☑️ Checklists' },
                          { id: 'text', label: '📝 Notes' },
                        ].map(({ id, label, disabled }) => (
                          <button
                            key={id}
                            disabled={disabled}
                            onClick={() => setCardFilter(id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              cardFilter === id
                                ? 'bg-[var(--color-accent)] text-white shadow-2xs font-bold'
                                : 'bg-black/[0.03] dark:bg-white/[0.05] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/[0.06]'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Right: Sort Dropdown & Grid/Board Toggle */}
                      <div className="flex items-center gap-2 ml-auto">
                        {/* Sort Selector Dropdown */}
                        <div className="relative" ref={sortDropdownRef}>
                          <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-[var(--color-text)] hover:bg-black/[0.06] transition-colors cursor-pointer"
                            title="Sort Notes"
                          >
                            <ArrowDownUp className="w-3 h-3 opacity-60" />
                            <span className="text-[11px] font-semibold">{SORT_OPTIONS.find((s) => s.value === sortMode)?.label}</span>
                          </button>

                          {showSortDropdown && (
                            <div className="absolute right-0 top-full mt-1.5 w-36 bg-[var(--color-card-bg)] rounded-xl border border-black/10 dark:border-white/10 shadow-lg py-1 z-30 animate-fade-in">
                              {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                                <button
                                  key={value}
                                  onClick={() => {
                                    setSortMode(value);
                                    setShowSortDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer flex items-center justify-between ${
                                    sortMode === value ? 'font-bold text-[var(--color-accent)]' : 'text-[var(--color-text)]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-3 h-3 opacity-60" />
                                    <span>{label}</span>
                                  </div>
                                  {sortMode === value && <Check className="w-3 h-3 text-[var(--color-accent)]" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* View Switcher: Neat Grid vs Freeform Board */}
                        <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-full transition-all cursor-pointer ${
                              viewMode === 'grid'
                                ? 'bg-white dark:bg-slate-700 text-[var(--color-accent)] shadow-2xs'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Neat Grid View (G)"
                          >
                            <LayoutGrid className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-full transition-all cursor-pointer ${
                              viewMode === 'board'
                                ? 'bg-white dark:bg-slate-700 text-[var(--color-accent)] shadow-2xs'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Freeform Canvas Board (B) - drag notes anywhere"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===================================================================
                      MEMORY BOX (TRASH) BANNER
                      =================================================================== */}
                  {showTrash && (
                    <div className="mb-6 p-4 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📦</span>
                        <div>
                          <h3 className="text-sm font-bold text-[var(--color-text)]">Memory Box</h3>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            Deleted notes are safely retained here on your device. Items older than 30 days are purged automatically.
                          </p>
                        </div>
                      </div>
                      {filteredNotes.length > 0 && (
                        <button
                          onClick={() => {
                            if (confirm('Permanently delete all notes in Memory Box?')) emptyTrash();
                          }}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          Empty Box
                        </button>
                      )}
                    </div>
                  )}

                  {/* ===================================================================
                      EMPTY STATE (Meaningful & Encouraging)
                      =================================================================== */}
                  {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                      <div className="relative mb-5 flex items-center justify-center">
                        {showTrash ? (
                          <MemoryBoxDoodle className="w-24 h-24" />
                        ) : searchQuery.trim() ? (
                          <CloudDoodle className="w-20 h-14" />
                        ) : (
                          <EmptyNotesDoodle className="w-24 h-24" />
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[var(--color-text)] mb-1.5">
                        {showTrash
                          ? 'Memory Box is empty 🌸'
                          : searchQuery.trim()
                          ? 'No matching notes found'
                          : 'Your desk is clean and peaceful ✨'}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] max-w-xs leading-relaxed mb-5">
                        {showTrash
                          ? 'Deleted notes will appear here.'
                          : searchQuery.trim()
                          ? 'Try searching with another keyword or tag.'
                          : 'Click below or press ⌘N to start writing your first note or daily list.'}
                      </p>
                      {!showTrash && !searchQuery.trim() && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCreateNote('text')}
                            className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-full text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                          >
                            + Create Note
                          </button>
                          <button
                            onClick={() => handleCreateNote('checklist')}
                            className="px-4 py-2 bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text)] border border-black/10 dark:border-white/10 rounded-full text-xs font-bold hover:bg-black/[0.08] transition-all cursor-pointer"
                          >
                            + Checklist
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ===================================================================
                      NOTES DISPLAY (Grid vs Freeform Board)
                      =================================================================== */}
                  {sortedNotes.length > 0 && (
                    viewMode === 'grid' || showTrash ? (
                      <div className="space-y-7">
                        {/* Pinned Section: Noticeboard Shelf with Elevated Visual Hierarchy */}
                        {pinnedNotes.length > 0 && !showTrash && cardFilter !== 'checklist' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>Pinned for Focus ({pinnedNotes.length})</span>
                              </div>
                              <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                                Stays at top of desk
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {pinnedNotes.map((note) => (
                                <NoteCard key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Other Notes Section */}
                        {unpinnedNotes.length > 0 && (
                          <div className="space-y-3">
                            {pinnedNotes.length > 0 && !showTrash && cardFilter === 'all' && (
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                                  Notes Desk ({unpinnedNotes.length})
                                </span>
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {unpinnedNotes.map((note) => (
                                <NoteCard key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
                              ))}

                              {/* Integrated Quick-Add Card when 1 or 2 notes exist */}
                              {!showTrash && unpinnedNotes.length <= 2 && (
                                <button
                                  onClick={() => handleCreateNote('text')}
                                  className="min-h-[220px] rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-[var(--color-accent)] p-6 flex flex-col items-center justify-center text-center transition-all group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-bg)] text-[var(--color-accent)] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-2xs">
                                    <Plus className="w-4 h-4" />
                                  </div>
                                  <h4 className="font-semibold text-xs text-[var(--color-text)]">New Note or List</h4>
                                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Click to plan or capture thoughts</p>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Freeform Canvas Board */
                      <div ref={boardConstraintsRef} className="w-[2000px] h-[1200px] relative select-none">
                        {sortedNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            isDraggable
                            dragConstraints={boardConstraintsRef}
                            onOpen={() => setOpenNoteId(note.id)}
                          />
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full Note Editor Modal */}
      <AnimatePresence>
        {openNote && (
          <NoteEditor key={openNote.id} note={openNote} onClose={() => setOpenNoteId(null)} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default MainCanvas;
