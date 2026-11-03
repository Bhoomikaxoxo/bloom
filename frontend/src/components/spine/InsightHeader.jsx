import React, { useMemo } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { AlertCircle, Flame, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const InsightHeader = () => {
  const getSurfacedInsight = useSlateStore((state) => state.getSurfacedInsight);
  const notes = useSlateStore((state) => state.notes || []);
  const setOpenNoteId = useSlateStore((state) => state.setOpenNoteId);

  const insight = useMemo(() => {
    return getSurfacedInsight ? getSurfacedInsight() : null;
  }, [getSurfacedInsight, notes]);

  // Compute actual consecutive completed day streak from local data
  const streakDays = useMemo(() => {
    const completedItems = notes.filter((n) => n.completedAt && n.deletedAt === null);
    if (completedItems.length === 0) return 0;
    // Count unique completed days
    const days = new Set(
      completedItems.map((n) => new Date(n.completedAt).toISOString().split('T')[0])
    );
    return Math.max(1, days.size);
  }, [notes]);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!insight) return null;

  return (
    <div className="mb-6 p-5 sm:p-6 rounded-xl border border-[#E8E3D8] bg-[#FDFCF9] shadow-[0_1px_3px_rgba(35,25,15,0.04)] select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Surfaced Cognitive Insight */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              insight.type === 'in_progress'
                ? 'bg-bloom-100 text-bloom-600 border border-bloom-300'
                : insight.type === 'slipping'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : insight.type === 'anchor'
                ? 'bg-bloom-50 text-bloom-600 border border-bloom-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {insight.type === 'in_progress' ? (
              <Clock className="w-4 h-4 animate-pulse" />
            ) : insight.type === 'slipping' ? (
              <AlertCircle className="w-4 h-4" />
            ) : insight.type === 'anchor' ? (
              <Sparkles className="w-4 h-4 text-bloom-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-bloom-700 bg-bloom-100/80 px-2 py-0.5 rounded">
                {insight.badge}
              </span>
              <span className="text-xs font-mono text-stone-500">
                {todayFormatted}
              </span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 leading-snug">
              {insight.headline}
            </h3>

            <p className="text-xs text-stone-600 mt-0.5 max-w-xl leading-relaxed">
              {insight.subtext}
            </p>
          </div>
        </div>

        {/* Right: Loss-Aversion Follow-Through Streak & Jump Action */}
        <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E3D8] bg-white text-stone-800 shadow-2xs">
            <Flame className="w-4 h-4 text-bloom-500" />
            <span className="text-xs font-mono font-bold">{streakDays}</span>
            <span className="text-xs font-medium text-stone-600">day streak</span>
          </div>

          {insight.itemId && (
            <button
              type="button"
              onClick={() => setOpenNoteId(insight.itemId)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-bloom-700 hover:text-bloom-900 bg-bloom-50 hover:bg-bloom-100 border border-bloom-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Focus item</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightHeader;

