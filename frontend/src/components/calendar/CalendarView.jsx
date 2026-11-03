import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSlateStore from '../../store/useSlateStore';
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Check, Trash2,
  Clock, Sparkles, AlertCircle, ArrowRight, Star
} from 'lucide-react';

const CATEGORIES = {
  personal: { label: 'Personal', icon: '🌸', color: 'pink', badge: 'bg-rose-100 text-rose-800 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60' },
  work: { label: 'Work', icon: '💼', color: 'mint', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60' },
  reminder: { label: 'Reminder', icon: '⏰', color: 'amber', badge: 'bg-amber-100 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60' },
  selfcare: { label: 'Self-Care', icon: '🛁', color: 'lavender', badge: 'bg-purple-100 text-purple-800 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60' },
  ideas: { label: 'Idea', icon: '💡', color: 'sky', badge: 'bg-sky-100 text-sky-800 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60' },
};

const formatDateKey = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarView = () => {
  const {
    calendarEvents = [],
    addCalendarEvent,
    deleteCalendarEvent,
    toggleCalendarEvent,
    notes = [],
    setOpenNoteId,
    triggerConfetti,
  } = useSlateStore();

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const tomorrowKey = useMemo(() => formatDateKey(new Date(Date.now() + 86400000)), []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('personal');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateKey(formatDateKey(today));
  };

  const goToTomorrow = () => {
    const tomorrow = new Date(Date.now() + 86400000);
    setCurrentDate(tomorrow);
    setSelectedDateKey(formatDateKey(tomorrow));
  };

  // Calendar grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    // Monday = 0, Sunday = 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        dateKey: formatDateKey(d),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        dateKey: formatDateKey(d),
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dateKey: formatDateKey(d),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Events grouped by date
  const eventsByDate = useMemo(() => {
    const map = {};
    (calendarEvents || []).forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [calendarEvents]);

  // Selected date events & notes
  const selectedEvents = eventsByDate[selectedDateKey] || [];
  const selectedNotes = (notes || []).filter((n) => {
    if (n.deletedAt !== null) return false;
    const noteCreatedKey = formatDateKey(n.createdAt);
    return noteCreatedKey === selectedDateKey;
  });

  const selectedDateObj = useMemo(() => {
    const parts = selectedDateKey.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }, [selectedDateKey]);

  const selectedDateDisplay = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const isSelectedToday = selectedDateKey === todayKey;
  const isSelectedTomorrow = selectedDateKey === tomorrowKey;

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    addCalendarEvent({
      title: newEventTitle.trim(),
      date: selectedDateKey,
      time: newEventTime.trim(),
      category: newEventCategory,
    });

    setNewEventTitle('');
    setNewEventTime('');
  };

  const handleToggleEvent = (evt, e) => {
    toggleCalendarEvent(evt.id);
    if (!evt.completed) {
      // Check if this was the last item for this day
      const uncompletedCount = selectedEvents.filter((item) => !item.completed && item.id !== evt.id).length;
      if (uncompletedCount === 0) {
        triggerConfetti(e?.clientX || window.innerWidth / 2, e?.clientY || window.innerHeight / 2);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[var(--color-bg-from)]">
      {/* LEFT: Clean Monthly Calendar Grid */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto border-r border-black/[0.08] dark:border-white/[0.08]">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-accent-bg)] flex items-center justify-center text-[var(--color-accent)] shadow-2xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)] tracking-tight">
                {monthName} {year}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                {calendarEvents.length} events & reminders planned
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelectedToday
                  ? 'bg-[var(--color-accent)] text-white shadow-2xs'
                  : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-[var(--color-text)]'
              }`}
            >
              Today
            </button>
            <button
              onClick={goToTomorrow}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isSelectedTomorrow
                  ? 'bg-[var(--color-accent)] text-white shadow-2xs'
                  : 'bg-[var(--color-accent-bg)] text-[var(--color-accent)] hover:opacity-90'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Tomorrow</span>
            </button>
            <div className="flex items-center bg-black/[0.04] dark:bg-white/[0.06] rounded-full p-0.5 border border-black/[0.06] dark:border-white/[0.08]">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center select-none">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className="py-1 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Month Dates Grid */}
        <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
          {calendarDays.map(({ date, dateKey, isCurrentMonth }) => {
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDateKey;
            const dayEvents = eventsByDate[dateKey] || [];
            const dayNum = date.getDate();

            return (
              <motion.div
                key={dateKey}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedDateKey(dateKey)}
                className={`relative min-h-[70px] sm:min-h-[85px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-[var(--color-accent)] bg-white dark:bg-slate-800 shadow-md border-transparent z-10'
                    : isToday
                    ? 'bg-white/80 dark:bg-slate-800/80 border-[var(--color-accent)]/40 shadow-xs'
                    : isCurrentMonth
                    ? 'bg-white/60 dark:bg-slate-850/60 border-black/[0.06] dark:border-white/[0.08] hover:bg-white dark:hover:bg-slate-800'
                    : 'bg-black/[0.015] dark:bg-white/[0.02] border-transparent opacity-40 hover:opacity-75'
                }`}
              >
                {/* Date Number & Status Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[var(--color-accent)] text-white shadow-2xs'
                        : isToday
                        ? 'text-[var(--color-accent)] bg-[var(--color-accent-bg)]'
                        : 'text-[var(--color-text)]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Mini Dots */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {dayEvents.slice(0, 3).map((evt) => {
                    const cat = CATEGORIES[evt.category] || CATEGORIES.personal;
                    return (
                      <span
                        key={evt.id}
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          evt.completed ? 'opacity-30' : 'opacity-90'
                        }`}
                        style={{
                          backgroundColor:
                            cat.color === 'pink' ? '#F43F5E' :
                            cat.color === 'mint' ? '#10B981' :
                            cat.color === 'amber' ? '#F59E0B' :
                            cat.color === 'lavender' ? '#A855F7' : '#0EA5E9',
                        }}
                        title={evt.title}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] font-bold text-[var(--color-text-muted)]">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Daily Agenda & "Keep in Mind" Planner Panel */}
      <div className="w-full lg:w-[400px] xl:w-[440px] flex flex-col h-full bg-[var(--color-card-bg)] border-t lg:border-t-0 lg:border-l border-black/[0.08] dark:border-white/[0.08] overflow-hidden flex-shrink-0 shadow-lg select-text">
        {/* Day Header */}
        <div className="p-6 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-wider text-[var(--color-accent)] uppercase">
                {isSelectedToday ? '🌸 Today' : isSelectedTomorrow ? '✨ Tomorrow' : '🗓️ Planned Day'}
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">
                · {selectedDateKey}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
              {selectedDateDisplay}
            </h3>
          </div>

          {!isSelectedTomorrow && (
            <button
              onClick={goToTomorrow}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] text-[var(--color-text)] flex items-center gap-1 transition-all cursor-pointer"
              title="Jump to Tomorrow"
            >
              <span>Next Day</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Add Reminder / Event Form */}
        <form onSubmit={handleAddEvent} className="p-5 border-b border-black/[0.06] dark:border-white/[0.08] space-y-3 flex-shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="relative">
            <input
              type="text"
              placeholder={isSelectedTomorrow ? "Mark for tomorrow… (e.g. Call dentist 🌸, Submit brief 💼)" : "Mark or keep in mind…"}
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-800 text-[var(--color-text)] text-xs font-medium rounded-xl border border-black/[0.08] dark:border-white/[0.1] outline-none focus:border-[var(--color-accent)] placeholder:text-slate-400 shadow-2xs transition-all"
            />
            {newEventTitle && (
              <button
                type="button"
                onClick={() => setNewEventTitle('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Category selection */}
            <div className="flex items-center gap-1 flex-wrap">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewEventCategory(key)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    newEventCategory === key
                      ? 'bg-[var(--color-accent)] text-white shadow-2xs font-bold scale-105'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Optional Time & Submit */}
            <div className="flex items-center gap-1.5 ml-auto">
              <input
                type="time"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-slate-800 text-[var(--color-text)] text-[11px] font-medium rounded-lg border border-black/[0.08] dark:border-white/[0.1] outline-none"
              />
              <button
                type="submit"
                disabled={!newEventTitle.trim()}
                className="px-3 py-1 bg-[var(--color-accent)] hover:opacity-95 disabled:opacity-40 text-white rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mark</span>
              </button>
            </div>
          </div>
        </form>

        {/* Day's Agenda List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Scheduled Items ({selectedEvents.length})
            </span>
            {selectedEvents.length > 0 && (
              <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                {selectedEvents.filter((i) => i.completed).length}/{selectedEvents.length} done
              </span>
            )}
          </div>

          {selectedEvents.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center text-xl mb-3 text-[var(--color-accent)]">
                🌸
              </div>
              <h4 className="text-sm font-bold text-[var(--color-text)] mb-1">
                Nothing marked for this day
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] max-w-xs leading-relaxed">
                Add an event, reminder, or anything you want to keep in mind for {isSelectedTomorrow ? 'tomorrow' : 'this date'}.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {selectedEvents.map((evt) => {
                  const cat = CATEGORIES[evt.category] || CATEGORIES.personal;
                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group p-3 rounded-xl border transition-all flex items-start gap-2.5 bg-white dark:bg-slate-800/80 shadow-2xs ${
                        evt.completed
                          ? 'border-black/[0.04] dark:border-white/[0.04] opacity-60'
                          : 'border-black/[0.06] dark:border-white/[0.08] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleEvent(evt, e)}
                        className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-all cursor-pointer flex-shrink-0 ${
                          evt.completed
                            ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                            : 'border-black/20 dark:border-white/30 hover:border-[var(--color-accent)]'
                        }`}
                      >
                        {evt.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${cat.badge}`}>
                            {cat.icon} {cat.label}
                          </span>
                          {evt.time && (
                            <span className="text-[10px] font-medium text-[var(--color-text-muted)] flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {evt.time}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs leading-relaxed font-medium transition-all ${
                            evt.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-[var(--color-text)]'
                          }`}
                        >
                          {evt.title}
                        </p>
                      </div>

                      {/* Delete Action */}
                      <button
                        type="button"
                        onClick={() => deleteCalendarEvent(evt.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer flex-shrink-0"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Notes Created / Scheduled on this day */}
          {selectedNotes.length > 0 && (
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Notes from this day ({selectedNotes.length})
              </span>
              <div className="space-y-1.5">
                {selectedNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setOpenNoteId(n.id)}
                    className="w-full text-left p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] hover:bg-[var(--color-accent-bg)] border border-black/[0.05] dark:border-white/[0.06] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs">📝</span>
                      <span className="text-xs font-semibold text-[var(--color-text)] truncate">
                        {n.title || 'Untitled note'}
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
