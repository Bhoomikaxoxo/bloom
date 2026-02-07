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
            className="group flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-lg hover:shadow-sm transition-all"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={toggleComplete}
                className={cn(
                    "flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors",
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
                    {task.priority && task.priority !== 'NONE' && (
                        <div className={cn("flex items-center gap-1 font-medium", priorities[task.priority]?.color)}>
                            <Flag size={12} fill="currentColor" />
                            <span>{priorities[task.priority]?.label}</span>
                        </div>
                    )}
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
