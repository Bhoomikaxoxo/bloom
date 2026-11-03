import React, { useState, useMemo } from 'react';
import useSlateStore from '../../store/useSlateStore';
import InsightHeader from './InsightHeader';
import AnchorCard from './AnchorCard';
import QuickCaptureBar from './QuickCaptureBar';
import {
  Clock, Check, Sparkles, AlertCircle, ArrowRight,
  CalendarDays, Plus, FileText, CheckSquare, Trash2,
  ChevronRight, BookmarkCheck, Sun, Moon
} from 'lucide-react';

const ENERGY_MAP = {
  focus: { label: 'Deep Focus', dot: '#244A38', badge: 'bg-[#F0F5F2] text-[#244A38] border-[#C7D9CF]' },
  urgent: { label: 'Immediate', dot: '#A63E0F', badge: 'bg-[#FDF4EF] text-[#A63E0F] border-[#F2DDD1]' },
  routine: { label: 'Routine', dot: '#7D5E29', badge: 'bg-[#FAF5EB] text-[#7D5E29] border-[#EBDCBF]' },
  calm: { label: 'Sanctuary', dot: '#58446B', badge: 'bg-[#F5F1F8] text-[#58446B] border-[#DDD4E7]' },
};

const DailySpineView = () => {
  const {
    notes = [],
    setTaskStatus,
    scheduleItem,
    setTodayAnchor,
    deleteNote,
    setOpenNoteId,
    triggerConfetti,
    getReflectionPrompt,
    quickCapture,
  } = useSlateStore();

  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => new Date(Date.now() + 86400000).toISOString().split('T')[0], []);

  // Items for today (excluding deleted and anchor which has its own prominent card)
  const todayItems = useMemo(() => {
    return notes.filter((n) => {
      if (n.deletedAt !== null) return false;
      const createdDate = new Date(n.createdAt).toISOString().split('T')[0];
      return n.scheduledDate === todayStr || createdDate === todayStr;
    });
  }, [notes, todayStr]);

  // Zeigarnik Effect: In-Progress attention items surfaced prominently
  const inProgressItems = useMemo(() => {
    return todayItems.filter((n) => n.status === 'in_progress' && !n.isAnchor);
  }, [todayItems]);

  // Today's scheduled tasks & commitments
  const scheduledTasks = useMemo(() => {
    return todayItems.filter((n) => (n.type === 'task' || n.type === 'checklist') && !n.isAnchor);
  }, [todayItems]);

  // Notes written or scheduled today
  const todayNotes = useMemo(() => {
    return todayItems.filter((n) => n.type === 'note');
  }, [todayItems]);

  // Progressive disclosure prompt matching the current hour
  const reflectionPrompt = useMemo(() => {
    return getReflectionPrompt ? getReflectionPrompt() : null;
  }, [getReflectionPrompt]);

  const handleToggleTask = (task, e) => {
    e.stopPropagation();
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    setTaskStatus(task.id, nextStatus);
    if (nextStatus === 'completed') {
      triggerConfetti(e.clientX, e.clientY);
    }
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

  return (
    <div className="flex-1 overflow-y-auto bg-paper-grain p-4 sm:p-7 select-none">
      <div className="max-w-3xl mx-auto w-full">
        {/* 1. Surfaced Attention Header (Actionable Insight, No Pleasantries) */}
        <InsightHeader />

        {/* 2. Today's North Star Anchor (Von Restorff / Isolation Effect) */}
        <AnchorCard />

        {/* 3. Zero-Friction Quick Capture Bar */}
        <QuickCaptureBar />

        {/* 4. Active Working Memory Queue (Zeigarnik Effect) */}
        {inProgressItems.length > 0 && (
          <div className="mb-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-bloom-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-bloom-700">
                Active Working Memory ({inProgressItems.length})
              </span>
            </div>
            <div className="space-y-2">
              {inProgressItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setOpenNoteId(item.id)}
                  className="ledger-card in-progress-glow p-3.5 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handleToggleTask(item, e)}
                      className="bloom-checkbox mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono text-bloom-600 bg-bloom-100 px-1.5 py-0.2 rounded font-bold">
                          In Progress
                        </span>
                        {item.timeBlock && (
                          <span className="text-[10px] font-mono text-stone-500">
                            {item.timeBlock}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug truncate">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTaskStatus(item.id, 'completed');
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-bloom-500 text-white hover:bg-bloom-600 rounded-md transition-colors cursor-pointer"
                  >
                    Finish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Today's Timeline & Scheduled Tasks (Implementation Intentions) */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-bloom-600" />
              <h3 className="font-serif text-base font-bold text-stone-900">
                Today's Commitments ({scheduledTasks.length})
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              {scheduledTasks.filter((t) => t.status === 'completed').length}/{scheduledTasks.length} closed
            </span>
          </div>

          {scheduledTasks.length === 0 ? (
            <div className="py-7 text-center border border-dashed border-stone-300 rounded-xl bg-white/40 p-4">
              <p className="text-xs text-stone-500">No scheduled tasks on today's timeline.</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Use the quick capture above to commit a task to today.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scheduledTasks.map((task) => {
                const isDone = task.status === 'completed';
                const isInProgress = task.status === 'in_progress';
                const energy = ENERGY_MAP[task.energyDomain] || ENERGY_MAP.focus;

                return (
                  <div
                    key={task.id}
                    onClick={() => setOpenNoteId(task.id)}
                    className={`ledger-card p-3 sm:p-3.5 flex items-start justify-between gap-3 cursor-pointer group ${
                      isDone ? 'opacity-50 bg-stone-50' : isInProgress ? 'in-progress-glow' : ''
                    }`}
                  >
                    {/* Checkbox & Details */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => handleToggleTask(task, e)}
                        className={`bloom-checkbox mt-0.5 ${isDone ? 'checked' : ''}`}
                      >
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          {task.timeBlock ? (
                            <span className="text-[10px] font-mono font-medium text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                              {task.timeBlock}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const time = prompt('Attach specific time block (e.g. 14:00):');
                                if (time) scheduleItem(task.id, todayStr, time);
                              }}
                              className="text-[10px] font-mono text-stone-400 hover:text-bloom-600 hover:underline"
                            >
                              + time
                            </button>
                          )}

                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border flex items-center gap-1 ${energy.badge}`}>
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: energy.dot }} />
                            <span>{energy.label}</span>
                          </span>
                        </div>

                        <p
                          className={`text-xs sm:text-sm font-medium leading-relaxed ${
                            isDone ? 'line-through text-stone-400' : 'text-stone-900'
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>
                    </div>

                    {/* Secondary Actions (Defer to Tomorrow / Start Focus) */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {!isDone && !isInProgress && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskStatus(task.id, 'in_progress');
                          }}
                          className="text-[10px] font-semibold text-bloom-700 bg-bloom-50 hover:bg-bloom-100 px-2 py-0.5 rounded border border-bloom-200 cursor-pointer"
                          title="Start task (Pull into active focus)"
                        >
                          Start
                        </button>
                      )}

                      {!isDone && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scheduleItem(task.id, tomorrowStr, task.timeBlock);
                          }}
                          className="text-[10px] font-medium text-stone-500 hover:text-stone-800 bg-stone-100 px-2 py-0.5 rounded cursor-pointer"
                          title="Consciously reschedule to Tomorrow"
                        >
                          Tomorrow
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(task.id);
                        }}
                        className="text-stone-400 hover:text-red-600 p-1 rounded cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Today's Notes & Manuscript Thoughts (Physical Paper Sheet Treatment) */}
        {todayNotes.length > 0 && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-700" />
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Notes & Manuscript Captures ({todayNotes.length})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setOpenNoteId(note.id)}
                  className="paper-sheet p-4 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-serif text-base font-semibold text-stone-900 leading-snug mb-1.5">
                      {note.title || 'Untitled Thought'}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {note.content ? note.content.replace(/<[^>]*>/g, '') : 'Empty note…'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-bloom-600 font-sans hover:underline">Open manuscript →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Progressive Disclosure Contextual Reflection (Single Question, Zero Overwhelm) */}
        {reflectionPrompt && (
          <div className="p-5 rounded-xl border border-[#E8E3D8] bg-[#FDFCF9] shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-bloom-700 bg-bloom-100 px-2 py-0.5 rounded">
                {reflectionPrompt.timeOfDay}
              </span>
              <span className="text-[11px] text-stone-500">Progressive reflection</span>
            </div>

            <h4 className="font-serif text-base font-semibold text-stone-900 mb-2.5">
              {reflectionPrompt.prompt}
            </h4>

            {reflectionSaved ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <BookmarkCheck className="w-4 h-4" />
                <span>Reflection captured into today's timeline.</span>
              </div>
            ) : (
              <form onSubmit={handleSaveReflection} className="space-y-2">
                <textarea
                  rows={2}
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="A quiet sentence or two..."
                  className="w-full text-xs text-stone-900 p-2.5 rounded-lg border border-stone-200 bg-white outline-none focus:border-bloom-400 placeholder:text-stone-400 font-serif"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!reflectionInput.trim()}
                    className="px-3 py-1 bg-stone-800 hover:bg-stone-900 disabled:opacity-30 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySpineView;
