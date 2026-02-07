import { useState } from 'react';
import { Check, Trash2, Calendar, Flag, MoreVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';

export default function TaskItem({ task }) {
    const queryClient = useQueryClient();
    const [isHovered, setIsHovered] = useState(false);

    const updateTaskMutation = useMutation({
        mutationFn: async (updates) => {
            const res = await api.patch(`/tasks/${task.id}`, updates);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/tasks/${task.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        }
    });

    const toggleComplete = () => {
        updateTaskMutation.mutate({ done: !task.done });
    };

    const priorities = {
        LOW: { color: 'text-slate-400', label: 'Low' },
        MEDIUM: { color: 'text-blue-500', label: 'Medium' },
        HIGH: { color: 'text-red-500', label: 'High' },
    };

    return (
        <div
            className="group flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-lg hover:shadow-sm transition-all relative overflow-visible"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete();
                }}
                className={cn(
                    "flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer z-10",
                    task.done
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-600 hover:border-indigo-500"
                )}
            >
                {task.done && <Check size={12} strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm font-medium truncate transition-all",
                    task.done ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"
                )}>
                    {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {task.dueDate && (
                        <div className={cn("flex items-center gap-1", new Date(task.dueDate) < new Date() && !task.done ? "text-red-500" : "")}>
                            <Calendar size={12} />
                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                        </div>
                    )}

                    <div className="relative group/item-priority">
                        <button
                            className={cn("flex items-center gap-1 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 py-0.5 rounded transition-colors", priorities[task.priority || 'LOW']?.color)}
                        >
                            <Flag size={12} fill="currentColor" />
                            <span>{priorities[task.priority || 'LOW']?.label}</span>
                        </button>

                        <div className="absolute left-0 top-full mt-1 w-28 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden hidden group-hover/item-priority:block z-20">
                            {Object.keys(priorities).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => updateTaskMutation.mutate({ priority: p })}
                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${task.priority === p ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-600 dark:text-slate-400'}`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${p === 'HIGH' ? 'bg-red-500' : p === 'MEDIUM' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                                    {priorities[p].label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", isMobile ? "opacity-100" : "")}>
                <button
                    onClick={() => deleteTaskMutation.mutate()}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

// Helper to detect mobile (naive) for simplicity
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
