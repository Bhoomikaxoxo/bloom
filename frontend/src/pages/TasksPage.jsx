import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Filter, SortAsc } from 'lucide-react';
import api from '../lib/axios';
import TaskItem from '../components/tasks/TaskItem';

export default function TasksPage() {
    const queryClient = useQueryClient();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, COMPLETED, PENDING

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks');
            return res.data.data;
        }
    });

    const createTaskMutation = useMutation({
        mutationFn: async (title) => {
            const res = await api.post('/tasks', { title });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            setNewTaskTitle('');
        }
    });

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        createTaskMutation.mutate(newTaskTitle);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'COMPLETED') return task.done;
        if (filter === 'PENDING') return !task.done;
        return true;
    });

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950">
            <div className="flex-1 max-w-4xl mx-auto p-6 lg:p-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Tasks
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Stay organized and track your daily progress.
                    </p>
                </div>

                {/* Add Task Input */}
                <form onSubmit={handleCreateTask} className="mb-8 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <Plus size={20} />
                    </div>
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-lg"
                    />
                    <button
                        type="submit"
                        disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Add Task
                    </button>
                </form>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-6 text-sm overflow-x-auto scrollbar-hide">
                    {['ALL', 'PENDING', 'COMPLETED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap
                                ${filter === f
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }
                            `}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-8 scrollbar-hide">
                    {isLoading ? (
                        <div className="text-center py-10 text-slate-400">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            {filter === 'ALL' ? 'No tasks yet. Add one above!' : 'No tasks match this filter.'}
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
