import React, { useState, useMemo } from 'react';
import useSlateStore from '../../store/useSlateStore';
import {
  Clock, Check, Sparkles, AlertCircle, ArrowRight,
  CalendarDays, Plus, FileText, CheckSquare, Trash2,
  ChevronRight, BookmarkCheck, Feather, Columns
} from 'lucide-react';

const DailySpineView = () => {
  const {
    notes = [],
    folders = [],
    setTaskStatus,
    scheduleItem,
    setTodayAnchor,
    deleteNote,
    setOpenNoteId,
    triggerConfetti,
    getReflectionPrompt,
    quickCapture,
    toggleSidebarCollapsed,
    setActiveFolderId,
    setWorkspaceView,
    calendarEvents = [],
  } = useSlateStore();

  const [quickInput, setQuickInput] = useState('');
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => new Date(Date.now() + 86400000).toISOString().split('T')[0], []);

  const todayObj = useMemo(() => new Date(), []);
  const tomorrowObj = useMemo(() => new Date(Date.now() + 86400000), []);

  const dayOfWeekFormatted = useMemo(() => {
    return todayObj.toLocaleDateString('en-US', { weekday: 'long' });
  }, [todayObj]);

  const dateFormatted = useMemo(() => {
    return todayObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }, [todayObj]);

  const tomorrowDayFormatted = useMemo(() => {
    return tomorrowObj.toLocaleDateString('en-US', { weekday: 'long' });
  }, [tomorrowObj]);

  // Items for today (excluding deleted notes)
  // Events for today from unified calendar model
  const todayEvents = useMemo(() => {
    return (calendarEvents || [])
      .filter((e) => e.date === todayStr)
      .map((e) => ({
        id: e.id,
        title: e.title,
        timeBlock: e.time,
        type: 'event',
        category: e.category,
        status: e.completed ? 'completed' : 'todo',
        createdAt: 0,
        isEvent: true,
      }));
  }, [calendarEvents, todayStr]);

  // Items for today (scheduled for today, created today, or active tasks needing attention)
  const todayItems = useMemo(() => {
    const matchedNotes = notes.filter((n) => {
      if (n.deletedAt !== null) return false;
      if (n.scheduledDate === todayStr) return true;
      const createdDate = new Date(n.createdAt).toISOString().split('T')[0];
      if (createdDate === todayStr) return true;
      // Also surface uncompleted tasks/checklists so the user is never stranded with an empty desk
      if (n.status !== 'completed' && (!n.scheduledDate || n.scheduledDate <= todayStr || n.isAnchor || n.status === 'in_progress')) {
        return true;
      }
      return false;
    });

    return [...todayEvents, ...matchedNotes];
  }, [notes, todayEvents, todayStr]);

  // Tomorrow count for footer
  const tomorrowCount = useMemo(() => {
    const tasksTomorrow = notes.filter((n) => n.deletedAt === null && n.scheduledDate === tomorrowStr).length;
    const eventsTomorrow = (calendarEvents || []).filter((e) => e.date === tomorrowStr).length;
    return tasksTomorrow + eventsTomorrow;
  }, [notes, calendarEvents, tomorrowStr]);

  // Identify anchor item, in-progress items, or slipping item
  const todayAnchor = useMemo(() => {
    return todayItems.find((n) => n.isAnchor && n.status !== 'completed');
  }, [todayItems]);

  const inProgressItem = useMemo(() => {
    return todayItems.find((n) => n.status === 'in_progress' && !n.isAnchor);
  }, [todayItems]);

  const slippingItem = useMemo(() => {
    const currentHour = new Date().getHours();
    return todayItems.find((n) => {
      if (n.status === 'completed' || n.isAnchor) return false;
      if (currentHour >= 17 && !n.timeBlock) return true;
      return false;
    });
  }, [todayItems]);

  // All scheduled tasks & notes on spine
  const spineItems = useMemo(() => {
    return todayItems.filter((n) => {
      return true;
    }).sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (b.status === 'completed' && a.status !== 'completed') return -1;
      if (a.timeBlock && b.timeBlock) return a.timeBlock.localeCompare(b.timeBlock);
      if (a.timeBlock) return -1;
      if (b.timeBlock) return 1;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
  }, [todayItems]);

  // Progressive disclosure prompt
  const reflectionPrompt = useMemo(() => {
    return getReflectionPrompt ? getReflectionPrompt() : null;
  }, [getReflectionPrompt]);

  const handleToggleTask = (task, e) => {
    e.stopPropagation();
    if (task.isEvent) {
      // Toggle calendar event completion
      const updatedEvents = (calendarEvents || []).map((ev) =>
        ev.id === task.id ? { ...ev, completed: !ev.completed } : ev
      );
      useSlateStore.setState({ calendarEvents: updatedEvents });
      if (!task.status || task.status !== 'completed') {
        triggerConfetti(e.clientX, e.clientY);
      }
      return;
    }
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    setTaskStatus(task.id, nextStatus);
    if (nextStatus === 'completed') {
      triggerConfetti(e.clientX, e.clientY);
    }
  };

  const handleQuickCapture = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    // Detect time if typed (e.g. "9am" or "14:00")
    let title = quickInput.trim();
    let timeBlock = null;
    const timeMatch = title.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)$/i);
    if (timeMatch) {
      timeBlock = timeMatch[1];
      title = title.replace(timeMatch[0], '').trim();
    }

    quickCapture(title || quickInput.trim(), {
      scheduledDate: todayStr,
      timeBlock,
      type: 'task',
      energyDomain: 'focus',
    });

    setQuickInput('');
  };

  const handleSaveReflection = (e) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    quickCapture(`Reflection: ${reflectionInput.trim()}`, {
      type: 'note',
      scheduledDate: todayStr,
      energyDomain: 'calm',
      tags: ['reflection'],
      content: `<p><strong>${reflectionPrompt?.prompt}</strong></p><p>${reflectionInput.trim()}</p>`,
    });

    setReflectionInput('');
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 3000);
  };

  // Surfaced Hero Insight (v2 format)
  const surfacedHero = useMemo(() => {
    if (todayAnchor) {
      return {
        eyebrow: 'anchor — your one true priority for today',
        claim: todayAnchor.title,
        sub: todayAnchor.timeBlock ? `Locked for ${todayAnchor.timeBlock}. Everything else supports this.` : 'No time locked yet. Guard your attention for this item.',
        primaryAction: (e) => handleToggleTask(todayAnchor, e),
        primaryText: 'Finish now',
        secondaryAction: () => {
          const t = prompt('Attach a focus time block (e.g. 14:00):');
          if (t) scheduleItem(todayAnchor.id, todayStr, t);
        },
        secondaryText: 'Give it a time',
      };
    }
    if (inProgressItem) {
      return {
        eyebrow: 'in progress — active attention queue',
        claim: inProgressItem.title,
        sub: 'You started this and stepped away. Working memory is holding it.',
        primaryAction: (e) => handleToggleTask(inProgressItem, e),
        primaryText: 'Mark complete',
        secondaryAction: () => setOpenNoteId(inProgressItem.id),
        secondaryText: 'Resume flow',
      };
    }
    if (slippingItem) {
      return {
        eyebrow: 'slipping — day closing past sunset',
        claim: slippingItem.title,
        sub: 'Still untouched today. Decide now before it rolls over.',
        primaryAction: (e) => handleToggleTask(slippingItem, e),
        primaryText: 'Do it now',
        secondaryAction: () => scheduleItem(slippingItem.id, tomorrowStr),
        secondaryText: 'Push to tomorrow',
      };
    }
    // If no explicit anchor/slipping but there are uncompleted tasks, surface the top priority task
    const topActiveTask = todayItems.find((n) => (n.type === 'task' || n.type === 'checklist') && n.status !== 'completed');
    if (topActiveTask) {
      return {
        eyebrow: 'focus — surfaced priority',
        claim: topActiveTask.title,
        sub: topActiveTask.timeBlock ? `Scheduled for ${topActiveTask.timeBlock}. Everything else supports this.` : 'No time locked yet. Tap to set as today’s anchor or finish now.',
        primaryAction: (e) => handleToggleTask(topActiveTask, e),
        primaryText: 'Finish now',
        secondaryAction: () => {
          const t = prompt('Attach a focus time block (e.g. 14:00):');
          if (t) scheduleItem(topActiveTask.id, todayStr, t);
        },
        secondaryText: 'Give it a time',
      };
    }
    if (spineItems.length > 0 && spineItems.every((i) => i.status === 'completed')) {
      return {
        eyebrow: 'clear horizon — day completed',
        claim: 'All commitments closed today',
        sub: 'Attention is free. Step away or capture whatever comes next.',
        primaryAction: null,
        primaryText: null,
      };
    }
    return null;
  }, [todayAnchor, inProgressItem, slippingItem, spineItems, todayStr, tomorrowStr]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bone,#EFE9DC)] py-8 sm:py-11 px-5 sm:px-8 select-text transition-colors">
      <div className="w-full max-w-[680px] mx-auto">
        
        {/* 1. Top Day of Week & Filter Context Trigger (Bloom v2) */}
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[13px] font-sans font-medium text-[var(--sage,#6B7F63)] tracking-wide">
            {dayOfWeekFormatted}
          </span>
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            className="text-[12.5px] font-sans font-medium text-[var(--sage-dim,#9DAC95)] hover:text-[var(--ink,#1B2420)] transition-colors cursor-pointer flex items-center gap-1"
            title="Toggle Collections & Folders Drawer"
          >
            <span>filter ▾</span>
          </button>
        </div>

        {/* 2. Anchor Date Title (Fraunces Italic) */}
        <h1 className="font-serif italic font-medium text-4xl sm:text-5xl text-[var(--ink,#1B2420)] mt-0.5 mb-5 leading-none">
          {dateFormatted}
        </h1>

        {/* 3. Inline Folder Chips (Summoned, Not Clunky Sidebar) */}
        <div className="flex flex-wrap items-center gap-2 mb-7">
          {folders.map((f) => {
            const count = notes.filter((n) => n.folderId === f.id && n.deletedAt === null).length;
            const dotColor =
              f.theme === 'matcha' || f.id === 'folder-work'
                ? '#6B7F63'
                : f.theme === 'rose' || f.id === 'folder-personal'
                ? '#A8491F'
                : '#C9A135';

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActiveFolderId(f.id);
                  useSlateStore.getState().setFolderViewMode('split');
                  setWorkspaceView('split');
                }}
                className="text-[12.5px] font-sans font-normal px-3 py-1.5 rounded-full border border-[var(--line,#D8D0BC)] bg-[var(--card,#F7F4EC)] text-[var(--ink-soft,#3A463E)] flex items-center gap-2 hover:border-[var(--sage,#6B7F63)] transition-all cursor-pointer shadow-2xs"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                <span>{f.name} · {count}</span>
              </button>
            );
          })}
          
          {/* Direct Split View Button */}
          <button
            type="button"
            onClick={() => {
              const targetFolderId = folders[0]?.id || 'folder-work';
              setActiveFolderId(targetFolderId);
              useSlateStore.getState().setFolderViewMode('split');
              setWorkspaceView('split');
            }}
            className="text-[12.5px] font-sans px-3 py-1.5 rounded-full bg-[var(--card,#F7F4EC)] border border-[var(--brick,#A8491F)]/40 text-[var(--brick,#A8491F)] hover:bg-[var(--brick,#A8491F)] hover:text-white transition-all cursor-pointer font-medium flex items-center gap-1.5 shadow-2xs"
            title="Open Split View with Notes on Left and Tasks on Right"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            className="text-[12.5px] font-sans px-3 py-1.5 rounded-full border border-dashed border-[var(--line,#D8D0BC)] text-[var(--sage-dim,#9DAC95)] hover:text-[var(--ink,#1B2420)] transition-colors cursor-pointer"
          >
            + collections
          </button>
        </div>

        {/* 4. Hero Claim Card (Bloom v2 Gold Left Border) */}
        {surfacedHero && (
          <div className="v2-hero">
            <div className="text-[12px] font-sans font-medium text-[var(--gold,#C9A135)] mb-1.5 tracking-wide">
              {surfacedHero.eyebrow}
            </div>
            <p className="font-serif text-[20px] text-[var(--ink,#1B2420)] font-medium leading-snug m-0 mb-1.5">
              {surfacedHero.claim}
            </p>
            <p className="text-[13.5px] font-sans text-[var(--ink-soft,#3A463E)] mb-3 leading-relaxed">
              {surfacedHero.sub}
            </p>
            {(surfacedHero.primaryAction || surfacedHero.secondaryAction) && (
              <div className="flex items-center gap-4">
                {surfacedHero.primaryAction && (
                  <button
                    type="button"
                    onClick={surfacedHero.primaryAction}
                    className="text-[13px] font-sans text-[var(--brick,#A8491F)] hover:opacity-85 underline underline-offset-3 cursor-pointer font-medium"
                  >
                    {surfacedHero.primaryText}
                  </button>
                )}
                {surfacedHero.secondaryAction && (
                  <button
                    type="button"
                    onClick={surfacedHero.secondaryAction}
                    className="text-[13px] font-sans text-[var(--ink-soft,#3A463E)] hover:opacity-85 underline underline-offset-3 cursor-pointer"
                  >
                    {surfacedHero.secondaryText}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. Clean Capture Input (Bloom v2) */}
        <form onSubmit={handleQuickCapture} className="flex gap-2.5 mb-9">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Water the plants, 9am…"
            className="flex-1 bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] rounded-xl px-4 py-3 text-[14.5px] font-sans text-[var(--ink,#1B2420)] placeholder:text-[var(--sage-dim,#9DAC95)] outline-none focus:border-[var(--gold,#C9A135)] shadow-2xs transition-all"
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="bg-[var(--ink,#1B2420)] hover:bg-[var(--ink-soft,#3A463E)] disabled:opacity-40 text-[var(--bone,#EFE9DC)] border-none rounded-xl px-5 text-[13.5px] font-sans font-medium transition-all cursor-pointer shadow-xs"
          >
            Add
          </button>
        </form>

        {/* 6. Continuous Timeline Spine (Bloom v2 .spine with .node dots) */}
        <div className="v2-spine">
          {spineItems.length === 0 ? (
            <div className="v2-node">
              <div className="text-[11.5px] font-sans text-[var(--sage,#6B7F63)] mb-1 font-mono">
                empty desk
              </div>
              <div className="text-[14.5px] font-sans italic text-[var(--ink-soft,#3A463E)]">
                Nothing scheduled on today's timeline yet. Type above to add an item.
              </div>
            </div>
          ) : (
            spineItems.map((item) => {
              const isDone = item.status === 'completed';
              const isTask = item.type === 'task' || item.type === 'checklist';

              return (
                <div key={item.id} className={`v2-node ${isDone ? 'done' : ''} group`}>
                  {/* Timestamp / Trigger */}
                  <div className="text-[11.5px] font-sans text-[var(--sage,#6B7F63)] mb-1 font-mono flex items-center justify-between">
                    <span>{item.timeBlock || (item.isAnchor ? 'anchor' : 'no time set')}</span>
                    
                    {/* Hover actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      {!item.isAnchor && !isDone && (
                        <button
                          type="button"
                          onClick={() => setTodayAnchor(item.id)}
                          className="text-[11px] text-[var(--gold,#C9A135)] hover:underline cursor-pointer"
                        >
                          Make Anchor
                        </button>
                      )}
                      {!isDone && (
                        <button
                          type="button"
                          onClick={() => scheduleItem(item.id, tomorrowStr, item.timeBlock)}
                          className="text-[11px] text-[var(--sage-dim,#9DAC95)] hover:text-[var(--ink,#1B2420)] cursor-pointer"
                        >
                          Tomorrow →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Item Content Row */}
                  <div className="text-[15px] font-sans flex items-baseline gap-2.5 flex-wrap">
                    {/* Checkbox for tasks and calendar events */}
                    {isTask || item.type === 'event' ? (
                      <button
                        type="button"
                        onClick={(e) => handleToggleTask(item, e)}
                        className={`cursor-pointer transition-all ${
                          isDone
                            ? 'line-through text-[var(--sage-dim,#9DAC95)] font-normal'
                            : 'font-medium text-[var(--ink,#1B2420)] hover:text-[var(--brick,#A8491F)]'
                        }`}
                      >
                        {item.title}
                      </button>
                    ) : (
                      /* Manuscript Note on Timeline */
                      <button
                        type="button"
                        onClick={() => setOpenNoteId(item.id)}
                        className="text-left font-serif italic text-[var(--ink-soft,#3A463E)] hover:text-[var(--ink,#1B2420)] cursor-pointer"
                      >
                        {item.title || 'Untitled Manuscript'}
                      </button>
                    )}

                    {/* Event Tag */}
                    {item.type === 'event' && (
                      <span className="text-[11px] font-sans text-[var(--ink-soft,#3A463E)] border border-[var(--line,#D8D0BC)] rounded px-1.5 py-0.2">
                        event
                      </span>
                    )}

                    {/* Tag / Category Badge */}
                    {item.type === 'note' && (
                      <span className="text-[11px] font-sans text-[var(--ink-soft,#3A463E)] border border-[var(--line,#D8D0BC)] rounded px-1.5 py-0.2">
                        note
                      </span>
                    )}
                    {item.energyDomain && item.energyDomain !== 'focus' && (
                      <span className="text-[11px] font-sans text-[var(--sage,#6B7F63)] border border-[var(--line,#D8D0BC)] rounded px-1.5 py-0.2">
                        {item.energyDomain}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 7. Contextual Reflection (One Quiet Line) */}
        {reflectionPrompt && (
          <div className="mt-8 pt-6 border-t border-[var(--line,#D8D0BC)]">
            <div className="text-[11.5px] font-sans font-medium text-[var(--sage,#6B7F63)] mb-1">
              tonight · reflection
            </div>
            {reflectionSaved ? (
              <div className="text-[13.5px] font-serif italic text-[var(--sage,#6B7F63)] flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4" />
                <span>Captured into today's timeline.</span>
              </div>
            ) : (
              <form onSubmit={handleSaveReflection} className="space-y-2">
                <p className="font-serif italic text-[15px] text-[var(--ink,#1B2420)] m-0">
                  {reflectionPrompt.prompt}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="One line before bed…"
                    className="flex-1 bg-[var(--card,#F7F4EC)] border border-[var(--line,#D8D0BC)] rounded-xl px-3 py-2 text-[13.5px] font-sans text-[var(--ink,#1B2420)] placeholder:text-[var(--sage-dim,#9DAC95)] outline-none focus:border-[var(--gold,#C9A135)]"
                  />
                  <button
                    type="submit"
                    disabled={!reflectionInput.trim()}
                    className="bg-[var(--ink-soft,#3A463E)] hover:bg-[var(--ink,#1B2420)] disabled:opacity-40 text-[var(--bone,#EFE9DC)] rounded-xl px-3.5 text-xs font-sans font-medium cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 8. Day Footer (From Bloom v2) */}
        <div className="mt-10 pt-5 border-t border-[var(--line,#D8D0BC)] text-[13px] font-sans text-[var(--sage-dim,#9DAC95)] flex items-center justify-between">
          <span>
            That's everything for today — {tomorrowDayFormatted} has {tomorrowCount} thing{tomorrowCount === 1 ? '' : 's'} waiting.
          </span>
          <button
            type="button"
            onClick={() => setWorkspaceView('calendar')}
            className="text-[var(--sage,#6B7F63)] hover:text-[var(--ink,#1B2420)] underline underline-offset-3 cursor-pointer text-xs"
          >
            Open Calendar →
          </button>
        </div>

      </div>
    </div>
  );
};

export default DailySpineView;
