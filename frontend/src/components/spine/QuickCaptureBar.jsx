import React, { useState } from 'react';
import useSlateStore from '../../store/useSlateStore';
import { Plus, Clock, CalendarDays, Zap, ArrowRight } from 'lucide-react';

const QuickCaptureBar = () => {
  const quickCapture = useSlateStore((state) => state.quickCapture);
  const [text, setText] = useState('');
  const [scheduleWhen, setScheduleWhen] = useState('today'); // 'today' | 'tomorrow' | 'someday'
  const [timeBlock, setTimeBlock] = useState('');
  const [energyDomain, setEnergyDomain] = useState('focus'); // 'focus' | 'urgent' | 'routine' | 'calm'
  const [showOptions, setShowOptions] = useState(false);

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const scheduledDate =
      scheduleWhen === 'today'
        ? getTodayStr()
        : scheduleWhen === 'tomorrow'
        ? getTomorrowStr()
        : null;

    quickCapture(text.trim(), {
      type: 'task',
      scheduledDate,
      timeBlock: timeBlock.trim() || null,
      energyDomain,
    });

    setText('');
    setTimeBlock('');
    setShowOptions(false);
  };

  return (
    <div className="mb-7 bg-white rounded-xl border border-[#E8E3D8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-2 sm:p-2.5 transition-all focus-within:border-bloom-400 focus-within:ring-2 focus-within:ring-bloom-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Main Capture Input (Zero decisions required to capture) */}
        <div className="flex items-center gap-2 px-2">
          <Plus className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Capture an action or thought... (press Enter to commit)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setShowOptions(true)}
            className="w-full text-sm font-medium text-stone-900 placeholder:text-stone-400 bg-transparent outline-none py-1"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-3 py-1 bg-bloom-500 hover:bg-bloom-600 disabled:opacity-30 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <span>Capture</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Implementation Intentions Nudge (When / Where / Energy) */}
        {showOptions && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 px-2 animate-fade-in text-xs">
            {/* When Nudge */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-stone-500">When:</span>
              {[
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'someday', label: 'Someday' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setScheduleWhen(id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    scheduleWhen === id
                      ? 'bg-bloom-100 text-bloom-700 font-bold border border-bloom-300'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Time block input */}
              <input
                type="time"
                value={timeBlock}
                onChange={(e) => setTimeBlock(e.target.value)}
                className="text-[11px] font-mono px-1.5 py-0.5 rounded border border-stone-200 bg-stone-50 text-stone-700 outline-none"
                title="Attach specific time (Implementation Intention)"
              />
            </div>

            {/* Cognitive Energy Domain */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-medium text-stone-500">Energy:</span>
              {[
                { id: 'focus', label: 'Deep Focus', color: '#244A38' },
                { id: 'urgent', label: 'Immediate', color: '#A63E0F' },
                { id: 'routine', label: 'Admin', color: '#7D5E29' },
                { id: 'calm', label: 'Reflection', color: '#58446B' },
              ].map(({ id, label, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEnergyDomain(id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    energyDomain === id
                      ? 'bg-stone-800 text-white font-bold'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuickCaptureBar;

