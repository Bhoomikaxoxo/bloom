import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import useSlateStore from '../../store/useSlateStore';
import {
  Maximize2, Minimize2, Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered
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
        ? 'bg-[var(--color-accent)] text-white shadow-2xs font-bold'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
    }`}
  >
    {children}
  </button>
);

const JournalPanel = () => {
  const {
    activeFolderId,
    folders,
    journals,
    updateJournal,
    journalViewMode,
  } = useSlateStore();

  const [isZoomed, setIsZoomed] = useState(false);
  const [isCursive, setIsCursive] = useState(false);

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const journalKey = activeFolderId || 'global';
  const journalData = journals[journalKey] || { title: '', content1: '' };

  const handleTitleChange = (e) => updateJournal(activeFolderId, { title: e.target.value });

  const displayTitle = journalData.title !== undefined ? journalData.title : '';
  const defaultPlaceholder = activeFolder
    ? `${activeFolder.icon} ${activeFolder.name} · Journal`
    : 'Today';

  const isJournalOnly = journalViewMode === 'journal';
  const panelWidthClass = isJournalOnly
    ? 'w-full flex-1'
    : 'w-full lg:w-[380px] xl:w-[420px] flex-shrink-0';

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Typography,
      Placeholder.configure({
        placeholder: 'Write your thoughts, daily priorities, or notes here…',
      }),
    ],
    content: journalData.content1 || '',
    editorProps: {
      attributes: {
        class: 'outline-none h-full min-h-[300px] text-sm focus:outline-none select-text',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateJournal(activeFolderId, { content1: html });
    },
  }, [journalKey]);

  // Keep editor content in sync when switching folders
  useEffect(() => {
    if (editor && journalData.content1 !== undefined) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== journalData.content1) {
        editor.commands.setContent(journalData.content1 || '');
      }
    }
  }, [journalKey, editor]);

  const renderContent = (isLightbox = false) => (
    <div className="flex flex-col flex-1 h-full overflow-hidden p-5 sm:p-6 bg-[var(--color-card-bg)]">
      {/* Top Date & Focus Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <span className="text-[11px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
          {todayStr}
        </span>
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          title={isZoomed ? 'Exit Focus' : 'Focus mode'}
        >
          {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Page title input */}
      <input
        type="text"
        value={displayTitle}
        onChange={handleTitleChange}
        placeholder={defaultPlaceholder}
        className="w-full bg-transparent outline-none font-bold text-lg mb-3 pb-2 border-b border-black/[0.08] dark:border-white/[0.1] text-[var(--color-text)] placeholder:text-black/25 dark:placeholder:text-white/25 transition-colors"
      />

      {/* Formatting Toolbar */}
      {editor && (
        <div className="flex items-center gap-1 pb-3 mb-2 border-b border-black/[0.06] dark:border-white/[0.08] flex-shrink-0 flex-wrap">
          <FormatBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold (Cmd+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </FormatBtn>
          <FormatBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic (Cmd+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </FormatBtn>
          <FormatBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline (Cmd+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </FormatBtn>

          <div className="w-px h-3.5 mx-1 bg-black/[0.08] dark:bg-white/[0.1]" />

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

          <div className="w-px h-3.5 mx-1 bg-black/[0.08] dark:bg-white/[0.1]" />

          {/* Cursive / Script Handwriting Toggle */}
          <button
            type="button"
            onClick={() => setIsCursive(!isCursive)}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer font-medium ${
              isCursive
                ? 'bg-[var(--color-accent)] text-white shadow-2xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
            }`}
            title="Cursive Handwriting Style"
          >
            <Feather className="w-3.5 h-3.5" />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '15px' }}>Cursive</span>
          </button>
        </div>
      )}

      {/* Journal writing area with subtle luxury notebook margin */}
      <div
        className="flex-1 overflow-y-auto journal-notebook-editor pr-2 pt-2 border-l-2 border-[var(--color-card-border)] pl-4 ml-1"
        style={{
          fontFamily: isCursive ? "'Caveat', cursive" : 'inherit',
          fontSize: isCursive ? '19px' : '14px',
          color: 'var(--color-text)',
        }}
      >
        {editor && <EditorContent editor={editor} />}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`${panelWidthClass} flex flex-col h-full border-r border-black/[0.08] dark:border-white/[0.08] transition-all duration-300 shadow-xs`}
      >
        {renderContent(false)}
      </div>

      {/* Focus Mode Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="w-full max-w-3xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default JournalPanel;
