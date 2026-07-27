import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import { themes } from '../../utils/theme-config';
import { StarPawCheckbox, StickerBadge } from '../ui/Doodles';
import { Pin, Star, Trash2, Folder, Tag, Plus, Check, Undo, Trash, Camera } from 'lucide-react';

// --- DECORATIVE TRIMS ---
const TornTrim = () => (
  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute top-[-1.5px] left-0 w-full h-3.5 text-[var(--paper-color)] pointer-events-none z-10">
    <path d="M0 0 L100 0 L100 8 L95 6 L90 9 L85 5 L80 8 L75 6 L70 9 L65 5 L60 8 L55 6 L50 8 L45 5 L40 8 L35 6 L30 9 L25 5 L20 8 L15 6 L10 9 L5 5 L0 8 Z" fill="currentColor" stroke="var(--ink-color)" strokeWidth="1.2" />
  </svg>
);

const ScallopedTrim = () => (
  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-3 text-[var(--accent-color)] pointer-events-none z-10">
    <path d="M0 10 Q5 0 10 10 Q15 0 20 10 Q25 0 30 10 Q35 0 40 10 Q45 0 50 10 Q55 0 60 10 Q65 0 70 10 Q75 0 80 10 Q85 0 90 10 Q95 0 100 10 Z" fill="currentColor" stroke="var(--ink-color)" strokeWidth="1" />
  </svg>
);

const WaveTrim = () => (
  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-3 text-[var(--accent-color)] pointer-events-none z-10">
    <path d="M0 10 C15 0 35 0 50 10 C65 20 85 20 100 10 L100 0 L0 0 Z" fill="currentColor" stroke="var(--ink-color)" strokeWidth="1" />
  </svg>
);

// --- DECORATIVE STICKERS ---
const FlowerSticker = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 absolute top-1 right-1 pointer-events-none z-10">
    <g transform="translate(12,12)">
      <circle r="2" fill="var(--flower-center, #F5C84C)" />
      <circle cx="-5" r="3.5" fill="var(--flower-color, #E8536F)" stroke="var(--ink-color)" strokeWidth="1" />
      <circle cx="5" r="3.5" fill="var(--flower-color, #E8536F)" stroke="var(--ink-color)" strokeWidth="1" />
      <circle cy="-5" r="3.5" fill="var(--flower-color, #E8536F)" stroke="var(--ink-color)" strokeWidth="1" />
      <circle cy="5" r="3.5" fill="var(--flower-color, #E8536F)" stroke="var(--ink-color)" strokeWidth="1" />
    </g>
  </svg>
);


const DaisySticker = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 absolute top-0.5 right-0.5 pointer-events-none z-10">
    <g transform="translate(15,15)">
      <ellipse rx="3" ry="7.5" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(0)" />
      <ellipse rx="3" ry="7.5" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(72)" />
      <ellipse rx="3" ry="7.5" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(144)" />
      <ellipse rx="3" ry="7.5" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(216)" />
      <ellipse rx="3" ry="7.5" fill="white" stroke="var(--ink-color)" strokeWidth="1.2" transform="rotate(288)" />
      <circle r="3.5" fill="#F5C84C" stroke="var(--ink-color)" stroke-width="1.2" />
    </g>
  </svg>
);

const TapeSticker = () => (
  <svg viewBox="0 0 50 20" className="w-9 h-4 absolute top-0.5 right-0.5 rotate-12 pointer-events-none z-10" fill="none" stroke="var(--accent-color)" strokeWidth="2.5">
    <path d="M2 4 L48 2 L46 18 L4 16 Z" fill="rgba(155, 133, 196, 0.15)" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="6" x2="8" y2="14" stroke-dasharray="2 2" />
  </svg>
);

const WildflowerSticker = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 absolute top-0.5 right-0.5 pointer-events-none z-10">
    <circle cx="12" cy="12" r="2" fill="var(--poppy-red, #D9534F)" stroke="var(--ink-color)" strokeWidth="1.2" />
    <circle cx="8" cy="12" r="2.5" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.2" />
    <circle cx="16" cy="12" r="2.5" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.2" />
    <circle cx="12" cy="8" r="2.5" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.2" />
    <circle cx="12" cy="17" r="2.5" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.2" />
  </svg>
);

const StarSticker = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 absolute top-0.5 right-0.5 pointer-events-none z-10" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.5">
    <path d="M15 2 L18 10 L26 12 L18 14 L15 22 L12 14 L4 12 L12 10 Z" strokeLinejoin="round" />
  </svg>
);

const PawStamp = () => (
  <div className="absolute bottom-1 right-1 w-5 h-5 opacity-25 pointer-events-none z-10" style={{ color: 'var(--ink-color)' }}>
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12 13c-1.5 0-3 .8-3 2.2s1 2.2 3 2.2 3-.8 3-2.2-1.5-2.2-3-2.2zm-4-2.5c-.7 0-1.2.6-1.2 1.2s.5 1.2 1.2 1.2 1.2-.6 1.2-1.2-.5-1.2-1.2-1.2zm8 0c-.7 0-1.2.6-1.2 1.2s.5 1.2 1.2 1.2 1.2-.6 1.2-1.2-.5-1.2-1.2-1.2zm-5-2.5c-.7 0-1.2.6-1.2 1.2s.5 1.2 1.2 1.2 1.2-.6 1.2-1.2-.5-1.2-1.2-1.2zm2 0c-.7 0-1.2.6-1.2 1.2s.5 1.2 1.3 1.2 1.2-.6 1.2-1.2-.5-1.2-1.2-1.2z" fill="currentColor" />
    </svg>
  </div>
);

const MushroomSticker = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 absolute top-0.5 right-0.5 pointer-events-none z-10">
    <path d="M12 25 Q12 15 15 15 Q18 15 18 25" fill="var(--paper-color)" stroke="var(--ink-color)" strokeWidth="1.5" />
    <path d="M6 17 C6 8 24 8 24 17 Z" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.5" />
  </svg>
);

const LeafSticker = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 absolute top-0.5 right-0.5 pointer-events-none z-10">
    <path d="M6 24 C9 12 21 6 24 6 C24 6 18 18 6 24 Z" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.5" />
    <line x1="6" y1="24" x2="20" y2="10" stroke="var(--ink-color)" strokeWidth="1.2" />
  </svg>
);

const SparkleSticker = () => (
  <svg viewBox="0 0 30 30" className="w-5 h-5 absolute top-0.5 right-0.5 pointer-events-none z-10" fill="var(--accent-color)" stroke="var(--ink-color)" strokeWidth="1.5">
    <path d="M15 3 L17.5 12.5 L27 15 L17.5 17.5 L15 27 L12.5 17.5 L3 15 L12.5 12.5 Z" strokeLinejoin="round" />
  </svg>
);

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
    addSticker,
    updateStickerPosition,
    removeSticker,
    triggerConfetti,
  } = useSlateStore();

  const [relativeTime, setRelativeTime] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showStickerMenu, setShowStickerMenu] = useState(false);
  const folderMenuRef = useRef(null);
  const tagMenuRef = useRef(null);
  const stickerMenuRef = useRef(null);
  const cardRef = useRef(null);

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
      if (stickerMenuRef.current && !stickerMenuRef.current.contains(e.target)) {
        setShowStickerMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map color index to soft pastel styles
  const colorIndex = note.colorIndex || 1;
  const cardColorClasses = {
    1: 'bg-[var(--color-note-1)] text-[var(--color-note-text-1)] border-[var(--color-note-1)]/40 shadow-md',
    2: 'bg-[var(--color-note-2)] text-[var(--color-note-text-2)] border-[var(--color-note-2)]/40 shadow-md',
    3: 'bg-[var(--color-note-3)] text-[var(--color-note-text-3)] border-[var(--color-note-3)]/40 shadow-md',
    4: 'bg-[var(--color-note-4)] text-[var(--color-note-text-4)] border-[var(--color-note-4)]/40 shadow-md',
    5: 'bg-[var(--color-note-5)] text-[var(--color-note-text-5)] border-[var(--color-note-5)]/40 shadow-md',
    6: 'bg-[var(--color-note-6)] text-[var(--color-note-text-6)] border-[var(--color-note-6)]/40 shadow-md',
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

  const handleToggleTodo = (itemId, done, event) => {
    const isNowDone = !done;
    if (isNowDone) {
      const items = note.checklist || [];
      const doneCount = items.filter((i) => i.done).length;
      const totalCount = items.length;
      if (doneCount === totalCount - 1) {
        // Complete checklist trigger confetti at click location
        const clickX = event?.clientX || window.innerWidth / 2;
        const clickY = event?.clientY || window.innerHeight / 2;
        triggerConfetti(clickX, clickY);
      }
    }
    updateChecklistItem(note.id, itemId, { done: isNowDone });
  };

  const handleExportPolaroid = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const card = cardRef.current;
    if (!card) return;

    // Create a Polaroid container element dynamically off-screen
    const polaroidContainer = document.createElement('div');
    polaroidContainer.style.position = 'fixed';
    polaroidContainer.style.top = '-9999px';
    polaroidContainer.style.left = '-9999px';
    polaroidContainer.style.width = '360px';
    polaroidContainer.style.padding = '18px 18px 56px 18px'; // Thick bottom Polaroid border
    polaroidContainer.style.backgroundColor = '#faf9f6'; // Cream polaroid color
    polaroidContainer.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    polaroidContainer.style.borderRadius = '12px';
    polaroidContainer.style.fontFamily = "'Quicksand', sans-serif";
    polaroidContainer.style.display = 'flex';
    polaroidContainer.style.flexDirection = 'column';
    polaroidContainer.style.gap = '12px';

    // Clone the note content section into the polaroid container
    const noteCardClone = card.cloneNode(true);

    // Clean up interactive elements and replace inputs/textareas
    const interactiveElements = noteCardClone.querySelectorAll('button, form, input[type="text"], textarea');
    interactiveElements.forEach((el) => {
      if (el.tagName === 'INPUT') {
        const span = document.createElement('span');
        span.textContent = el.value || 'Untitled';
        span.style.fontSize = '18px';
        span.style.fontWeight = '800';
        span.style.fontFamily = "'Quicksand', sans-serif";
        span.style.color = '#374151';
        el.replaceWith(span);
      } else if (el.tagName === 'TEXTAREA') {
        const p = document.createElement('p');
        p.textContent = el.value || '';
        p.style.whiteSpace = 'pre-wrap';
        p.style.fontSize = '13px';
        p.style.fontFamily = "'Nunito', sans-serif";
        p.style.color = '#4b5563';
        p.style.lineHeight = '1.6';
        el.replaceWith(p);
      } else {
        el.remove();
      }
    });

    // Remove UI helpers like color picker dot tray and drag handlers
    const colorPickerTray = noteCardClone.querySelector('.absolute.left-1\\/2.-translate-x-1\\/2.-bottom-3');
    if (colorPickerTray) colorPickerTray.remove();

    noteCardClone.style.transform = 'none';
    noteCardClone.style.scale = '1';
    noteCardClone.style.boxShadow = 'none';
    noteCardClone.style.border = '2px solid rgba(0, 0, 0, 0.05)';
    noteCardClone.style.flex = '1';

    polaroidContainer.appendChild(noteCardClone);

    // Add polaroid caption footer
    const caption = document.createElement('div');
    caption.style.textAlign = 'center';
    caption.style.marginTop = '10px';
    caption.style.fontSize = '14px';
    caption.style.fontWeight = '700';
    caption.style.color = '#52525b';
    caption.style.fontStyle = 'italic';
    caption.textContent = `🌸 ${note.title || 'Scribble'} • ${relativeTime} ✨`;
    polaroidContainer.appendChild(caption);

    document.body.appendChild(polaroidContainer);

    try {
      const canvas = await html2canvas(polaroidContainer, {
        backgroundColor: null,
        scale: 2, // Double resolution for high quality rendering
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `polaroid-${(note.title || 'note').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export polaroid image:', err);
    } finally {
      document.body.removeChild(polaroidContainer);
    }
  };

  const handleDragEnd = (event, info) => {
    const newX = (note.boardPosition?.x || 50) + info.offset.x;
    const newY = (note.boardPosition?.y || 80) + info.offset.y;
    updateNotePosition(note.id, newX, newY);
  };

  const noteFolder = folders.find((f) => f.id === note.folderId);

  // Get active theme properties
  const activeAestheticTheme = useSlateStore((state) => state.activeAestheticTheme || 'cottagecore');
  const folderThemes = useSlateStore((state) => state.folderThemes || {});
  const currentFolderThemeId = note.folderId ? folderThemes[note.folderId] : null;
  const themeId = currentFolderThemeId || activeAestheticTheme;
  const activeTheme = themes[themeId] || themes.cottagecore;

  const borderStyle = activeTheme.noteBorderStyle;
  const cornerSticker = activeTheme.noteCornerSticker;

  const cardStyle = cardColorClasses[colorIndex] || cardColorClasses[1];

  const textureStyle = borderStyle === 'matcha' ? {
    backgroundImage: 'repeating-linear-gradient(45deg, rgba(43, 38, 32, 0.02) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(43, 38, 32, 0.02) 0 2px, transparent 2px 6px)',
    backgroundBlendMode: 'overlay'
  } : {};

  // Custom theme corner rounding
  const customRoundedClass = borderStyle === 'wave'
    ? 'rounded-[8px_24px_8px_24px/24px_8px_24px_8px]'
    : borderStyle === 'matcha'
      ? 'rounded-[1.2rem]'
      : 'rounded-[1.5rem]';

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
        ...textureStyle
      },
    }
    : {
      style: textureStyle
    };

  return (
    <motion.div
      ref={cardRef}
      {...motionProps}
      layout={!isDraggable}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7, y: 15 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      whileHover={showTrash ? {} : { scale: 1.025, rotate: 0.5 }}
      className={`relative p-6 border-2 flex flex-col shadow-sm select-text transition-all duration-300 overflow-hidden ${cardStyle} ${customRoundedClass} ${isDraggable ? 'cursor-grab active:cursor-grabbing z-20' : ''
        } ${showTrash ? 'opacity-75 grayscale-[20%]' : ''}`}
    >
      {/* Dynamic Top Border Trim */}
      {borderStyle === 'torn' && <TornTrim />}
      {borderStyle === 'scalloped' && <ScallopedTrim />}
      {borderStyle === 'wave' && <WaveTrim />}

      {/* Dynamic Corner Sticker */}
      {cornerSticker === 'flower' && <FlowerSticker />}
      {cornerSticker === 'daisy' && <DaisySticker />}
      {cornerSticker === 'tape' && <TapeSticker />}
      {cornerSticker === 'wildflower' && <WildflowerSticker />}
      {cornerSticker === 'star' && <StarSticker />}
      {cornerSticker === 'mushroom' && <MushroomSticker />}
      {cornerSticker === 'leaf' && <LeafSticker />}
      {cornerSticker === 'sparkle' && <SparkleSticker />}

      {/* Paw Stamp in bottom corner */}
      {cornerSticker === 'paw' && <PawStamp />}

      {note.isPinned && !showTrash && <StickerBadge type={stickerType} />}

      {/* Draggable Stickers Overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] z-30">
        {(note.stickers || []).map((sticker) => (
          <motion.div
            key={sticker.id}
            drag={!showTrash}
            dragMomentum={false}
            dragElastic={0.05}
            onDragEnd={(e, info) => {
              const cardElement = cardRef.current;
              if (!cardElement) return;
              const rect = cardElement.getBoundingClientRect();

              // Calculate relative percentages
              const relX = ((info.point.x - rect.left) / rect.width) * 100;
              const relY = ((info.point.y - rect.top) / rect.height) * 100;

              // Constrain sticker within note bounds (allowing it to be placed anywhere)
              const x = Math.max(-5, Math.min(93, relX));
              const y = Math.max(-5, Math.min(93, relY));
              updateStickerPosition(note.id, sticker.id, x, y);
            }}
            style={{
              position: 'absolute',
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              rotate: `${sticker.rotation}deg`,
              cursor: showTrash ? 'default' : 'grab',
            }}
            className="pointer-events-auto select-none group/sticker flex items-center justify-center p-1"
            whileHover={{ scale: 1.15 }}
            whileDrag={{ scale: 1.25, cursor: 'grabbing' }}
          >
            <span className="text-2xl filter drop-shadow-md select-none">{sticker.type}</span>
            {!showTrash && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSticker(note.id, sticker.id);
                }}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-400 text-white flex items-center justify-center text-[8px] font-bold opacity-0 group-hover/sticker:opacity-100 transition-opacity border border-white"
                title="Remove sticker"
              >
                ✕
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-start gap-2 mb-3 z-20">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 text-current px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
          {relativeTime}
        </span>

        <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
          {!showTrash ? (
            <>
              {/* Polaroid Export Button */}
              <button
                onClick={handleExportPolaroid}
                className="p-1 rounded-full hover:bg-white/20 hover:scale-105 transition-all text-current opacity-90 hover:opacity-100 active:scale-75"
                title="Export as Polaroid"
                aria-label="Export note as Polaroid image"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                className={`p-1 rounded-full transition-transform active:scale-75 ${note.isPinned
                  ? 'text-yellow-300 scale-110 bg-black/30'
                  : 'hover:bg-white/20 hover:scale-105 text-current opacity-90 hover:opacity-100'
                  }`}
                title={note.isPinned ? "Unpin note" : "Pin note"}
                aria-label={note.isPinned ? "Unpin note" : "Pin note"}
              >
                <Pin className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={() => updateNote(note.id, { isFavorite: !note.isFavorite })}
                className={`p-1 rounded-full transition-transform active:scale-75 ${note.isFavorite
                  ? 'text-pink-300 scale-110 bg-black/30'
                  : 'hover:bg-white/20 hover:scale-105 text-current opacity-90 hover:opacity-100'
                  }`}
                title={note.isFavorite ? "Unfavorite" : "Favorite"}
                aria-label={note.isFavorite ? "Unfavorite" : "Favorite"}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 rounded-full hover:bg-white/20 hover:scale-105 transition-all text-current opacity-90 hover:opacity-100 active:scale-75"
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
        className="w-full bg-transparent font-display font-extrabold text-lg outline-none text-white placeholder:text-white/90 placeholder:opacity-100 mb-3 border-b border-transparent hover:border-white/20 focus:border-white/40 transition-all rounded z-20"
      />

      {/* Checklist Progress Bar */}
      {note.type === 'checklist' && (note.checklist || []).length > 0 && (() => {
        const items = note.checklist || [];
        const total = items.length;
        const completed = items.filter((i) => i.done).length;
        const percent = Math.round((completed / total) * 100);
        const isComplete = completed === total;

        return (
          <div className="mb-3 px-1 z-20">
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider mb-1 text-white opacity-95">
              <span>Task Progress</span>
              <span>{completed}/{total} done {isComplete ? '🌟' : '✨'}</span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                className={`h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 shadow-sm ${isComplete ? 'shadow-[0_0_8px_rgba(236,72,153,0.5)] animate-pulse' : ''
                  }`}
              />
            </div>
          </div>
        );
      })()}

      <div className="flex-1 min-h-[120px] max-h-[300px] overflow-y-auto mb-4 pr-1 z-20">
        {note.type === 'text' ? (
          <textarea
            value={note.content || ''}
            onChange={handleContentChange}
            disabled={showTrash}
            placeholder="Scribble your ideas here... ✨"
            className="w-full h-full bg-transparent resize-none outline-none text-sm text-white placeholder:text-white/90 placeholder:opacity-100 leading-relaxed font-semibold"
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
                      onClick={(e) => !showTrash && handleToggleTodo(item.id, item.done, e)}
                      disabled={showTrash}
                    />
                    <motion.input
                      type="text"
                      value={item.text}
                      onChange={(e) =>
                        updateChecklistItem(note.id, item.id, { text: e.target.value })
                      }
                      disabled={showTrash}
                      className={`bg-transparent outline-none text-sm w-full font-bold text-white ${item.done
                        ? 'line-through opacity-90 decoration-2 decoration-purple-300'
                        : ''
                        }`}
                    />
                  </div>
                  {!showTrash && (
                    <button
                      type="button"
                      onClick={() => deleteChecklistItem(note.id, item.id)}
                      className="opacity-0 group-hover/todo:opacity-100 hover:scale-105 p-0.5 rounded text-white hover:text-red-300 transition-all"
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
                  className="w-full bg-white/20 text-white placeholder:text-white/90 placeholder:opacity-100 outline-none text-xs px-3 py-1.5 rounded-xl border border-white/30 focus:bg-white/30 transition-all font-semibold"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-xl bg-white/30 hover:bg-white/40 active:scale-95 transition-all text-white border border-white/30 font-bold"
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

      <div className="mt-auto pt-3 border-t border-current/10 flex flex-wrap gap-2 items-center justify-between z-20">
        <div className="relative" ref={folderMenuRef}>
          <button
            onClick={() => !showTrash && setShowFolderMenu(!showFolderMenu)}
            disabled={showTrash}
            className="flex items-center gap-1 text-[11px] font-extrabold bg-black/20 hover:bg-black/30 text-current border border-white/20 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
          >
            <span>{noteFolder ? noteFolder.icon : '📁'}</span>
            <span>{noteFolder ? noteFolder.name : 'Unassigned'}</span>
          </button>

          {showFolderMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl p-1.5 z-40 animate-fade-in text-slate-700 dark:text-slate-200">
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
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-black/20 text-current border border-white/20 shadow-xs uppercase"
                >
                  #{activeTag.name}
                </span>
              );
            })}
            {(note.tags || []).length > 2 && (
              <span className="text-[9px] font-extrabold px-1 py-0.5 rounded-md bg-black/20 text-current border border-white/20 shadow-xs">
                +{(note.tags || []).length - 2}
              </span>
            )}
          </div>

          {!showTrash && (
            <>
              {/* Sticker Stamp picker popover */}
              <div className="relative" ref={stickerMenuRef}>
                <button
                  onClick={() => setShowStickerMenu(!showStickerMenu)}
                  className="p-1 rounded-xl bg-black/20 hover:bg-black/30 text-current border border-white/20 transition-all flex items-center justify-center text-xs font-bold cursor-pointer"
                  title="Sticker Stamps"
                  aria-label="Add sticker stamp"
                >
                  🌸+
                </button>

                {showStickerMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl p-1.5 z-40 animate-fade-in flex gap-1 w-max">
                    {['🌸', '💗', '🍓', '🧸', '🐻', '🐱', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          addSticker(note.id, emoji);
                          setShowStickerMenu(false);
                        }}
                        disabled={(note.stickers || []).length >= 6}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-lg transition-transform active:scale-75 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title={(note.stickers || []).length >= 6 ? "Max 6 stickers reached" : `Add ${emoji} stamp`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowTagMenu(!showTagMenu)}
                className="p-1 rounded-xl bg-black/20 hover:bg-black/30 text-current border border-white/20 transition-colors cursor-pointer"
                title="Manage tags"
                aria-label="Manage tags"
              >
                <Tag className="w-3 h-3" />
              </button>

              {showTagMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl p-2 z-40 animate-fade-in text-slate-700 dark:text-slate-200">
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
              style={{ background: `var(--color-note-${idx})` }}
              className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 ${colorIndex === idx ? 'border-[var(--color-accent)] scale-110' : 'border-slate-200 dark:border-slate-600'
                }`}
              title={`Color theme ${idx}`}
            />
          ))}
        </div>
      )}

    </motion.div>
  );
};

export default NoteCard;
