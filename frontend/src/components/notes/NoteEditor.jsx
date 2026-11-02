import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import useSlateStore from '../../store/useSlateStore';
import {
  X, Pin, Star, Trash2, Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Plus, Check, Trash, Tag, Folder, Type,
  AlignLeft, Clock, Hash, Copy, CheckCheck,
} from 'lucide-react';

// Strip HTML tags for plain-text card preview
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Word count from HTML
function wordCount(html) {
  const text = stripHtml(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

// Toolbar button
const ToolBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all text-sm cursor-pointer ${
      active
        ? 'bg-[var(--color-accent)] text-white shadow-sm'
        : 'text-[var(--color-text-muted)] hover:bg-black/[0.06] hover:text-[var(--color-text)]'
    }`}
  >
    {children}
  </button>
);

const NoteEditor = ({ note, onClose }) => {
  const {
    updateNote,
    deleteNote,
    duplicateNote,
    folders,
    tags,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    triggerConfetti,
  } = useSlateStore();

  const [newItemText, setNewItemText] = useState('');
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const titleRef = useRef(null);
  const newItemRef = useRef(null);

  const handleCopy = () => {
    const textToCopy = `${note.title || 'Untitled'}\n\n${
      note.type === 'checklist'
        ? (note.checklist || []).map(i => `${i.done ? '[x]' : '[ ]'} ${i.text}`).join('\n')
        : (note.content || stripHtml(note.richText || ''))
    }`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const noteFolder = folders.find((f) => f.id === note.folderId);
  const wc = wordCount(note.richText || note.content || '');

  // TipTap editor (text notes only)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Typography,
      Placeholder.configure({
        placeholder: 'Start writing… your thoughts belong here.',
      }),
    ],
    content: note.richText || (note.content ? `<p>${note.content.replace(/\n/g, '</p><p>')}</p>` : ''),
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[200px] prose prose-sm max-w-none focus:outline-none',
        style: 'color: var(--color-text); font-size: 15px; line-height: 1.8;',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const plain = stripHtml(html);
      updateNote(note.id, { richText: html, content: plain, updatedAt: Date.now() });
    },
  }, [note.id]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Focus title on open
  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 80);
  }, []);

  // Checklist helpers
  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addChecklistItem(note.id, newItemText.trim());
      setNewItemText('');
      newItemRef.current?.focus();
    }
  };

  const handleToggle = (itemId, done, event) => {
    const isNowDone = !done;
    if (isNowDone) {
      const items = note.checklist || [];
      const doneCount = items.filter((i) => i.done).length;
      if (doneCount === items.length - 1) {
        triggerConfetti(event?.clientX || window.innerWidth / 2, event?.clientY || window.innerHeight / 2);
      }
    }
    updateChecklistItem(note.id, itemId, { done: isNowDone });
  };

  const colorIndex = note.colorIndex || 1;
  const accentBg = `var(--color-note-${colorIndex})`;
  const accentBorder = `var(--color-note-border-${colorIndex})`;

  const createdDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
  const updatedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color accent top bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: accentBorder }} />

        {/* Header */}
        <div
          className="flex items-start gap-3 px-6 pt-5 pb-4 flex-shrink-0 border-b"
          style={{ borderColor: 'var(--color-card-border)' }}
        >
          {/* Title */}
          <div className="flex-1 min-w-0">
            <input
              ref={titleRef}
              type="text"
              value={note.title}
              onChange={(e) => updateNote(note.id, { title: e.target.value, updatedAt: Date.now() })}
              placeholder="Untitled"
              className="w-full bg-transparent outline-none font-bold text-xl tracking-tight text-[var(--color-text)] placeholder:text-black/25 dark:placeholder:text-white/25"
            />
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                <Clock className="w-3 h-3" />
                {updatedDate}
              </span>
              {note.type === 'text' && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  <Type className="w-3 h-3" />
                  {wc} {wc === 1 ? 'word' : 'words'}
                </span>
              )}
              {note.type === 'checklist' && (note.checklist || []).length > 0 && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  <Check className="w-3 h-3" />
                  {(note.checklist || []).filter(i => i.done).length}/{(note.checklist || []).length} done
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
              title={note.isPinned ? 'Unpin' : 'Pin'}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                note.isPinned
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-bg)]'
                  : 'text-[var(--color-text-muted)] hover:bg-black/[0.05] hover:text-[var(--color-text)]'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
              title={note.isFavorite ? 'Unfavorite' : 'Favorite'}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                note.isFavorite
                  ? 'text-amber-500 bg-amber-50'
                  : 'text-[var(--color-text-muted)] hover:bg-black/[0.05] hover:text-[var(--color-text)]'
              }`}
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              title={copied ? 'Copied to clipboard!' : 'Copy note text'}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-black/[0.05] hover:text-[var(--color-text)] transition-all cursor-pointer flex items-center gap-1"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                const dupId = duplicateNote(note.id);
                if (dupId) onClose();
              }}
              title="Duplicate note"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-black/[0.05] hover:text-[var(--color-text)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => { deleteNote(note.id); onClose(); }}
              title="Move to Memory Box"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-card-border)' }} />
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-black/[0.05] hover:text-[var(--color-text)] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rich text toolbar (text notes only) */}
        {note.type === 'text' && editor && (
          <div
            className="flex items-center gap-1 px-6 py-2 flex-shrink-0 border-b"
            style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'rgba(0,0,0,0.015)' }}
          >
            <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Cmd+B)">
              <Bold className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Cmd+I)">
              <Italic className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Cmd+U)">
              <UnderlineIcon className="w-3.5 h-3.5" />
            </ToolBtn>

            <div className="w-px h-4 mx-1" style={{ backgroundColor: 'var(--color-card-border)' }} />

            <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
              <List className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
              <ListOrdered className="w-3.5 h-3.5" />
            </ToolBtn>

            <div className="w-px h-4 mx-1" style={{ backgroundColor: 'var(--color-card-border)' }} />

            <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading">
              <span className="text-[11px] font-bold">H</span>
            </ToolBtn>

            <div className="flex-1" />

            {/* Color picker inline */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateNote(note.id, { colorIndex: idx })}
                  style={{ backgroundColor: `var(--color-note-${idx})`, borderColor: colorIndex === idx ? `var(--color-note-border-${idx})` : 'transparent' }}
                  className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${colorIndex === idx ? 'scale-110 ring-1 ring-offset-1 ring-[var(--color-note-border-' + idx + ')]' : ''}`}
                  title={`Color ${idx}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Checklist toolbar */}
        {note.type === 'checklist' && (
          <div
            className="flex items-center gap-3 px-6 py-2 flex-shrink-0 border-b"
            style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'rgba(0,0,0,0.015)' }}
          >
            {(note.checklist || []).length > 0 && (() => {
              const done = (note.checklist || []).filter(i => i.done).length;
              const total = (note.checklist || []).length;
              const pct = Math.round((done / total) * 100);
              return (
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-card-border)' }}>
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 16 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, var(--color-accent), var(--color-note-border-2))` }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    {pct}%
                  </span>
                </div>
              );
            })()}

            <div className="flex items-center gap-1 ml-auto">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateNote(note.id, { colorIndex: idx })}
                  style={{ backgroundColor: `var(--color-note-${idx})` }}
                  className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${colorIndex === idx ? 'border-[var(--color-accent)] scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 select-text">
          {note.type === 'text' && editor && (
            <EditorContent editor={editor} className="min-h-[200px]" />
          )}

          {note.type === 'checklist' && (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {(note.checklist || []).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 group/item py-0.5"
                  >
                    <button
                      type="button"
                      onClick={(e) => handleToggle(item.id, item.done, e)}
                      className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                        item.done
                          ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                          : 'border-black/20 bg-white/60 hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateChecklistItem(note.id, item.id, { text: e.target.value })}
                      className={`flex-1 bg-transparent outline-none text-sm font-medium transition-all text-[var(--color-text)] ${
                        item.done ? 'line-through opacity-40' : 'opacity-90'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => deleteChecklistItem(note.id, item.id)}
                      className="opacity-0 group-hover/item:opacity-100 p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Remove"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <form onSubmit={handleAddItem} className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px dashed var(--color-card-border)' }}>
                <div className="w-5 h-5 flex-shrink-0 rounded-md border-2 border-dashed flex items-center justify-center" style={{ borderColor: 'var(--color-text-muted)' }}>
                  <Plus className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <input
                  ref={newItemRef}
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add a task… press Enter to save"
                  className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text)] placeholder:text-slate-400"
                />
              </form>
            </div>
          )}
        </div>

        {/* Footer: folder, tags, timestamps */}
        <div
          className="flex items-center gap-2 px-6 py-3 flex-shrink-0 border-t flex-wrap"
          style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'rgba(0,0,0,0.015)' }}
        >
          {/* Folder picker */}
          <div className="relative">
            <button
              onClick={() => setShowFolderMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
              style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-card-border)', backgroundColor: 'white' }}
            >
              <span>{noteFolder ? noteFolder.icon : '📁'}</span>
              <span>{noteFolder ? noteFolder.name : 'No folder'}</span>
            </button>
            <AnimatePresence>
              {showFolderMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute bottom-full left-0 mb-1.5 w-44 bg-white border border-black/[0.08] rounded-xl shadow-lg p-1.5 z-50"
                >
                  <button onClick={() => { updateNote(note.id, { folderId: null }); setShowFolderMenu(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 font-medium cursor-pointer">
                    📁 No folder
                  </button>
                  {folders.map((f) => (
                    <button key={f.id} onClick={() => { updateNote(note.id, { folderId: f.id }); setShowFolderMenu(false); }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 font-medium cursor-pointer flex items-center gap-1.5 ${note.folderId === f.id ? 'bg-slate-50 font-semibold' : ''}`}>
                      <span>{f.icon}</span><span>{f.name}</span>
                      {note.folderId === f.id && <Check className="w-3 h-3 ml-auto text-[var(--color-accent)]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tag picker */}
          <div className="relative">
            <button
              onClick={() => setShowTagMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
              style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-card-border)', backgroundColor: 'white' }}
            >
              <Hash className="w-3 h-3" />
              {(note.tags || []).length > 0 ? `${(note.tags || []).length} tag${(note.tags || []).length > 1 ? 's' : ''}` : 'Tags'}
            </button>
            <AnimatePresence>
              {showTagMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute bottom-full left-0 mb-1.5 w-48 bg-white border border-black/[0.08] rounded-xl shadow-lg p-1.5 z-50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: 'var(--color-text-muted)' }}>Tags</p>
                  {tags.map((t) => {
                    const has = note.tags?.includes(t.id);
                    return (
                      <button key={t.id}
                        onClick={() => {
                          const cur = note.tags || [];
                          updateNote(note.id, { tags: has ? cur.filter(id => id !== t.id) : [...cur, t.id] });
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 font-medium cursor-pointer flex items-center justify-between ${has ? 'bg-slate-50' : ''}`}
                      >
                        <span>#{t.name}</span>
                        {has && <Check className="w-3 h-3 text-[var(--color-accent)]" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Existing tags display */}
          {(note.tags || []).map((tagId) => {
            const t = tags.find(x => x.id === tagId);
            if (!t) return null;
            return (
              <span key={tagId} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
                #{t.name}
              </span>
            );
          })}

          <div className="flex-1" />
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            Created {createdDate}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NoteEditor;

