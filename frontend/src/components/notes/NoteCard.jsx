import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import { StarPawCheckbox, StickerBadge } from '../ui/Doodles';
import { Pin, Star, Trash2, Folder, Tag, Plus, Check, Undo, Trash } from 'lucide-react';

const NoteCard = ({ note, isDraggable = false, dragConstraints = null }) => {
  const {
    updateNote,
    deleteNote,
    restoreNote,
    deleteNotePermanently,
    updateNotePosition,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    folders,
    tags,
    showTrash,
  } = useSlateStore();

  const [relativeTime, setRelativeTime] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const folderMenuRef = useRef(null);
  const tagMenuRef = useRef(null);

  // Update relative timestamp dynamically
  useEffect(() => {
    const updateTime = () => {
      const diff = Date.now() - note.updatedAt;
      if (diff < 60000) {
        setRelativeTime('just now');
      } else {
        const mins = Math.floor(diff / 60000);
        if (mins < 60) {
          setRelativeTime(`${mins}m ago`);
        } else {
          const hours = Math.floor(diff / 3600000);
          if (hours < 24) {
            setRelativeTime(`${hours}h ago`);
          } else {
            const days = Math.floor(diff / 86400000);
            setRelativeTime(`${days}d ago`);
          }
        }
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [note.updatedAt]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (folderMenuRef.current && !folderMenuRef.current.contains(e.target)) {
        setShowFolderMenu(false);
      }
      if (tagMenuRef.current && !tagMenuRef.current.contains(e.target)) {
        setShowTagMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map color index to soft pastel styles
  const colorIndex = note.colorIndex || 1;
  const cardColorClasses = {
    1: 'bg-[var(--color-note-1)] text-[var(--color-note-text-1)] border-[var(--color-note-text-1)]/20',
    2: 'bg-[var(--color-note-2)] text-[var(--color-note-text-2)] border-[var(--color-note-text-2)]/20',
    3: 'bg-[var(--color-note-3)] text-[var(--color-note-text-3)] border-[var(--color-note-text-3)]/20',
    4: 'bg-[var(--color-note-4)] text-[var(--color-note-text-4)] border-[var(--color-note-text-4)]/20',
    5: 'bg-[var(--color-note-5)] text-[var(--color-note-text-5)] border-[var(--color-note-text-5)]/20',
    6: 'bg-[var(--color-note-6)] text-[var(--color-note-text-6)] border-[var(--color-note-text-6)]/20',
  };

  // Sticker types based on ID or index
  const stickerType = colorIndex % 3 === 0 ? 'star' : colorIndex % 3 === 1 ? 'heart' : 'bow';

  const handleTitleChange = (e) => {
    updateNote(note.id, { title: e.target.value });
  };

  const handleContentChange = (e) => {
    updateNote(note.id, { content: e.target.value });
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addChecklistItem(note.id, newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleToggleTodo = (itemId, done) => {
    updateChecklistItem(note.id, itemId, { done: !done });
  };

  const handleDragEnd = (event, info) => {
    const newX = (note.boardPosition?.x || 50) + info.offset.x;
    const newY = (note.boardPosition?.y || 80) + info.offset.y;
    updateNotePosition(note.id, newX, newY);
  };

  const noteFolder = folders.find((f) => f.id === note.folderId);
  const cardStyle = cardColorClasses[colorIndex] || cardColorClasses[1];

  const motionProps = isDraggable
    ? {
        drag: true,
        dragMomentum: false,
        dragConstraints: dragConstraints,
        onDragEnd: handleDragEnd,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          x: note.boardPosition?.x || 50,
          y: note.boardPosition?.y || 80,
          width: '320px',
        },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      layout={!isDraggable}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7, y: 15 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      whileHover={showTrash ? {} : { scale: 1.025, rotate: 0.5 }}
      className={`relative rounded-[2.5rem] p-6 border-2 flex flex-col shadow-sm select-text transition-colors duration-300 ${cardStyle} ${
        isDraggable ? 'cursor-grab active:cursor-grabbing z-20' : ''
      } ${showTrash ? 'opacity-75 grayscale-[20%]' : ''}`}
    >
      {note.isPinned && !showTrash && <StickerBadge type={stickerType} />}

      <div className="flex justify-between items-start gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/40 dark:bg-black/20 px-2 py-0.5 rounded-full">
          {relativeTime}
        </span>
        
        <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
          {!showTrash ? (
            <>
              <button
                onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                className={`p-1 rounded-full transition-transform active:scale-75 ${
                  note.isPinned
                    ? 'text-yellow-500 scale-110 bg-white/40'
                    : 'hover:bg-white/40 hover:scale-105'
                }`}
                title={note.isPinned ? "Unpin note" : "Pin note"}
                aria-label={note.isPinned ? "Unpin note" : "Pin note"}
              >
                <Pin className="w-3.5 h-3.5 fill-current" />
              </button>
              
              <button
                onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
                className={`p-1 rounded-full transition-transform active:scale-75 ${
                  note.isFavorite
                    ? 'text-pink-500 scale-110 bg-white/40'
                    : 'hover:bg-white/40 hover:scale-105'
                }`}
                title={note.isFavorite ? "Unfavorite" : "Favorite"}
                aria-label={note.isFavorite ? "Unfavorite" : "Favorite"}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 rounded-full hover:bg-white/40 hover:scale-105 transition-all text-slate-500 hover:text-red-500 active:scale-75"
                title="Send to Memory Box"
                aria-label="Send note to Memory Box"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => restoreNote(note.id)}
                className="p-1 rounded-full hover:bg-white/40 hover:scale-105 transition-all text-green-600 active:scale-75 flex items-center gap-0.5"
                title="Restore note"
                aria-label="Restore note"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (confirm('Permanently delete this note? This cannot be undone.')) {
                    deleteNotePermanently(note.id);
                  }
                }}
                className="p-1 rounded-full hover:bg-white/40 hover:scale-105 transition-all text-red-600 active:scale-75"
                title="Delete permanently"
                aria-label="Delete note permanently"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <input
        type="text"
        value={note.title}
        onChange={handleTitleChange}
        disabled={showTrash}
        placeholder="Untitled 🌸"
        className="w-full bg-transparent font-display font-extrabold text-lg outline-none placeholder-current/40 mb-3 border-b border-transparent hover:border-current/10 focus:border-current/30 transition-all rounded"
        style={{ color: 'inherit' }}
      />

      <div className="flex-1 min-h-[120px] max-h-[300px] overflow-y-auto mb-4 pr-1">
        {note.type === 'text' ? (
          <textarea
            value={note.content || ''}
            onChange={handleContentChange}
            disabled={showTrash}
            placeholder="Scribble your ideas here... ✨"
            className="w-full h-full bg-transparent resize-none outline-none text-sm placeholder-current/40 leading-relaxed font-medium"
            style={{ color: 'inherit' }}
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {(note.checklist || []).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between group/todo gap-2 py-0.5"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <StarPawCheckbox
                      checked={item.done}
                      onClick={() => !showTrash && handleToggleTodo(item.id, item.done)}
                      disabled={showTrash}
                    />
                    <motion.input
                      type="text"
                      value={item.text}
                      onChange={(e) =>
                        updateChecklistItem(note.id, item.id, { text: e.target.value })
                      }
                      disabled={showTrash}
                      className={`bg-transparent outline-none text-sm w-full font-medium ${
                        item.done
                          ? 'line-through opacity-50 decoration-2 decoration-purple-500/80'
                          : ''
                      }`}
                      style={{ color: 'inherit' }}
                    />
                  </div>
                  {!showTrash && (
                    <button
                      type="button"
                      onClick={() => deleteChecklistItem(note.id, item.id)}
                      className="opacity-0 group-hover/todo:opacity-100 hover:scale-105 p-0.5 rounded text-current/60 hover:text-red-500 transition-all"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {!showTrash && (
              <form onSubmit={handleAddTodo} className="flex gap-1.5 mt-3 items-center">
                <input
                  type="text"
                  placeholder="New item..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="w-full bg-white/40 dark:bg-black/25 placeholder-current/40 outline-none text-xs px-3 py-1.5 rounded-xl border border-transparent focus:border-current/20 transition-all"
                  style={{ color: 'inherit' }}
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-xl bg-white/60 dark:bg-black/30 hover:bg-white/80 active:scale-95 transition-all text-current"
                  title="Add item"
                  aria-label="Add item"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-current/10 flex flex-wrap gap-2 items-center justify-between">
        <div className="relative" ref={folderMenuRef}>
          <button
            onClick={() => !showTrash && setShowFolderMenu(!showFolderMenu)}
            disabled={showTrash}
            className="flex items-center gap-1 text-[11px] font-bold bg-white/40 dark:bg-black/20 hover:bg-white/60 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
          >
            <span>{noteFolder ? noteFolder.icon : '📁'}</span>
            <span>{noteFolder ? noteFolder.name : 'Unassigned'}</span>
          </button>
          
          {showFolderMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl p-1.5 z-30 animate-fade-in text-slate-700 dark:text-slate-200">
              <button
                onClick={() => {
                  updateNote(note.id, { folderId: null });
                  setShowFolderMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700/60 font-semibold"
              >
                📁 Unassigned
              </button>
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    updateNote(note.id, { folderId: f.id });
                    setShowFolderMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700/60 font-semibold flex items-center gap-1.5"
                >
                  <span>{f.icon}</span>
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-1" ref={tagMenuRef}>
          <div className="flex gap-1">
            {(note.tags || []).slice(0, 2).map((tagId) => {
              const activeTag = tags.find((t) => t.id === tagId);
              if (!activeTag) return null;
              return (
                <span
                  key={tagId}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/30 dark:bg-black/15 shadow-sm uppercase"
                >
                  #{activeTag.name}
                </span>
              );
            })}
            {(note.tags || []).length > 2 && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded-md bg-white/30 dark:bg-black/15 shadow-sm">
                +{(note.tags || []).length - 2}
              </span>
            )}
          </div>

          {!showTrash && (
            <>
              <button
                onClick={() => setShowTagMenu(!showTagMenu)}
                className="p-1 rounded-xl bg-white/40 dark:bg-black/20 hover:bg-white/60 transition-colors"
                title="Manage tags"
                aria-label="Manage tags"
              >
                <Tag className="w-3 h-3" />
              </button>

              {showTagMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl p-2 z-30 animate-fade-in text-slate-700 dark:text-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1.5">
                    Select Tags:
                  </span>
                  <div className="space-y-0.5 max-h-40 overflow-y-auto">
                    {tags.map((t) => {
                      const hasTag = note.tags?.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            const currentTags = note.tags || [];
                            const newTags = hasTag
                              ? currentTags.filter((id) => id !== t.id)
                              : [...currentTags, t.id];
                            updateNote(note.id, { tags: newTags });
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700/60 font-semibold flex items-center justify-between"
                        >
                          <span>#{t.name}</span>
                          {hasTag && <Check className="w-3.5 h-3.5 text-purple-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!showTrash && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 flex gap-1.5 bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-700/50 p-1.5 rounded-full shadow-lg opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity z-30 group-hover:opacity-100">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => updateNote(note.id, { colorIndex: idx })}
              className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 ${
                idx === 1
                  ? 'bg-[var(--color-note-1)]'
                  : idx === 2
                  ? 'bg-[var(--color-note-2)]'
                  : idx === 3
                  ? 'bg-[var(--color-note-3)]'
                  : idx === 4
                  ? 'bg-[var(--color-note-4)]'
                  : idx === 5
                  ? 'bg-[var(--color-note-5)]'
                  : 'bg-[var(--color-note-6)]'
              } ${colorIndex === idx ? 'border-[var(--color-accent)] scale-110' : 'border-slate-200 dark:border-slate-600'}`}
              title={`Color theme ${idx}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NoteCard;
