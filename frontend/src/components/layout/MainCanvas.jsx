import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import NoteCard from '../notes/NoteCard';
import NoteEditor from '../notes/NoteEditor';
import CalendarView from '../calendar/CalendarView';
import JournalPanel from './JournalPanel';
import DailySpineView from '../spine/DailySpineView';
import ThemeSwitcher from './ThemeSwitcher';
import {
  Search, Plus, Sparkles, FileText, ArrowDownUp, Clock,
  ArrowUpAZ, Palette, LayoutGrid, Layers, CheckSquare,
  CalendarDays, X, Check, Star, Trash2, Compass, BookOpen,
  Folder, Tag, ShieldCheck
} from 'lucide-react';
import { CloudDoodle, MemoryBoxDoodle, EmptyNotesDoodle } from '../ui/Doodles';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: Clock },
  { value: 'oldest', label: 'Oldest First', icon: Clock },
  { value: 'az', label: 'Title (A → Z)', icon: ArrowUpAZ },
  { value: 'color', label: 'Note Color', icon: Palette },
];

const ENERGY_FILTERS = [
  { id: 'all', label: 'All Domains' },
  { id: 'focus', label: 'Deep Focus', dot: '#244A38' },
  { id: 'urgent', label: 'Immediate', dot: '#A63E0F' },
  { id: 'routine', label: 'Routine', dot: '#7D5E29' },
  { id: 'calm', label: 'Sanctuary', dot: '#58446B' },
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
    workspaceView,
    setWorkspaceView,
    sortMode,
    openNoteId,
    setSearchQuery,
    addNote,
    emptyTrash,
    setViewMode,
    setSortMode,
    setOpenNoteId,
    setActiveFolderId,
    setActiveTagId,
  } = useSlateStore();

  const [cardFilter, setCardFilter] = useState('all'); // 'all' | 'pinned' | 'checklist' | 'text'
  const [energyFilter, setEnergyFilter] = useState('all');
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
        if (e.key === '1') {
          setWorkspaceView('spine');
        } else if (e.key === '2') {
          setWorkspaceView('canvas');
        } else if (e.key === '3') {
          setWorkspaceView('calendar');
        } else if (e.key === '4') {
          setWorkspaceView('journal');
        } else if (e.key === 'g' || e.key === 'G') {
          setViewMode('grid');
        } else if (e.key === 'b' || e.key === 'B') {
          setViewMode('board');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addNote, setOpenNoteId, openNoteId, setViewMode, setWorkspaceView]);

  // Filter notes for the current active view
  const baseNotesInView = notes.filter((note) => {
    if (showTrash) {
      if (note.deletedAt === null) return false;
    } else {
      if (note.deletedAt !== null) return false;
    }
    if (showFavorites && !note.isFavorite) return false;
    if (activeFolderId && note.folderId !== activeFolderId) return false;
    if (activeTagId && !note.tags?.includes(activeTagId)) return false;

    if (energyFilter !== 'all' && note.energyDomain !== energyFilter) return false;

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

  // Apply quick sub-filter (all, pinned, checklist, text)
  const filteredNotes = baseNotesInView.filter((note) => {
    if (cardFilter === 'pinned' && !note.isPinned) return false;
    if (cardFilter === 'checklist' && note.type !== 'checklist') return false;
    if (cardFilter === 'text' && note.type !== 'text') return false;
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

  const handleCreateNote = useCallback((type = 'text') => {
    const id = addNote(type);
    setOpenNoteId(id);
  }, [addNote, setOpenNoteId]);

  // Determine current view title
  const currentViewTitle = showTrash
    ? 'Memory Box'
    : showFavorites
    ? 'Favorites'
    : activeFolder
    ? activeFolder.name
    : activeTag
    ? `#${activeTag.name}`
    : workspaceView === 'spine'
    ? 'Daily Flow'
    : workspaceView === 'calendar'
    ? 'Calendar & Planner'
    : workspaceView === 'journal'
    ? 'Daily Journal'
    : 'Desk Canvas';

  const isFilteredOrSpecial = Boolean(activeFolderId || activeTagId || showTrash || showFavorites);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors select-none bg-[var(--bone,#EFE9DC)]">
      {/* =========================================================================
          TOP NAVIGATION BAR: Only rendered for Desk Canvas / Folders / Filtered views
          ========================================================================= */}
      {(workspaceView === 'canvas' || isFilteredOrSpecial) && (
        <header className="h-14 px-5 sm:px-6 border-b border-[var(--line,#D8D0BC)] bg-[var(--bone,#EFE9DC)]/95 backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0 z-20">
        
        {/* Zone 1 (Left): View Title & Filter Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 flex items-center justify-center">
            {showTrash ? (
              <Trash2 className="w-4 h-4 text-[var(--brick,#A8491F)]" />
            ) : showFavorites ? (
              <Star className="w-4 h-4 text-[var(--gold,#C9A135)] fill-[var(--gold,#C9A135)]" />
            ) : activeFolder ? (
              <span className="text-lg leading-none">{activeFolder.icon}</span>
            ) : activeTag ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--card,#F7F4EC)] text-[var(--brick,#A8491F)] border border-[var(--line,#D8D0BC)]">#</span>
            ) : workspaceView === 'spine' ? (
              <Compass className="w-4 h-4 text-[var(--gold,#C9A135)]" />
            ) : workspaceView === 'calendar' ? (
              <CalendarDays className="w-4 h-4 text-[var(--sage,#6B7F63)]" />
            ) : workspaceView === 'journal' ? (
              <BookOpen className="w-4 h-4 text-[var(--brick,#A8491F)]" />
            ) : (
              <LayoutGrid className="w-4 h-4 text-[var(--ink,#1B2420)]" />
            )}
          </div>

          <div className="flex items-center gap-2 truncate">
            <h2 className="text-sm font-sans font-medium text-[var(--ink,#1B2420)] tracking-tight truncate">
              {currentViewTitle}
            </h2>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/[0.04] text-[var(--ink-soft,#3A463E)] flex-shrink-0">
              {baseNotesInView.length}
            </span>

            {/* Clear Filter Button if inside a folder or tag */}
            {isFilteredOrSpecial && (
              <button
                type="button"
                onClick={() => {
                  setActiveFolderId(null);
                  setActiveTagId(null);
                  if (showTrash) useSlateStore.getState().setShowTrash(false);
                  if (showFavorites) useSlateStore.getState().setShowFavorites(false);
                  setWorkspaceView('canvas');
                }}
                className="hidden md:flex items-center gap-1 text-[10px] font-sans text-[var(--sage-dim,#9DAC95)] hover:text-red-500 bg-black/[0.02] hover:bg-red-50 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                title="Clear filter and view all notes"
              >
                <span>Clear</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 2 (Center): Segmented Cognitive Lenses Switcher */}
        <div className="hidden lg:flex items-center bg-black/[0.03] p-0.5 rounded-full border border-[var(--line,#D8D0BC)] shadow-2xs font-sans">
          <button
            type="button"
            onClick={() => {
              setActiveFolderId(null);
              setActiveTagId(null);
              setWorkspaceView('spine');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              workspaceView === 'spine' && !isFilteredOrSpecial
                ? 'bg-[var(--card,#F7F4EC)] text-[var(--gold,#C9A135)] shadow-xs font-semibold'
                : 'text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[var(--gold,#C9A135)]" />
            <span>Today</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkspaceView('canvas');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              workspaceView === 'canvas' || isFilteredOrSpecial
                ? 'bg-[var(--card,#F7F4EC)] text-[var(--ink,#1B2420)] shadow-xs font-semibold'
                : 'text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[var(--sage,#6B7F63)]" />
            <span>Desk Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkspaceView('calendar');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              workspaceView === 'calendar'
                ? 'bg-[var(--card,#F7F4EC)] text-[var(--sage,#6B7F63)] shadow-xs font-semibold'
                : 'text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-[var(--sage,#6B7F63)]" />
            <span>Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWorkspaceView('journal');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              workspaceView === 'journal'
                ? 'bg-[var(--card,#F7F4EC)] text-[var(--brick,#A8491F)] shadow-xs font-semibold'
                : 'text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--brick,#A8491F)]" />
            <span>Journal</span>
          </button>
        </div>

        {/* Zone 3 (Right): Search, Theme, & Creation Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Omni-Search Bar */}
          <div className="relative w-36 sm:w-48 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--sage-dim,#9DAC95)] pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1 bg-[var(--card,#F7F4EC)] text-[var(--ink,#1B2420)] rounded-full text-xs font-sans outline-none border border-[var(--line,#D8D0BC)] focus:border-[var(--gold,#C9A135)] transition-all placeholder:text-[var(--sage-dim,#9DAC95)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Theme Palette Switcher */}
          <ThemeSwitcher />

          {/* Creation Actions */}
          {!showTrash && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCreateNote('text')}
                className="flex items-center gap-1 px-3 py-1 bg-[var(--ink,#1B2420)] hover:bg-[var(--ink-soft,#3A463E)] text-[var(--bone,#EFE9DC)] rounded-full text-xs font-sans font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="New Note (⌘N)"
              >
                <Plus className="w-3 h-3 text-[var(--gold,#C9A135)]" />
                <span>Note</span>
              </button>
              <button
                type="button"
                onClick={() => handleCreateNote('checklist')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] text-[var(--ink,#1B2420)] hover:border-[var(--sage,#6B7F63)] rounded-full text-xs font-sans font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="New Checklist (⇧⌘N)"
              >
                <CheckSquare className="w-3 h-3 text-[var(--sage,#6B7F63)]" />
                <span>List</span>
              </button>
            </div>
          )}
        </div>
      </header>
      )}

      {/* =========================================================================
          WORKSPACE CONTENT AREA: Attention Spine, Calendar, Journal, or Desk Canvas
          ========================================================================= */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* LENS 1: Daily Attention Spine (No pleasantries, Anchor, Zeigarnik working memory, Quick Capture) */}
        {workspaceView === 'spine' && !isFilteredOrSpecial && (
          <DailySpineView />
        )}

        {/* LENS 2: Month Calendar & Day Planner */}
        {workspaceView === 'calendar' && !isFilteredOrSpecial && (
          <CalendarView />
        )}

        {/* LENS 3: Daily Journal & Notebook by Date */}
        {workspaceView === 'journal' && !isFilteredOrSpecial && (
          <JournalPanel />
        )}

        {/* LENS 4: Desk Canvas (All Collections, Folder filtering, Tactile cards) */}
        {(workspaceView === 'canvas' || isFilteredOrSpecial) && (
          <div className="flex-1 overflow-auto bg-paper-grain relative p-5 sm:p-7">
            <div className={viewMode === 'grid' || showTrash ? 'max-w-6xl mx-auto w-full' : ''}>
              
              {/* Macro Workspace Header with Energy Domain Filter */}
              {!showTrash && (
                <div className="mb-6 p-4 rounded-2xl bg-[#FDFCF9] border border-[#E8E3D8] flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#C2531C] font-bold">
                        {activeFolder ? `Collection · ${activeFolder.name}` : 'Desk Overview'}
                      </span>
                      {activeFolder && (
                        <span className="text-xs text-[#6B665F]">
                          (Theme: {activeFolder.theme || 'Caramel'})
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#1F1D1A]">
                      {activeFolder ? activeFolder.name : 'All Notes & Task Ledgers'}
                    </h3>
                  </div>

                  {/* Energy Domain Filters */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ENERGY_FILTERS.map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        onClick={() => setEnergyFilter(ef.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          energyFilter === ef.id
                            ? 'bg-[#C2531C] text-white shadow-2xs font-bold'
                            : 'bg-black/[0.04] text-[#6B665F] hover:text-[#1F1D1A]'
                        }`}
                      >
                        {ef.dot && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: energyFilter === ef.id ? '#FFFFFF' : ef.dot }}
                          />
                        )}
                        <span>{ef.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Filter Chips, Sort, & Layout Controls */}
              {!showTrash && baseNotesInView.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Quick Content Filter Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: `All (${baseNotesInView.length})` },
                      { id: 'pinned', label: `Pinned (${baseNotesInView.filter((n) => n.isPinned).length})`, disabled: baseNotesInView.filter((n) => n.isPinned).length === 0 },
                      { id: 'checklist', label: `Checklists (${baseNotesInView.filter((n) => n.type === 'checklist').length})` },
                      { id: 'text', label: `Manuscripts (${baseNotesInView.filter((n) => n.type === 'text').length})` },
                    ].map(({ id, label, disabled }) => (
                      <button
                        key={id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setCardFilter(id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          cardFilter === id
                            ? 'bg-[#1F1D1A] text-white shadow-2xs font-bold'
                            : 'bg-black/[0.04] text-[#6B665F] hover:text-[#1F1D1A]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Right: Sort & Grid/Board Switcher */}
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="relative" ref={sortDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#E8E3D8] text-[#1F1D1A] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                        title="Sort Notes"
                      >
                        <ArrowDownUp className="w-3 h-3 opacity-60" />
                        <span className="text-[11px] font-semibold">{SORT_OPTIONS.find((s) => s.value === sortMode)?.label}</span>
                      </button>

                      {showSortDropdown && (
                        <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl border border-[#E8E3D8] shadow-lg py-1 z-30 animate-fade-in">
                          {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setSortMode(value);
                                setShowSortDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#FAF6F0] cursor-pointer flex items-center justify-between ${
                                sortMode === value ? 'font-bold text-[#C2531C]' : 'text-[#1F1D1A]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-3 h-3 opacity-60" />
                                <span>{label}</span>
                              </div>
                              {sortMode === value && <Check className="w-3 h-3 text-[#C2531C]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View Switcher: Neat Grid vs Freeform Board */}
                    <div className="flex bg-black/[0.04] p-0.5 rounded-full border border-[#E8E3D8]">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${
                          viewMode === 'grid'
                            ? 'bg-white text-[#C2531C] shadow-2xs'
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                        title="Neat Grid View (G)"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('board')}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${
                          viewMode === 'board'
                            ? 'bg-white text-[#C2531C] shadow-2xs'
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                        title="Freeform Board (B) - drag items anywhere"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Memory Box Banner */}
              {showTrash && (
                <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E8E3D8] flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-6 h-6 text-rose-600" />
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#1F1D1A]">Memory Box</h3>
                      <p className="text-xs text-[#6B665F]">
                        Deleted items are stored privately on this device. Items older than 30 days are automatically purged.
                      </p>
                    </div>
                  </div>
                  {filteredNotes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Permanently delete all notes in Memory Box?')) emptyTrash();
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Empty Box
                    </button>
                  )}
                </div>
              )}

              {/* High-Contrast Empty States (Zero Emojis, No Washing Out) */}
              {filteredNotes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                  <div className="relative mb-4 flex items-center justify-center">
                    {showTrash ? (
                      <MemoryBoxDoodle className="w-24 h-24" />
                    ) : searchQuery.trim() ? (
                      <CloudDoodle className="w-24 h-20" />
                    ) : (
                      <EmptyNotesDoodle className="w-24 h-24" />
                    )}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1F1D1A] mb-1">
                    {showTrash
                      ? 'Memory Box is empty'
                      : searchQuery.trim()
                      ? 'No matching notes found'
                      : activeFolder
                      ? `No items in ${activeFolder.name} yet`
                      : 'Your desk is clear'}
                  </h3>
                  <p className="text-xs text-[#6B665F] max-w-xs leading-relaxed mb-5">
                    {showTrash
                      ? 'Deleted notes will be preserved here for 30 days.'
                      : searchQuery.trim()
                      ? 'Try another keyword or clear search filters.'
                      : 'Capture a manuscript note or structured task ledger to begin.'}
                  </p>
                  {!showTrash && !searchQuery.trim() && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCreateNote('text')}
                        className="px-4 py-2 bg-[#C2531C] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#A63E0F] transition-all cursor-pointer"
                      >
                        + Create Note
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateNote('checklist')}
                        className="px-4 py-2 bg-white text-[#1F1D1A] border border-[#E8E3D8] rounded-full text-xs font-bold hover:bg-[#FAF6F0] transition-all cursor-pointer"
                      >
                        + Task Ledger
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Display: Grid vs Freeform Board */}
              {sortedNotes.length > 0 && (
                viewMode === 'grid' || showTrash ? (
                  <div className="space-y-6">
                    {/* Pinned Section */}
                    {pinnedNotes.length > 0 && !showTrash && cardFilter !== 'checklist' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F1D1A] uppercase tracking-wider font-mono">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Pinned for Focus ({pinnedNotes.length})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unpinned Notes Section */}
                    {unpinnedNotes.length > 0 && (
                      <div className="space-y-3">
                        {pinnedNotes.length > 0 && !showTrash && cardFilter === 'all' && (
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-mono font-bold text-[#6B665F] uppercase tracking-wider">
                              Manuscripts &amp; Task Ledgers ({unpinnedNotes.length})
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {unpinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
                          ))}

                          {/* Quick Add Card when 1 or 2 notes exist */}
                          {!showTrash && unpinnedNotes.length <= 2 && (
                            <button
                              type="button"
                              onClick={() => handleCreateNote('text')}
                              className="min-h-[200px] rounded-2xl border-2 border-dashed border-[#E8E3D8] hover:border-[#C2531C] p-6 flex flex-col items-center justify-center text-center transition-all group hover:bg-[#FAF6F0] cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-full bg-[#FDF8F5] text-[#C2531C] border border-[#F2DDD1] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-2xs">
                                <Plus className="w-4 h-4" />
                              </div>
                              <h4 className="font-serif font-semibold text-sm text-[#1F1D1A]">New Manuscript or Ledger</h4>
                              <p className="text-[11px] text-[#6B665F] mt-0.5">Click to write or plan</p>
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
