import React, { useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import NoteCard from '../notes/NoteCard';
import NoteEditor from '../notes/NoteEditor';
import JournalPanel from './JournalPanel';
import ThemeSwitcher from './ThemeSwitcher';
import {
  Search, Plus, Sparkles, BookOpen, Columns, FileText,
  ArrowDownUp, Clock, ArrowUpAZ, Palette, LayoutGrid, Move, CheckSquare
} from 'lucide-react';
import { CloudDoodle, StarDoodle } from '../ui/Doodles';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'oldest', label: 'Oldest', icon: Clock },
  { value: 'az', label: 'A → Z', icon: ArrowUpAZ },
  { value: 'color', label: 'Color', icon: Palette },
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
  } = useSlateStore();

  const boardConstraintsRef = useRef(null);
  const searchRef = useRef(null);

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
        if (e.key === 'g' || e.key === 'G') setViewMode('grid');
        else if (e.key === 'b' || e.key === 'B') setViewMode('board');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addNote, setOpenNoteId, openNoteId, setViewMode]);

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

  // Sort
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

  const showJournal = journalViewMode === 'both' || journalViewMode === 'journal';
  const showNotes = journalViewMode === 'both' || journalViewMode === 'notes';

  const currentViewTitle = showTrash
    ? 'Memory Box'
    : showFavorites
    ? 'Favorites'
    : activeFolder
    ? activeFolder.name
    : activeTag
    ? `#${activeTag.name}`
    : 'All Notes';

  const currentViewIcon = showTrash
    ? '📦'
    : showFavorites
    ? '⭐'
    : activeFolder
    ? activeFolder.icon
    : activeTag
    ? '🏷️'
    : '📝';

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors">
      {/* Unified Top Navigation & Controls Bar */}
      <header className="h-16 px-6 border-b border-black/[0.08] dark:border-white/[0.08] bg-[var(--color-sidebar-bg)] backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0 z-20">
        {/* Left: View Title & Note Count */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl">{currentViewIcon}</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-bold text-[var(--color-text)] truncate">
              {currentViewTitle}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[var(--color-text-muted)]">
              {filteredNotes.length}
            </span>
          </div>
        </div>

        {/* Center: Search Input */}
        <div className="relative w-64 md:w-80 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search notes… (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] text-[var(--color-text)] rounded-full text-xs font-medium outline-none border border-black/[0.06] dark:border-white/[0.08] focus:border-[var(--color-accent)] focus:bg-[var(--color-card-bg)] transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Sort Selector */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-[var(--color-text)] hover:bg-black/[0.06] transition-colors cursor-pointer"
              title="Sort Notes"
            >
              <ArrowDownUp className="w-3.5 h-3.5 opacity-60" />
              <span className="hidden lg:inline">{SORT_OPTIONS.find((s) => s.value === sortMode)?.label}</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-slate-800 rounded-xl border border-black/10 dark:border-white/10 shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
              {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSortMode(value)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-2 ${
                    sortMode === value ? 'font-bold text-[var(--color-accent)]' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-3 h-3 opacity-60" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggles: Grid / Board */}
          <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-[var(--color-accent)] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View (G)"
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
              title="Spatial Board (B)"
            >
              <Move className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Journal Split Toggle */}
          <div className="hidden sm:flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
            {[
              { mode: 'notes', Icon: FileText, label: 'Notes' },
              { mode: 'both', Icon: Columns, label: 'Split' },
              { mode: 'journal', Icon: BookOpen, label: 'Journal' },
            ].map(({ mode, Icon, label }) => (
              <button
                key={mode}
                onClick={() => setJournalViewMode(mode)}
                title={label}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                  journalViewMode === mode
                    ? 'bg-white dark:bg-slate-700 text-[var(--color-text)] shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Theme Palette Swatches */}
          <ThemeSwitcher />

          {/* Create Buttons */}
          {!showTrash && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCreateNote('text')}
                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent)] hover:opacity-95 text-white rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>
              <button
                onClick={() => handleCreateNote('checklist')}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-[var(--color-text)] hover:bg-black/[0.06] rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
                title="Create Checklist"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span className="hidden md:inline">Checklist</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Canvas Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {showJournal && <JournalPanel />}

        {showNotes && (
          <div className="flex-1 overflow-auto bg-notebook-grid relative p-6 sm:p-8">
            <div className={viewMode === 'grid' || showTrash ? 'max-w-6xl mx-auto w-full' : ''}>
              {/* Memory Box banner */}
              {showTrash && (
                <div className="mb-6 p-4 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">Memory Box</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">Deleted notes are stored here safely.</p>
                    </div>
                  </div>
                  {filteredNotes.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete all notes in Memory Box?')) emptyTrash();
                      }}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Empty Box
                    </button>
                  )}
                </div>
              )}

              {/* Empty state */}
              {filteredNotes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                  <div className="relative mb-4">
                    <CloudDoodle className="w-20 h-14 text-slate-300 dark:text-slate-700" />
                    <StarDoodle className="absolute -top-2 -right-2 w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '9s' }} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text)] mb-1.5">
                    {showTrash ? 'Memory Box is empty 🌸' : searchQuery.trim() ? 'No matches found' : 'No notes here yet'}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] max-w-xs leading-relaxed mb-5">
                    {showTrash
                      ? 'Deleted notes will appear here.'
                      : searchQuery.trim()
                      ? 'Try another search term.'
                      : 'Click New Note or Checklist to add your first note.'}
                  </p>
                  {!showTrash && !searchQuery.trim() && (
                    <button
                      onClick={() => handleCreateNote('text')}
                      className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-full text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                    >
                      + Create Note
                    </button>
                  )}
                </div>
              )}

              {/* Notes Grid */}
              {sortedNotes.length > 0 && (
                viewMode === 'grid' || showTrash ? (
                  <div className="space-y-6">
                    {/* Pinned section */}
                    {pinnedNotes.length > 0 && !showTrash && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pinned</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unpinned section */}
                    {unpinnedNotes.length > 0 && (
                      <div className="space-y-3">
                        {pinnedNotes.length > 0 && !showTrash && (
                          <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                            <span>Other Notes</span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {unpinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
                          ))}

                          {/* Symmetric Quick Add Card when 1 or 2 notes exist */}
                          {!showTrash && unpinnedNotes.length <= 2 && (
                            <button
                              onClick={() => handleCreateNote('text')}
                              className="min-h-[200px] rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-[var(--color-accent)] p-6 flex flex-col items-center justify-center text-center transition-all group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-full bg-[var(--color-accent-bg)] text-[var(--color-accent)] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                                <Plus className="w-4 h-4" />
                              </div>
                              <h4 className="font-semibold text-xs text-[var(--color-text)]">Add Note</h4>
                              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Click to write or plan</p>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
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
