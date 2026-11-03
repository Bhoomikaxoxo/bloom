import React from 'react';
import useSlateStore from '../../store/useSlateStore';
import { Sparkles, Check, Clock, Plus, ArrowRight, Star } from 'lucide-react';

const AnchorCard = () => {
  const notes = useSlateStore((state) => state.notes || []);
  const setTaskStatus = useSlateStore((state) => state.setTaskStatus);
  const setTodayAnchor = useSlateStore((state) => state.setTodayAnchor);
  const setOpenNoteId = useSlateStore((state) => state.setOpenNoteId);
  const triggerConfetti = useSlateStore((state) => state.triggerConfetti);

  const todayStr = new Date().toISOString().split('T')[0];

  // Find designated anchor or suggest highest priority task
  const anchorItem = notes.find((n) => n.deletedAt === null && n.isAnchor);
  const openTasks = notes.filter((n) => n.deletedAt === null && (n.type === 'task' || n.type === 'checklist') && n.status !== 'completed');

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    if (!anchorItem) return;

    if (anchorItem.status === 'todo') {
      setTaskStatus(anchorItem.id, 'in_progress');
    } else if (anchorItem.status === 'in_progress') {
      setTaskStatus(anchorItem.id, 'completed');
      triggerConfetti(e.clientX, e.clientY);
    } else {
      setTaskStatus(anchorItem.id, 'todo');
    }
  };

  if (!anchorItem) {
    if (openTasks.length === 0) return null;
    return (
      <div className="mb-6 p-4 rounded-xl border border-dashed border-bloom-300 bg-bloom-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-bloom-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-stone-900">Set Today's North Star Anchor</h4>
            <p className="text-[11px] text-stone-600">Choose one task to anchor today's attention.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {openTasks.slice(0, 3).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => setTodayAnchor(task.id)}
              className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-bloom-100 border border-bloom-200 text-stone-800 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
            >
              Set "{task.title.slice(0, 22)}{task.title.length > 22 ? '…' : ''}"
            </button>
          ))}
        </div>
      </div>
    );
  }

  const isCompleted = anchorItem.status === 'completed';
  const isInProgress = anchorItem.status === 'in_progress';

  return (
    <div
      onClick={() => setOpenNoteId(anchorItem.id)}
      className="anchor-card mb-6 p-5 sm:p-6 cursor-pointer relative group transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Anchor Title & State */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`w-6 h-6 mt-1 rounded-md border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              isCompleted
                ? 'bg-bloom-500 border-bloom-500 text-white'
                : isInProgress
                ? 'border-bloom-500 bg-bloom-100 text-bloom-600 ring-2 ring-bloom-200'
                : 'border-stone-400 bg-white hover:border-bloom-500'
            }`}
            title={
              isCompleted
                ? 'Mark incomplete'
                : isInProgress
                ? 'Mark complete (Relieves working memory)'
                : 'Start task (Zeigarnik focus)'
            }
          >
            {isCompleted ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : isInProgress ? (
              <Clock className="w-3 h-3 animate-pulse" />
            ) : null}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-bloom-700 bg-bloom-100/90 px-2 py-0.5 rounded flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>Today's Anchor</span>
              </span>
              {anchorItem.timeBlock && (
                <span className="text-[11px] font-mono text-stone-600 bg-white/80 px-1.5 py-0.5 rounded border border-stone-200">
                  {anchorItem.timeBlock}
                </span>
              )}
              {isInProgress && (
                <span className="text-[10px] font-bold text-bloom-600 flex items-center gap-1 animate-pulse">
                  <span>In-progress</span>
                </span>
              )}
            </div>

            <h2
              className={`font-serif text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-stone-900 ${
                isCompleted ? 'line-through text-stone-400' : ''
              }`}
            >
              {anchorItem.title}
            </h2>

            {anchorItem.checklist && anchorItem.checklist.length > 0 && (
              <div className="mt-2.5 space-y-1">
                {anchorItem.checklist.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs text-stone-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.done ? 'bg-bloom-500' : 'bg-stone-300'}`} />
                    <span className={item.done ? 'line-through text-stone-400' : ''}>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status Switcher Button */}
        <div className="flex items-center gap-2 flex-shrink-0 self-center">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isCompleted
                ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                : isInProgress
                ? 'bg-bloom-500 text-white hover:bg-bloom-600 shadow-xs'
                : 'bg-white hover:bg-bloom-50 text-bloom-700 border border-bloom-300'
            }`}
          >
            {isCompleted ? 'Completed' : isInProgress ? 'Complete Task' : 'Start Focus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnchorCard;

