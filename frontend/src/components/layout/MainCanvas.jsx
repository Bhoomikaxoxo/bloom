import React, { useRef } from 'react';
import useSlateStore from '../../store/useSlateStore';
import NoteCard from '../notes/NoteCard';
import { Search, Plus, Trash2, FolderOpen, Tag, Sparkles } from 'lucide-react';
import { CloudDoodle, StarDoodle } from '../ui/Doodles';

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
    setSearchQuery,
    addNote,
    emptyTrash,
  } = useSlateStore();

  const boardConstraintsRef = useRef(null);

  // Filter notes based on sidebar settings and search
  const filteredNotes = notes.filter((note) => {
    if (showTrash) {
      if (note.deletedAt === null) return false;
    } else {
      if (note.deletedAt !== null) return false;
    }

    if (activeFolderId && note.folderId !== activeFolderId) return false;
    if (activeTagId && !note.tags?.includes(activeTagId)) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = note.title?.toLowerCase().includes(query);
      
      let bodyMatch = false;
      if (note.type === 'text') {
        bodyMatch = note.content?.toLowerCase().includes(query);
      } else if (note.type === 'checklist') {
        bodyMatch = note.checklist?.some((item) =>
          item.text.toLowerCase().includes(query)
        );
      }

      if (!titleMatch && !bodyMatch) return false;
    }

    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const activeTag = tags.find((t) => t.id === activeTagId);

  const handleCreateTextNote = () => {
    addNote('text');
  };

  const handleCreateChecklistNote = () => {
    addNote('checklist');
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-300">
      <header className="px-8 py-5 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-wrap gap-4 items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-colors">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search notes & checklists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cutesy-input pl-11 pr-4 py-2 w-full text-sm shadow-sm border-slate-200 dark:border-slate-800 focus:border-purple-400 focus:ring-purple-300/30"
          />
          <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>

        {!showTrash && (
          <div className="flex gap-3">
            <button
              onClick={handleCreateTextNote}
              className="cutesy-btn bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-950 dark:hover:bg-purple-900 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/30"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
            <button
              onClick={handleCreateChecklistNote}
              className="cutesy-btn bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-950 dark:hover:bg-pink-900 dark:text-pink-300 border border-pink-200/50 dark:border-pink-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Checklist</span>
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-auto bg-notebook-grid relative p-8">
        {showTrash && (
          <div className="mb-6 p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-900/40 flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📦</span>
              <div>
                <h3 className="text-sm font-bold text-pink-700 dark:text-pink-300">Memory Box</h3>
                <p className="text-xs text-pink-600 dark:text-pink-400">
                  Notes here are saved safely. You can restore them to your workspace, or empty the box to clear them permanently.
                </p>
              </div>
            </div>
            {filteredNotes.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Permanently delete all notes in the Memory Box? This action cannot be undone.')) {
                    emptyTrash();
                  }
                }}
                className="cutesy-btn text-xs py-1.5 px-3 bg-red-400 hover:bg-red-500 text-white font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Empty Box
              </button>
            )}
          </div>
        )}

        {(activeFolder || activeTag || searchQuery.trim()) && !showTrash && (
          <div className="mb-6 flex gap-2 items-center flex-wrap animate-fade-in">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Filters:</span>
            {activeFolder && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/30 flex items-center gap-1">
                Folder: {activeFolder.icon} {activeFolder.name}
              </span>
            )}
            {activeTag && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/30 flex items-center gap-1">
                Tag: #{activeTag.name}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/30">
                Search: "{searchQuery}"
              </span>
            )}
          </div>
        )}

        {filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="relative mb-6">
              <CloudDoodle className="w-24 h-16 text-slate-200/80 dark:text-slate-800" />
              <StarDoodle className="absolute -top-3 -right-3 w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h3 className="text-lg font-display font-extrabold text-slate-600 dark:text-slate-400 mb-2">
              {showTrash
                ? 'Your Memory Box is completely empty! 🌸'
                : searchQuery.trim()
                ? 'Oh look, no matches found! 🔎'
                : 'Your Slate is clean and waiting... ✨'}
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
              {showTrash
                ? 'Deleted notes placed here can be restored whenever you need them again.'
                : searchQuery.trim()
                ? 'Try a different search word, or clear the search to view all notes.'
                : 'Click one of the "New Note" or "Checklist" buttons above to scribble down your first thoughts.'}
            </p>
          </div>
        )}

        {filteredNotes.length > 0 && (
          viewMode === 'grid' || showTrash ? (
            <div className="space-y-8 animate-fade-in">
              {pinnedNotes.length > 0 && !showTrash && (
                <div className="space-y-4">
                  <h3 className="text-sm font-display font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Pinned Notes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}

              {unpinnedNotes.length > 0 && (
                <div className="space-y-4">
                  {pinnedNotes.length > 0 && !showTrash && (
                    <h3 className="text-sm font-display font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Other Notes
                    </h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unpinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              ref={boardConstraintsRef}
              className="w-[2000px] h-[1200px] relative p-8 select-none"
            >
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isDraggable
                  dragConstraints={boardConstraintsRef}
                />
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default MainCanvas;
