import React, { useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import useSlateStore from '../../store/useSlateStore';
import {
  Maximize2, Minimize2, Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Feather, CalendarDays, ChevronLeft, ChevronRight,
  Sparkles, CheckSquare, Clock, ArrowRight, Heading2
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
        ? 'bg-[#C2531C] text-white shadow-2xs font-bold'
        : 'text-[#6B665F] hover:text-[#1F1D1A] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
    }`}
  >
    {children}
  </button>
);

const formatDateKey = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const JournalPanel = ({ onClose }) => {
  const {
    journals = {},
    updateJournal,
    quickCapture,
    triggerConfetti,
  } = useSlateStore();

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCursive, setIsCursive] = useState(false);
  const [taskSentNotice, setTaskSentNotice] = useState(false);

  // Each day stores its own persistent data under journals[selectedDateKey]
  const currentJournalData = journals[selectedDateKey] || {
    title: '',
    content1: '',
    isCursive: false,
  };

  const selectedDateObj = useMemo(() => {
    const parts = selectedDateKey.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }, [selectedDateKey]);

  const displayDateFormatted = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isToday = selectedDateKey === todayKey;

  // Day navigation
  const prevDay = () => {
    const d = new Date(selectedDateObj.getTime() - 86400000);
    setSelectedDateKey(formatDateKey(d));
  };

  const nextDay = () => {
    const d = new Date(selectedDateObj.getTime() + 86400000);
    setSelectedDateKey(formatDateKey(d));
  };

  const jumpToToday = () => {
    setSelectedDateKey(todayKey);
  };

  // TipTap Rich Text Editor
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
        placeholder: 'Write daily notes, commitments, bullet points, or reflections…',
      }),
    ],
    content: currentJournalData.content1 || '',
    editorProps: {
      attributes: {
        class: 'outline-none h-full min-h-[340px] text-sm focus:outline-none select-text leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateJournal(selectedDateKey, {
        content1: html,
        updatedAt: Date.now(),
      });
    },
  }, [selectedDateKey]);

  // Sync editor content whenever switching days
  useEffect(() => {
    if (editor && currentJournalData.content1 !== undefined) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== currentJournalData.content1) {
        editor.commands.setContent(currentJournalData.content1 || '');
      }
    }
  }, [selectedDateKey, editor]);

  const handleTitleChange = (e) => {
    updateJournal(selectedDateKey, {
      title: e.target.value,
      updatedAt: Date.now(),
    });
  };

  // Convert Bullet points / Lines to Scheduled Tasks on Day Spine / Calendar
  const handleExtractTasks = (e) => {
    if (!editor) return;
    const text = editor.getText();
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let addedCount = 0;
    lines.forEach((line) => {
      // Clean leading dashes, bullets, or numbers
      const cleanTitle = line.replace(/^[-*•\d.]+\s*/, '').trim();
      if (cleanTitle.length > 2) {
        quickCapture(cleanTitle, {
          scheduledDate: selectedDateKey,
          type: 'task',
          energyDomain: 'focus',
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      triggerConfetti(e?.clientX || window.innerWidth / 2, e?.clientY || 100);
      setTaskSentNotice(true);
      setTimeout(() => setTaskSentNotice(false), 3000);
    }
  };

  const renderContent = (isLightbox = false) => (
    <div className="flex flex-col flex-1 h-full overflow-hidden p-5 sm:p-7 bg-[#FDFCF9] select-text">
      {/* Top Temporal Navigator */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-full p-0.5 border border-[#E8E3D8]">
            <button
              type="button"
              onClick={prevDay}
              className="p-1 rounded-full text-[#6B665F] hover:text-[#1F1D1A] hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={jumpToToday}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isToday
                  ? 'bg-[#C2531C] text-white shadow-2xs'
                  : 'text-[#6B665F] hover:text-[#1F1D1A]'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={nextDay}
              className="p-1 rounded-full text-[#6B665F] hover:text-[#1F1D1A] hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-serif font-semibold text-[#1F1D1A] hidden sm:inline ml-1">
            {displayDateFormatted}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Bridge to Tasks */}
          <button
            type="button"
            onClick={handleExtractTasks}
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FAF5EB] text-[#7D5E29] border border-[#EBDCBF] hover:bg-[#F2E7D3] transition-all cursor-pointer"
            title="Convert notes and bullet points into scheduled tasks"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#C2531C]" />
            <span>{taskSentNotice ? 'Added to Tasks!' : 'Send to Tasks'}</span>
          </button>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-[#6B665F] hover:text-[#1F1D1A]"
            title={isZoomed ? 'Exit Focus Mode' : 'Focus Mode'}
          >
            {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Entry Title Input */}
      <input
        type="text"
        value={currentJournalData.title || ''}
        onChange={handleTitleChange}
        placeholder={`Notes for ${displayDateFormatted}…`}
        className="w-full bg-transparent outline-none font-serif font-bold text-xl mb-3 pb-1 border-b border-[#E8E3D8] text-[#1F1D1A] placeholder:text-[#969087] transition-colors"
      />

      {/* Formatting Toolbar: Bold, Italic, Underline, Bullet list, Numbered list, Heading, Cursive */}
      {editor && (
        <div className="flex items-center gap-1 pb-2.5 mb-3 border-b border-[#E8E3D8] flex-shrink-0 flex-wrap">
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

          <div className="w-px h-3.5 mx-1 bg-[#E8E3D8]" />

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

          <FormatBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </FormatBtn>

          <div className="w-px h-3.5 mx-1 bg-[#E8E3D8]" />

          {/* Cursive Handwriting Toggle */}
          <button
            type="button"
            onClick={() => setIsCursive(!isCursive)}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
              isCursive
                ? 'bg-[#C2531C] text-white shadow-2xs font-bold'
                : 'text-[#6B665F] hover:text-[#1F1D1A] hover:bg-black/[0.05]'
            }`}
            title="Toggle Handwritten Cursive Font"
          >
            <Feather className="w-3.5 h-3.5" />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '16px' }}>Cursive</span>
          </button>
        </div>
      )}

      {/* Writing Area with Ruled Ledger Margin */}
      <div
        className="flex-1 overflow-y-auto pr-3 pt-1 border-l-2 border-[#E5C2AE] pl-5 ml-1 transition-all"
        style={{
          fontFamily: isCursive ? "'Caveat', cursive" : "var(--font-serif)",
          fontSize: isCursive ? '20px' : '15px',
          lineHeight: isCursive ? '1.9' : '1.7',
          color: '#1F1D1A',
        }}
      >
        {editor && <EditorContent editor={editor} />}
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full flex flex-col h-full bg-[#FDFCF9] border-l border-[#E8E3D8] shadow-xs">
        {renderContent(false)}
      </div>

      {/* Focus Mode Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="w-full max-w-3xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-[#E8E3D8] bg-[#FDFCF9] animate-scale-in"
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
