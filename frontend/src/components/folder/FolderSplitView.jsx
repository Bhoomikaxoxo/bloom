import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import useSlateStore from '../../store/useSlateStore';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Heading2, Feather, Plus, CheckSquare, FileText, Check, Trash2,
  ExternalLink, Sparkles, Pin, Star, Link as LinkIcon, AlertCircle,
  Clock, ArrowRight, X, Layers
} from 'lucide-react';

const FormatBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center ${
      active
        ? 'bg-[var(--ink,#1B2420)] text-[var(--bone,#EFE9DC)] shadow-2xs font-semibold'
        : 'text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] hover:bg-black/5 dark:hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

const FolderSplitView = ({ folder }) => {
  const notes = useSlateStore((s) => s.notes) || [];
  const folders = useSlateStore((s) => s.folders) || [];
  const journals = useSlateStore((s) => s.journals) || {};
  const highlightedCardId = useSlateStore((s) => s.highlightedCardId);
  const updateJournal = useSlateStore((s) => s.updateJournal);
  const quickCapture = useSlateStore((s) => s.quickCapture);
  const setTaskStatus = useSlateStore((s) => s.setTaskStatus);
  const deleteNote = useSlateStore((s) => s.deleteNote);
  const updateNote = useSlateStore((s) => s.updateNote);
  const setOpenNoteId = useSlateStore((s) => s.setOpenNoteId);
  const setActiveFolderId = useSlateStore((s) => s.setActiveFolderId);
  const triggerConfetti = useSlateStore((s) => s.triggerConfetti);
  const setHighlightedCardId = useSlateStore((s) => s.setHighlightedCardId);

  const folderId = folder?.id || 'folder-work';
  const folderKey = `folder-${folderId}`;
  
  // Folder notes persistent data
  const folderJournal = journals[folderKey] || journals[folderId] || {
    title: `${folder?.name || 'Folder'} Notes & Thoughts`,
    content1: '',
    isCursive: false,
  };

  const [isCursive, setIsCursive] = useState(folderJournal.isCursive || false);
  const [quickCardTitle, setQuickCardTitle] = useState('');
  const [quickCardType, setQuickCardType] = useState('task'); // 'task' | 'note'
  const [cardFilter, setCardFilter] = useState('all'); // 'all' | 'tasks' | 'context'
  
  // Underline context popover state
  const [activeUnderlineContext, setActiveUnderlineContext] = useState(null); // { text, x, y, card }
  const editorContainerRef = useRef(null);
  const cardListRef = useRef(null);

  // Cards belonging to this folder
  const folderCards = useMemo(() => {
    return notes.filter((n) => n.folderId === folderId && n.deletedAt === null)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (b.status === 'completed' && a.status !== 'completed') return -1;
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      });
  }, [notes, folderId]);

  // Statistics
  const tasksList = useMemo(() => {
    return folderCards.filter((c) => c.type === 'task' || c.type === 'checklist');
  }, [folderCards]);

  const completedTasksCount = useMemo(() => {
    return tasksList.filter((c) => c.status === 'completed').length;
  }, [tasksList]);

  const taskProgressPercent = tasksList.length > 0
    ? Math.round((completedTasksCount / tasksList.length) * 100)
    : 0;

  // Filtered cards in right pane
  const displayedCards = useMemo(() => {
    if (cardFilter === 'tasks') {
      return folderCards.filter((c) => c.type === 'task' || c.type === 'checklist');
    }
    if (cardFilter === 'context') {
      return folderCards.filter((c) => Boolean(c.linkedReference));
    }
    return folderCards;
  }, [folderCards, cardFilter]);

  // TipTap Rich Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { levels: [2, 3] },
      }),
      Underline,
      Typography,
      Placeholder.configure({
        placeholder: `Write thoughts, meetings, or references for ${folder?.name || 'this collection'}… Underline anything to link context cards.`,
      }),
    ],
    content: folderJournal.content1 || '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[480px] text-sm leading-relaxed focus:outline-none select-text',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateJournal(folderKey, {
        content1: html,
        title: folderJournal.title,
        updatedAt: Date.now(),
      });
    },
  }, [folderKey]);

  // Synchronize editor content if switching folders
  useEffect(() => {
    if (editor && folderJournal.content1 !== undefined) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== folderJournal.content1) {
        editor.commands.setContent(folderJournal.content1 || '');
      }
    }
  }, [folderKey, editor]);

  // Scroll to and highlight card in right pane when highlightedCardId changes
  useEffect(() => {
    if (!highlightedCardId || !cardListRef.current) return;
    const cardEl = cardListRef.current.querySelector(`[data-card-id="${highlightedCardId}"]`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlightedCardId]);

  // Listen for clicks inside editor on underlined <u> elements
  const handleEditorClick = (e) => {
    const underlineEl = e.target.closest('u');
    if (!underlineEl) {
      setActiveUnderlineContext(null);
      return;
    }

    const underlinedText = underlineEl.textContent.trim();
    if (!underlinedText) return;

    // Find if a card in this folder matches the underlined phrase
    const match = folderCards.find((c) => {
      if (c.linkedReference && c.linkedReference.toLowerCase() === underlinedText.toLowerCase()) return true;
      if (c.title && c.title.toLowerCase().includes(underlinedText.toLowerCase())) return true;
      if (underlinedText.toLowerCase().includes(c.title?.toLowerCase())) return true;
      return false;
    });

    const rect = underlineEl.getBoundingClientRect();
    const containerRect = editorContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

    setActiveUnderlineContext({
      text: underlinedText,
      x: rect.left - containerRect.left,
      y: rect.bottom - containerRect.top + 8,
      card: match || null,
    });

    if (match) {
      setHighlightedCardId(match.id);
      setTimeout(() => setHighlightedCardId(null), 3000);
    }
  };

  // Convert selected text in editor into an underlined context card
  const handleCreateContextCardFromSelection = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ').trim();

    if (!selectedText) {
      // If nothing selected, direct user focus to the quick card capture on the right
      const quickCardInput = document.querySelector('input[placeholder*="Add a task or context card"]');
      if (quickCardInput) {
        quickCardInput.focus();
      }
      return;
    }

    const trimmed = selectedText.trim();

    // Underline the selected text in editor if selected
    if (selectedText) {
      editor.chain().focus().setUnderline().run();
    }

    // Create the card attached to this folder with linkedReference
    const newId = quickCapture(trimmed, {
      folderId,
      type: 'task',
      linkedReference: trimmed,
      energyDomain: 'focus',
    });

    setHighlightedCardId(newId);
    setTimeout(() => setHighlightedCardId(null), 3000);
    setActiveUnderlineContext(null);
  };

  const handleCreateCardFromUnderlineContext = () => {
    if (!activeUnderlineContext?.text) return;
    const text = activeUnderlineContext.text;

    const newId = quickCapture(text, {
      folderId,
      type: 'task',
      linkedReference: text,
      energyDomain: 'focus',
    });

    setHighlightedCardId(newId);
    setTimeout(() => setHighlightedCardId(null), 3000);
    setActiveUnderlineContext((prev) => ({
      ...prev,
      card: { id: newId, title: text, type: 'task', status: 'todo' },
    }));
  };

  const handleQuickAddCard = (e) => {
    e.preventDefault();
    if (!quickCardTitle.trim()) return;

    const newId = quickCapture(quickCardTitle.trim(), {
      folderId,
      type: quickCardType,
      energyDomain: 'focus',
    });

    setQuickCardTitle('');
    setHighlightedCardId(newId);
    setTimeout(() => setHighlightedCardId(null), 2500);
  };

  const handleToggleTaskStatus = (card, e) => {
    e.stopPropagation();
    const nextStatus = card.status === 'completed' ? 'todo' : 'completed';
    setTaskStatus(card.id, nextStatus);

    if (nextStatus === 'completed') {
      const remaining = tasksList.filter((t) => t.id !== card.id && t.status !== 'completed').length;
      if (remaining === 0) {
        triggerConfetti(e.clientX, e.clientY);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[var(--bone,#EFE9DC)] text-[var(--ink,#1B2420)] select-text">
      
      {/* =========================================================================
          LEFT PANE: Folder Notes / Manuscript Canvas (60% on desktop)
          ========================================================================= */}
      <div
        ref={editorContainerRef}
        className="flex-1 lg:w-3/5 flex flex-col h-full border-r border-[var(--line,#D8D0BC)] overflow-hidden relative bg-[var(--bone,#EFE9DC)]"
      >
        {/* Top Manuscript Navigation Bar */}
        <div className="px-6 py-4 border-b border-[var(--line,#D8D0BC)] flex items-center justify-between gap-3 bg-[var(--bone,#EFE9DC)] flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl flex-shrink-0">{folder?.icon || '📁'}</span>
            <div className="truncate">
              <h2 className="font-serif italic font-medium text-lg sm:text-xl text-[var(--ink,#1B2420)] truncate leading-tight">
                {folder?.name || 'Folder'} · Manuscript Notes
              </h2>
              <span className="text-[11.5px] font-sans text-[var(--sage,#6B7F63)]">
                Rich notes with linked task references
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Create Linked Context Card from selection button */}
            <button
              type="button"
              onClick={handleCreateContextCardFromSelection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] hover:border-[var(--brick,#A8491F)] text-[12px] font-sans font-medium text-[var(--ink,#1B2420)] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Select any text and click to create an underlined context card"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[var(--brick,#A8491F)]" />
              <span className="hidden sm:inline">Link Context Card</span>
            </button>

            {/* Cursive Handwriting Toggle */}
            <button
              type="button"
              onClick={() => setIsCursive(!isCursive)}
              className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                isCursive
                  ? 'bg-[var(--gold,#C9A135)] text-[var(--bone,#EFE9DC)] shadow-2xs font-semibold'
                  : 'bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)]'
              }`}
              title="Toggle Handwriting Cursive Font"
            >
              <Feather className="w-3.5 h-3.5" />
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: '15px' }}>Cursive</span>
            </button>
          </div>
        </div>

        {/* Inline Folder Selector Row */}
        <div className="px-6 py-2 bg-[var(--bone-dim,#E4DDCC)]/40 border-b border-[var(--line,#D8D0BC)] flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
          <span className="text-[11px] font-sans font-medium text-[var(--sage,#6B7F63)] mr-1">
            Folders:
          </span>
          {folders.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFolderId(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                f.id === folderId
                  ? 'bg-[var(--card,#F7F4EC)] text-[var(--ink,#1B2420)] font-semibold border border-[var(--line,#D8D0BC)] shadow-2xs'
                  : 'text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] hover:bg-black/5'
              }`}
            >
              <span>{f.icon || '📁'}</span>
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        {/* Formatting Toolbar */}
        {editor && (
          <div className="px-6 py-2 border-b border-[var(--line,#D8D0BC)] flex items-center gap-1 bg-[var(--bone,#EFE9DC)]/90 backdrop-blur-xs flex-shrink-0 flex-wrap">
            <FormatBtn
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold (⌘B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </FormatBtn>
            <FormatBtn
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic (⌘I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </FormatBtn>
            <FormatBtn
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline (⌘U) — Click underlined text to link context cards"
            >
              <UnderlineIcon className="w-3.5 h-3.5 text-[var(--brick,#A8491F)]" />
            </FormatBtn>

            <div className="w-px h-3.5 mx-1.5 bg-[var(--line,#D8D0BC)]" />

            <FormatBtn
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </FormatBtn>
            <FormatBtn
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet Points"
            >
              <List className="w-3.5 h-3.5" />
            </FormatBtn>
            <FormatBtn
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </FormatBtn>

            <div className="ml-auto flex items-center gap-2 text-[11px] font-sans text-[var(--sage-dim,#9DAC95)]">
              <span className="hidden sm:inline">Tip: Click any underlined word to view its card</span>
            </div>
          </div>
        )}

        {/* Scrollable Manuscript Content Area with Ruled Ledger Margin */}
        <div
          onClick={handleEditorClick}
          className="flex-1 overflow-y-auto px-6 sm:px-9 py-6 select-text transition-all"
          style={{
            fontFamily: isCursive ? "'Caveat', cursive" : "var(--font-serif, 'Fraunces', serif)",
            fontSize: isCursive ? '20px' : '15px',
            lineHeight: isCursive ? '1.9' : '1.75',
          }}
        >
          <div className="border-l-2 border-[var(--gold,#C9A135)] pl-6 min-h-[480px]">
            {editor && <EditorContent editor={editor} />}
          </div>
        </div>

        {/* Floating Context Popover for Underlined Phrases */}
        {activeUnderlineContext && (
          <div
            className="absolute z-40 bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] rounded-xl shadow-xl p-3.5 max-w-sm animate-scale-in"
            style={{
              left: Math.min(Math.max(activeUnderlineContext.x, 20), 380),
              top: activeUnderlineContext.y,
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--line,#D8D0BC)]">
              <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[var(--brick,#A8491F)]">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Underlined Context Reference</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveUnderlineContext(null)}
                className="text-[var(--sage-dim,#9DAC95)] hover:text-[var(--ink,#1B2420)] p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="font-serif italic text-[14px] text-[var(--ink,#1B2420)] font-medium mb-2">
              "{activeUnderlineContext.text}"
            </div>

            {activeUnderlineContext.card ? (
              <div className="space-y-2">
                <div className="bg-[var(--bone,#EFE9DC)] p-2.5 rounded-lg border border-[var(--line,#D8D0BC)] text-xs font-sans">
                  <div className="flex items-center justify-between gap-1 mb-1 font-semibold text-[var(--ink,#1B2420)]">
                    <span className="truncate">{activeUnderlineContext.card.title}</span>
                    <span className="text-[10px] text-[var(--sage,#6B7F63)] uppercase font-mono">
                      {activeUnderlineContext.card.type}
                    </span>
                  </div>
                  {activeUnderlineContext.card.timeBlock && (
                    <div className="text-[11px] text-[var(--sage-dim,#9DAC95)] flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{activeUnderlineContext.card.timeBlock}</span>
                    </div>
                  )}
                  <div className="text-[11.5px] text-[var(--ink-soft,#3A463E)] line-clamp-2">
                    {activeUnderlineContext.card.content || 'Active task tracking context.'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHighlightedCardId(activeUnderlineContext.card.id);
                      setActiveUnderlineContext(null);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-[var(--ink,#1B2420)] text-[var(--bone,#EFE9DC)] text-xs font-sans font-medium text-center hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Highlight in Tasks →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenNoteId(activeUnderlineContext.card.id);
                      setActiveUnderlineContext(null);
                    }}
                    className="py-1.5 px-3 rounded-lg border border-[var(--line,#D8D0BC)] text-xs font-sans text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] cursor-pointer"
                  >
                    Open Card
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-sans text-[var(--ink-soft,#3A463E)] mb-3">
                  No context card has been linked to this underlined phrase yet.
                </p>
                <button
                  type="button"
                  onClick={handleCreateCardFromUnderlineContext}
                  className="w-full py-1.5 rounded-lg bg-[var(--brick,#A8491F)] text-white text-xs font-sans font-medium text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Context Card for "{activeUnderlineContext.text}"</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          RIGHT PANE: Folder Tasks & Context Cards (40% on desktop)
          ========================================================================= */}
      <div className="flex-1 lg:w-2/5 flex flex-col h-full bg-[var(--card,#F7F4EC)] overflow-hidden">
        
        {/* Right Header: Tasks & Context Cards count + Filter Pills */}
        <div className="p-4 sm:p-5 border-b border-[var(--line,#D8D0BC)] bg-[var(--card,#F7F4EC)] flex-shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="font-serif italic font-medium text-base sm:text-lg text-[var(--ink,#1B2420)]">
                Tasks &amp; Context Cards
              </h3>
              <p className="text-xs font-sans text-[var(--sage,#6B7F63)]">
                {tasksList.length} task{tasksList.length === 1 ? '' : 's'} · {completedTasksCount} completed
              </p>
            </div>

            {/* Task completion percentage pill */}
            {tasksList.length > 0 && (
              <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bone,#EFE9DC)] text-[var(--ink-soft,#3A463E)] border border-[var(--line,#D8D0BC)] font-mono">
                {taskProgressPercent}%
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {tasksList.length > 0 && (
            <div className="h-1.5 w-full bg-[var(--line,#D8D0BC)]/40 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[var(--sage,#6B7F63)] transition-all duration-300 rounded-full"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setCardFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                cardFilter === 'all'
                  ? 'bg-[var(--ink,#1B2420)] text-[var(--bone,#EFE9DC)] font-semibold shadow-2xs'
                  : 'bg-[var(--bone,#EFE9DC)] text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] border border-[var(--line,#D8D0BC)]'
              }`}
            >
              All ({folderCards.length})
            </button>
            <button
              type="button"
              onClick={() => setCardFilter('tasks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                cardFilter === 'tasks'
                  ? 'bg-[var(--ink,#1B2420)] text-[var(--bone,#EFE9DC)] font-semibold shadow-2xs'
                  : 'bg-[var(--bone,#EFE9DC)] text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] border border-[var(--line,#D8D0BC)]'
              }`}
            >
              Tasks ({tasksList.length})
            </button>
            <button
              type="button"
              onClick={() => setCardFilter('context')}
              className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer flex items-center gap-1 ${
                cardFilter === 'context'
                  ? 'bg-[var(--brick,#A8491F)] text-white font-semibold shadow-2xs'
                  : 'bg-[var(--bone,#EFE9DC)] text-[var(--brick,#A8491F)] hover:opacity-85 border border-[var(--line,#D8D0BC)]'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>Underlined Context ({folderCards.filter((c) => Boolean(c.linkedReference)).length})</span>
            </button>
          </div>
        </div>

        {/* Quick Add Task or Card Bar */}
        <form onSubmit={handleQuickAddCard} className="p-3 sm:p-4 border-b border-[var(--line,#D8D0BC)] bg-[var(--bone-dim,#E4DDCC)]/40 flex-shrink-0 flex gap-2">
          <input
            type="text"
            value={quickCardTitle}
            onChange={(e) => setQuickCardTitle(e.target.value)}
            placeholder={`Add task or card for ${folder?.name || 'this folder'}…`}
            className="flex-1 bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] rounded-xl px-3.5 py-2 text-xs font-sans text-[var(--ink,#1B2420)] placeholder:text-[var(--sage-dim,#9DAC95)] outline-none focus:border-[var(--gold,#C9A135)] shadow-2xs"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQuickCardType(quickCardType === 'task' ? 'note' : 'task')}
              className="p-2 rounded-xl border border-[var(--line,#D8D0BC)] bg-[var(--card,#F7F4EC)] text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] text-xs font-sans flex items-center gap-1 cursor-pointer"
              title={quickCardType === 'task' ? 'Type: Task' : 'Type: Note Card'}
            >
              {quickCardType === 'task' ? (
                <CheckSquare className="w-3.5 h-3.5 text-[var(--sage,#6B7F63)]" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-[var(--brick,#A8491F)]" />
              )}
            </button>
            <button
              type="submit"
              className="bg-[var(--ink,#1B2420)] hover:bg-[var(--ink-soft,#3A463E)] active:scale-95 text-[var(--bone,#EFE9DC)] rounded-xl px-3.5 py-2 text-xs font-sans font-medium transition-all cursor-pointer shadow-xs"
            >
              Add
            </button>
          </div>
        </form>

        {/* Scrollable Cards & Tasks Feed */}
        <div ref={cardListRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {displayedCards.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--line,#D8D0BC)]/40 flex items-center justify-center text-[var(--sage-dim,#9DAC95)] mb-2">
                <CheckSquare className="w-5 h-5" />
              </div>
              <p className="font-serif italic text-sm text-[var(--ink-soft,#3A463E)]">
                No items in this collection yet.
              </p>
              <p className="text-xs font-sans text-[var(--sage-dim,#9DAC95)] mt-1">
                Type above or underline text in the notes pane to create context cards.
              </p>
            </div>
          ) : (
            displayedCards.map((card) => {
              const isTask = card.type === 'task' || card.type === 'checklist';
              const isDone = card.status === 'completed';
              const isHighlighted = highlightedCardId === card.id;

              return (
                <div
                  key={card.id}
                  data-card-id={card.id}
                  className={`p-4 rounded-xl border bg-[var(--bone,#EFE9DC)] transition-all duration-300 relative group ${
                    isHighlighted
                      ? 'border-[var(--brick,#A8491F)] ring-2 ring-[var(--brick,#A8491F)]/40 shadow-lg scale-[1.01] bg-white dark:bg-slate-900'
                      : 'border-[var(--line,#D8D0BC)] hover:border-[var(--sage,#6B7F63)] shadow-2xs'
                  } ${isDone ? 'opacity-60' : ''}`}
                >
                  {/* Top Meta Line: Type, Time, Linked Reference Tag */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase font-semibold px-1.5 py-0.2 rounded bg-black/5 text-[var(--ink-soft,#3A463E)]">
                        {card.type}
                      </span>
                      {card.timeBlock && (
                        <span className="text-[11px] font-mono text-[var(--sage,#6B7F63)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{card.timeBlock}</span>
                        </span>
                      )}
                    </div>

                    {/* Linked Reference Pill */}
                    {card.linkedReference && (
                      <span className="text-[10.5px] font-sans font-medium px-2 py-0.5 rounded-full bg-[var(--brick,#A8491F)]/10 text-[var(--brick,#A8491F)] border border-[var(--brick,#A8491F)]/25 flex items-center gap-1">
                        <LinkIcon className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[120px]">"{card.linkedReference}"</span>
                      </span>
                    )}
                  </div>

                  {/* Card Title & Checkbox */}
                  <div className="flex items-start gap-2.5">
                    {isTask ? (
                      <button
                        type="button"
                        onClick={(e) => handleToggleTaskStatus(card, e)}
                        className={`w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-[var(--sage,#6B7F63)] border-[var(--sage,#6B7F63)] text-white'
                            : 'border-[var(--sage-dim,#9DAC95)] hover:border-[var(--brick,#A8491F)] bg-[var(--card,#F7F4EC)]'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </button>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold,#C9A135)] mt-2 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-[14px] font-sans leading-snug cursor-pointer hover:text-[var(--brick,#A8491F)] transition-colors ${
                          isDone
                            ? 'line-through text-[var(--sage-dim,#9DAC95)]'
                            : 'font-medium text-[var(--ink,#1B2420)]'
                        }`}
                        onClick={() => setOpenNoteId(card.id)}
                      >
                        {card.title || 'Untitled Card'}
                      </h4>

                      {/* Card Content Snippet */}
                      {card.content && (
                        <p className="text-[12px] font-sans text-[var(--ink-soft,#3A463E)] mt-1 line-clamp-2 leading-relaxed">
                          {card.content}
                        </p>
                      )}

                      {/* Checklist preview items if checklist */}
                      {card.type === 'checklist' && Array.isArray(card.checklist) && card.checklist.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {card.checklist.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-1.5 text-xs text-[var(--ink-soft,#3A463E)]">
                              <span className={`w-1 h-1 rounded-full ${item.done ? 'bg-[var(--sage,#6B7F63)]' : 'bg-[var(--line,#D8D0BC)]'}`} />
                              <span className={`truncate ${item.done ? 'line-through opacity-60' : ''}`}>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setOpenNoteId(card.id)}
                        className="p-1 rounded text-[var(--sage-dim,#9DAC95)] hover:text-[var(--ink,#1B2420)] cursor-pointer"
                        title="Open full editor"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(card.id)}
                        className="p-1 rounded text-[var(--sage-dim,#9DAC95)] hover:text-red-500 cursor-pointer"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};

export default React.memo(FolderSplitView);

