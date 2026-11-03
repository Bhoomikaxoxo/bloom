import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import { TAG_COLOR_MAP } from '../../utils/theme-config';
import { Pin, Star, Trash2, Plus, Check, Undo, Trash, Copy, Folder } from 'lucide-react';

const NoteCard = ({ note, isDraggable = false, dragConstraints = null, onOpen }) => {
  const {
    updateNote,
    deleteNote,
    duplicateNote,
    restoreNote,
    deleteNotePermanently,
    updateNotePosition,
    addChecklistItem,
    updateChecklistItem,
    folders,
    tags,
    showTrash,
    triggerConfetti,
  } = useSlateStore();

  const [relativeTime, setRelativeTime] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const folderMenuRef = useRef(null);
  const cardRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const diff = Date.now() - note.updatedAt;
      if (diff < 60000) {
        setRelativeTime('Just now');
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (folderMenuRef.current && !folderMenuRef.current.contains(e.target)) {
        setShowFolderMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorIndex = note.colorIndex || 1;

  const cardColorStyle = {
    backgroundColor: `var(--color-note-${colorIndex}, var(--color-card-bg))`,
    borderLeft: `4px solid var(--color-note-border-${colorIndex}, var(--color-accent))`,
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addChecklistItem(note.id, newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleToggleTodo = (itemId, done, event) => {
    const isNowDone = !done;
    if (isNowDone) {
      const items = note.checklist || [];
      const doneCount = items.filter((i) => i.done).length;
      const totalCount = items.length;
      if (doneCount === totalCount - 1) {
        const clickX = event?.clientX || window.innerWidth / 2;
        const clickY = event?.clientY || window.innerHeight / 2;
        triggerConfetti(clickX, clickY);
      }
    }
    updateChecklistItem(note.id, itemId, { done: isNowDone });
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (event, info) => {
    // Delay resetting so that any native click event triggered by pointer up is discarded
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);

    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance > 3) {
      const currentX = note.boardPosition?.x ?? 50;
      const currentY = note.boardPosition?.y ?? 80;
      const newX = Math.max(10, Math.round(currentX + info.offset.x));
      const newY = Math.max(10, Math.round(currentY + info.offset.y));
      updateNotePosition(note.id, newX, newY);
    }
  };

  const noteFolder = folders.find((f) => f.id === note.folderId);

  const motionProps = isDraggable
    ? {
        drag: true,
        dragMomentum: false,
        dragElastic: 0,
        dragConstraints: dragConstraints || { left: 10, top: 10, right: 2000, bottom: 1200 },
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        animate: { x: 0, y: 0, opacity: 1 },
        transition: { duration: 0 },
        style: {
          position: 'absolute',
          left: `${note.boardPosition?.x || 50}px`,
          top: `${note.boardPosition?.y || 80}px`,
          width: '320px',
          ...cardColorStyle,
        },
      }
    : {
        layout: true,
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { type: 'spring', stiffness: 350, damping: 25 },
        style: cardColorStyle,
      };

  return (
    <motion.div
      ref={cardRef}
      {...motionProps}
      whileHover={showTrash ? {} : isDraggable ? {} : { y: -2 }}
      className={`group relative p-5 rounded-2xl border border-[var(--color-card-border)] flex flex-col shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] transition-shadow duration-200 ${
        isDraggable ? 'cursor-grab active:cursor-grabbing z-20' : 'cursor-pointer'
      } ${showTrash ? 'opacity-70 grayscale-[25%]' : ''}`}
      onClick={(e) => {
        // Prevent opening editor when dropping after a drag gesture
        if (isDraggingRef.current) return;

        const tag = e.target.tagName;
        if (
          onOpen &&
          !showTrash &&
          tag !== 'BUTTON' &&
          tag !== 'INPUT' &&
          tag !== 'TEXTAREA' &&
          !e.target.closest('button') &&
          !e.target.closest('form')
        ) {
          onOpen();
        }
      }}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5 z-10">
        <div className="flex items-center gap-2">
          {/* Folder pill */}
          <div className="relative" ref={folderMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!showTrash) setShowFolderMenu(!showFolderMenu);
              }}
              disabled={showTrash}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] text-[var(--color-text)] transition-colors cursor-pointer"
            >
              {noteFolder ? (
                <span>{noteFolder.icon}</span>
              ) : (
                <Folder className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              )}
              <span className="truncate max-w-[90px]">{noteFolder ? noteFolder.name : 'No folder'}</span>
            </button>

            {showFolderMenu && (
              <div
                className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl shadow-lg p-1.5 z-40 animate-fade-in text-slate-700 dark:text-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    updateNote(note.id, { folderId: null });
                    setShowFolderMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <Folder className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>No folder</span>
                </button>
                {folders.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      updateNote(note.id, { folderId: f.id });
                      setShowFolderMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{f.icon}</span>
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[11px] font-medium text-[var(--color-text-muted)] opacity-70">
            {relativeTime}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {!showTrash ? (
            <>
              {/* Star Favorite Button - Always Visible */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { isFavorite: !note.isFavorite });
                }}
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  note.isFavorite
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-2xs scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                }`}
                title={note.isFavorite ? 'Unfavorite' : 'Favorite'}
              >
                <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Pin Button - Always Visible */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { isPinned: !note.isPinned });
                }}
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  note.isPinned
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-bg)] shadow-2xs scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-[var(--color-accent)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
              </button>

              {/* Subtle divider before utility actions */}
              <div className="w-px h-3 bg-black/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Duplicate Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateNote(note.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] opacity-0 group-hover:opacity-80 hover:!opacity-100 transition-all cursor-pointer flex items-center justify-center"
                title="Duplicate note"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-80 hover:!opacity-100 transition-all cursor-pointer flex items-center justify-center"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  restoreNote(note.id);
                }}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                title="Restore note"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Permanently delete note?')) deleteNotePermanently(note.id);
                }}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Delete permanently"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Note Title */}
      <h3 className="font-semibold text-base text-[var(--color-text)] leading-snug mb-2.5">
        {note.title || 'Untitled Note'}
      </h3>

      {/* Checklist Progress Bar */}
      {note.type === 'checklist' && (note.checklist || []).length > 0 && (() => {
        const items = note.checklist || [];
        const total = items.length;
        const completed = items.filter((i) => i.done).length;
        const percent = Math.round((completed / total) * 100);

        return (
          <div className="mb-3">
            <div className="flex justify-between items-center text-[11px] font-semibold text-[var(--color-text-muted)] mb-1">
              <span>Tasks</span>
              <span>{completed}/{total} ({percent}%)</span>
            </div>
            <div className="h-1.5 w-full bg-black/[0.06] dark:bg-white/[0.1] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* Note Content / Checklist items */}
      <div className="flex-1 mb-3">
        {note.type === 'text' ? (
          <p className="text-xs sm:text-sm text-[var(--color-text)] opacity-85 leading-relaxed line-clamp-4 whitespace-pre-wrap">
            {note.content || 'Click to write something…'}
          </p>
        ) : (
          <div className="space-y-1.5">
            {(note.checklist || []).slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 py-0.5 text-left group/item"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!showTrash) handleToggleTodo(item.id, item.done, e);
                  }}
                  disabled={showTrash}
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded flex items-center justify-center transition-all cursor-pointer ${
                    item.done
                      ? 'bg-[var(--color-accent)] border border-[var(--color-accent)] text-white'
                      : 'border border-black/20 dark:border-white/30 bg-white/60 dark:bg-slate-800/60 hover:border-[var(--color-accent)]'
                  }`}
                >
                  {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </button>
                <span
                  className={`text-xs sm:text-sm flex-1 break-words leading-snug transition-all ${
                    item.done
                      ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                      : 'text-[var(--color-text)] font-medium'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
            {(note.checklist || []).length > 5 && (
              <p className="text-[11px] font-medium text-[var(--color-text-muted)] pt-1">
                +{(note.checklist || []).length - 5} more items…
              </p>
            )}

            {/* Quick inline item adder */}
            {!showTrash && (
              <form onSubmit={handleAddTodo} className="pt-1.5 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Add a task…"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="w-full text-xs bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-2.5 py-1 text-[var(--color-text)] placeholder:text-slate-400 outline-none focus:border-[var(--color-accent)]"
                />
                <button
                  type="submit"
                  disabled={!newTodoText.trim()}
                  className="px-2 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:opacity-90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Tags & Color dots */}
      <div className="mt-auto pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(note.tags || []).slice(0, 2).map((tagId) => {
            const activeTag = tags.find((t) => t.id === tagId);
            if (!activeTag) return null;
            const styleConfig = TAG_COLOR_MAP[activeTag.color] || TAG_COLOR_MAP.lavender;
            return (
              <span
                key={tagId}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${styleConfig.badge}`}
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: styleConfig.dot }} />
                <span>#{activeTag.name}</span>
              </span>
            );
          })}
        </div>

        {/* Color Palette Picker Dots on Hover */}
        {!showTrash && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateNote(note.id, { colorIndex: idx });
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-transform hover:scale-125 cursor-pointer ${
                  colorIndex === idx
                    ? 'scale-110 border-black dark:border-white shadow-xs'
                    : 'border-black/20 dark:border-white/20'
                }`}
                style={{
                  backgroundColor: `var(--color-note-border-${idx}, var(--color-accent))`,
                }}
                title={`Tint ${idx}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NoteCard;
