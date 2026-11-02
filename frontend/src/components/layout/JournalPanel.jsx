import React, { useState } from 'react';
import useSlateStore from '../../store/useSlateStore';
import useAuthStore from '../../store/useAuthStore';
import { Maximize2, Minimize2, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';

const JournalPanel = () => {
  const {
    activeFolderId,
    folders,
    journals,
    updateJournal,
    journalViewMode,
  } = useSlateStore();
  const user = useAuthStore((state) => state.user);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const journalKey = activeFolderId || 'global';
  const journalData = journals[journalKey] || { title: '', content1: '', content2: '' };

  const handleTitleChange = (e) => updateJournal(activeFolderId, { title: e.target.value });
  const handleContent1Change = (e) => updateJournal(activeFolderId, { content1: e.target.value });

  const displayTitle = journalData.title !== undefined ? journalData.title : '';
  const defaultPlaceholder = activeFolder
    ? `${activeFolder.icon} ${activeFolder.name} · Journal`
    : 'Today';

  const displayName = user?.name || user?.email?.split('@')[0] || '';

  const isJournalOnly = journalViewMode === 'journal';
  const panelWidthClass = isJournalOnly
    ? 'w-full flex-1'
    : 'w-full lg:w-[360px] xl:w-[400px] flex-shrink-0';

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const renderContent = (isLightbox = false) => (
    <div
      className={`flex flex-col flex-1 overflow-hidden ${
        isLightbox ? 'h-full' : 'h-full'
      }`}
    >
      {/* Date strip */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {todayStr}
        </span>
        {!isLightbox && (
          <button
            onClick={() => setIsZoomed(true)}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            title="Focus mode"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Page title input */}
      <input
        type="text"
        value={displayTitle}
        onChange={handleTitleChange}
        placeholder={defaultPlaceholder}
        className="w-full bg-transparent outline-none font-semibold text-lg mb-4 placeholder:opacity-40 border-b pb-2 transition-colors"
        style={{
          color: 'var(--color-text)',
          borderColor: 'var(--color-card-border)',
        }}
      />

      {/* Ruled lines writing area */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          value={journalData.content1 || ''}
          onChange={handleContent1Change}
          placeholder="Write your thoughts, intentions, or anything on your mind…"
          className="absolute inset-0 w-full h-full bg-transparent outline-none resize-none text-sm leading-7 placeholder:opacity-35"
          style={{
            color: 'var(--color-text)',
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent calc(1.75rem - 1px),
              var(--color-card-border) calc(1.75rem - 1px),
              var(--color-card-border) 1.75rem
            )`,
            backgroundAttachment: 'local',
            lineHeight: '1.75rem',
            paddingTop: '2px',
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`${panelWidthClass} flex flex-col h-full border-r transition-all duration-300`}
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <BookOpen
              className="w-4 h-4"
              style={{ color: 'var(--color-accent)' }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {activeFolder ? `${activeFolder.icon} ${activeFolder.name}` : 'Journal'}
            </span>
          </div>

          {/* Mobile collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden p-1 rounded-md hover:bg-black/5 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Writing area */}
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden flex flex-col px-5 py-5">
            {renderContent(false)}
          </div>
        )}
      </div>

      {/* Focus mode lightbox */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-16 animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="relative w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--paper-color)', border: '1px solid var(--color-card-border)' }}
          >
            {/* Lightbox header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
              style={{ borderColor: 'var(--color-card-border)' }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  Focus Mode
                </span>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                title="Exit focus mode"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col px-8 py-6">
              {renderContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JournalPanel;
