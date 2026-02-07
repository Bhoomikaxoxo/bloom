import { useState } from 'react';
import { Search, Plus, Calendar, Pin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

const mockNotes = [
    { id: '1', title: 'Project Ideas', updatedAt: new Date().toISOString(), content: {}, isPinned: true },
    { id: '2', title: 'Meeting Notes', updatedAt: new Date().toISOString(), content: {}, isPinned: false },
    { id: '3', title: 'Grocery List', updatedAt: new Date().toISOString(), content: {}, isPinned: false },
];

export default function NotesList({ onSelectNote, selectedNoteId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { search } = window.location; // Simple way to get query params for now, ideally useSearchParams
    const params = new URLSearchParams(search);
    const filter = params.get('filter');
    const folderId = params.get('folder');
    const tagId = params.get('tag');

    const { data: notes = [], isLoading, isError } = useQuery({
        queryKey: ['notes', filter, folderId, tagId],
        queryFn: async () => {
            const endpoint = filter === 'trash' ? '/notes/trash' : '/notes';
            const res = await api.get(endpoint, {
                params: {
                    search: searchQuery,
                    isPinned: filter === 'favorites' ? true : undefined,
                    folderId: folderId || undefined,
                    tagId: tagId || undefined
                }
            });
            return res.data.data;
        }
    });

    const createNoteMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/notes', {
                title: 'Untitled Note',
                content: {},
            });
            return res.data.data;
        },
        onSuccess: (newNote) => {
            queryClient.invalidateQueries(['notes']);
            onSelectNote(newNote.id);
        }
    });

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full lg:w-80 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 flex flex-col h-full">
            {/* Header / Search */}
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg capitalize">{filter || 'All Notes'}</h2>
                    <button
                        onClick={() => createNoteMutation.mutate()}
                        disabled={createNoteMutation.isPending}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-indigo-600 dark:text-indigo-400 disabled:opacity-50"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm border-none focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                {isLoading && <p className="text-center text-slate-400 text-sm py-4">Loading notes...</p>}

                {!isLoading && filteredNotes.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-4">No notes found.</p>
                )}

                {filteredNotes.map(note => (
                    <button
                        key={note.id}
                        onClick={() => onSelectNote(note.id)}
                        className={`
                            w-full text-left p-3 rounded-lg border transition-all duration-200 group
                            ${selectedNoteId === note.id
                                ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900 shadow-sm ring-1 ring-indigo-500/20'
                                : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-slate-200/50 dark:hover:border-slate-700/50'
                            }
                        `}
                    >
                        <div className="flex items-start justify-between mb-1">
                            <h3 className={`font-medium truncate ${selectedNoteId === note.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                {note.title || 'Untitled'}
                            </h3>
                            {note.isPinned && <Pin size={12} className="text-amber-500 shrink-0 mt-1" fill="currentColor" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar size={12} />
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
