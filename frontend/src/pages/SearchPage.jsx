import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Search, FileText, CheckSquare, Loader2, ArrowRight } from 'lucide-react';
import api from '../lib/axios';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const results = useQueries({
        queries: [
            {
                queryKey: ['notes', 'search', debouncedQuery],
                queryFn: async () => {
                    if (!debouncedQuery) return [];
                    const res = await api.get('/notes', { params: { search: debouncedQuery } });
                    return res.data.data;
                },
                enabled: !!debouncedQuery
            },
            {
                queryKey: ['tasks', 'search', debouncedQuery],
                queryFn: async () => {
                    if (!debouncedQuery) return [];
                    const res = await api.get('/tasks', { params: { search: debouncedQuery } });
                    return res.data.data;
                },
                enabled: !!debouncedQuery
            }
        ]
    });

    const [notesQuery, tasksQuery] = results;
    const isLoading = notesQuery.isLoading || tasksQuery.isLoading;
    const notes = notesQuery.data || [];
    const tasks = tasksQuery.data || [];

    const hasResults = notes.length > 0 || tasks.length > 0;

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchParams(value ? { q: value } : {});
    };

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950">
            <div className="flex-1 max-w-4xl mx-auto p-6 lg:p-10 flex flex-col h-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Search
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Find anything across your notes and tasks.
                    </p>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Search for notes, tasks..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-lg"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pb-10">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                        </div>
                    ) : !debouncedQuery ? (
                        <div className="text-center py-10 text-slate-400">
                            Type something to start searching...
                        </div>
                    ) : !hasResults ? (
                        <div className="text-center py-10 text-slate-400">
                            No results found for "{debouncedQuery}"
                        </div>
                    ) : (
                        <>
                            {/* Notes Results */}
                            {notes.length > 0 && (
                                <section>
                                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
                                        Notes ({notes.length})
                                    </h2>
                                    <div className="grid gap-3">
                                        {notes.map(note => (
                                            <Link
                                                key={note.id}
                                                to={`/notes?selected=${note.id}`} // We'll need to handle this query param in NotesPage
                                                // Actually better to just navigate to note ID and handle selection logic
                                                // For now, let's just go to /notes and we might need to update NotesPage to accept an ID via state or query
                                                state={{ selectedNoteId: note.id }}
                                                className="group block p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl hover:border-indigo-500/50 transition-all hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                                                                {note.title || 'Untitled Note'}
                                                            </h3>
                                                            <p className="text-sm text-slate-500 line-clamp-1">
                                                                {/* Simple snippet if we had plain text content */}
                                                                Last edited {new Date(note.updatedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Tasks Results */}
                            {tasks.length > 0 && (
                                <section>
                                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
                                        Tasks ({tasks.length})
                                    </h2>
                                    <div className="grid gap-3">
                                        {tasks.map(task => (
                                            <div
                                                key={task.id}
                                                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl"
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center
                                                    ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600'}
                                                `}>
                                                    {task.done && <CheckSquare size={12} fill="currentColor" />}
                                                </div>
                                                <span className={task.done ? 'text-slate-400 line-through' : 'font-medium'}>
                                                    {task.title}
                                                </span>
                                                {/* We could add complete toggle here too if we want */}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
