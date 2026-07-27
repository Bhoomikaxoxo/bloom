import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import EmojiPicker from 'emoji-picker-react';

/**
 * Reusable EmojiPickerPopover component
 * 
 * Powered by `emoji-picker-react` for complete, virtualized access to all 3,000+ Unicode
 * emojis across all categories (Smileys & People, Animals & Nature, Food & Drink, Travel & Places,
 * Activities, Objects, Symbols, Flags) with full search and instant selection.
 * 
 * Renders via React Portal (`createPortal` into `document.body`) to prevent layout shifts or overflow clipping.
 */
const EmojiPickerPopover = ({
  currentEmoji,
  onSelectEmoji,
  buttonTitle = 'Change emoji',
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const pickerWidth = 340;
      const pickerHeight = 430;

      // Position anchored to the right of the clicked icon
      let left = rect.right + 10;
      // Flip to left if not enough space on right
      if (left + pickerWidth > window.innerWidth - 16) {
        left = Math.max(16, rect.left - pickerWidth - 10);
      }

      // Align top with icon, clamping within screen height bounds
      let top = rect.top - 8;
      if (top + pickerHeight > window.innerHeight - 16) {
        top = Math.max(16, window.innerHeight - pickerHeight - 16);
      }

      setPopoverPos({ top, left });
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      updatePosition();
      setIsOpen(true);
    }
  };

  // Recalculate position on scroll/resize and handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleEmojiClick = (emojiData) => {
    onSelectEmoji(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button inside standard component hierarchy */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`hover:bg-white/80 dark:hover:bg-slate-700/80 p-1 rounded-lg transition-all active:scale-90 select-none text-base border border-transparent hover:border-purple-300/40 cursor-pointer flex-shrink-0 ${buttonClassName}`}
        title={buttonTitle}
        aria-label={buttonTitle}
      >
        {currentEmoji}
      </button>

      {/* Floating Popover Portal rendered at root level in document.body */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[9999] shadow-2xl rounded-2xl animate-fade-in pointer-events-auto filter drop-shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            style={{
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={true}
              searchDisabled={false}
              lazyLoadEmojis={true}
              width={340}
              height={420}
              previewConfig={{ showPreview: false }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default EmojiPickerPopover;
