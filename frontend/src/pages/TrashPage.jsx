import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, RotateCcw, Trash, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/axios';
import { cn } from '../lib/utils';

export default function TrashPage() {
    const queryClient = useQueryClient();
    const [selectedNotes, setSelectedNotes] = useState(new Set());

    const { data: trashedNotes = [], isLoading } = useQuery({
        queryKey: ['notes', 'trash'],
        queryFn: async () => {
            const res = await api.get('/notes/trash');
            return res.data.data;
        }
    });

    const restoreNoteMutation = useMutation({
        mutationFn: async (noteId) => {
            await api.post(`/notes/${noteId}/restore`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setSelectedNotes(new Set());
        }
    });

    const permanentDeleteMutation = useMutation({
        mutationFn: async (noteId) => {
            await api.delete(`/notes/${noteId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setSelectedNotes(new Set());
        }
    });

    const emptyTrashMutation = useMutation({
        mutationFn: async () => {
            await Promise.all(
                trashedNotes.map(note => api.delete(`/notes/${note.id}`))
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setSelectedNotes(new Set());
        }
    });

    const handleRestore = (noteId) => {
        restoreNoteMutation.mutate(noteId);
    };

    const handlePermanentDelete = (noteId) => {
        if (window.confirm('This will permanently delete the note. This action cannot be undone!')) {
            permanentDeleteMutation.mutate(noteId);
        }
    };

    const handleEmptyTrash = () => {
        if (window.confirm(`This will permanently delete all ${trashedNotes.length} notes in trash. This action cannot be undone!`)) {
            emptyTrashMutation.mutate();
        }
    };

    const toggleSelect = (noteId) => {
        const newSelected = new Set(selectedNotes);
        if (newSelected.has(noteId)) {
            newSelected.delete(noteId);
        } else {
            newSelected.add(noteId);
        }
        setSelectedNotes(newSelected);
    };

    const handleRestoreSelected = () => {
        selectedNotes.forEach(noteId => {
            restoreNoteMutation.mutate(noteId);
        });
    };

    const handleDeleteSelected = () => {
        if (window.confirm(`This will permanently delete ${selectedNotes.size} notes. This action cannot be undone!`)) {
            selectedNotes.forEach(noteId => {
                permanentDeleteMutation.mutate(noteId);
            });
        }
    };

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950">
            <div className="flex-1 max-w-4xl mx-auto p-6 lg:p-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            Trash
                        </h1>
                        {trashedNotes.length > 0 && (
                            <button
                                onClick={handleEmptyTrash}
                                disabled={emptyTrashMutation.isPending}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Trash size={16} />
                                Empty Trash
                            </button>
                        )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                        Notes in trash will be kept for 30 days before being permanently deleted.
                    </p>
                </div>

                {/* Bulk Actions */}
                {selectedNotes.size > 0 && (
                    <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                            {selectedNotes.size} note{selectedNotes.size > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRestoreSelected}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                            >
                                <RotateCcw size={14} />
                                Restore
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Trash size={14} />
                                Delete Forever
                            </button>
                            <button
                                onClick={() => setSelectedNotes(new Set())}
                                className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Trash List */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-8 scrollbar-hide">
                    {isLoading ? (
                        <div className="text-center py-10 text-slate-400">Loading...</div>
                    ) : trashedNotes.length === 0 ? (
                        <div className="text-center py-20">
                            <Trash2 className="mx-auto mb-4 text-slate-300 dark:text-slate-700" size={64} />
                            <p className="text-lg font-medium text-slate-400">Trash is empty</p>
                            <p className="text-sm text-slate-500 mt-1">Deleted notes will appear here</p>
                        </div>
                    ) : (
                        trashedNotes.map((note) => (
                            <div
                                key={note.id}
                                className={cn(
                                    "group p-4 bg-white dark:bg-slate-900 border rounded-xl transition-all",
                                    selectedNotes.has(note.id)
                                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                                        : "border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedNotes.has(note.id)}
                                        onChange={() => toggleSelect(note.id)}
                                        className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                    />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                            {note.title || 'Untitled Note'}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                            <span>Deleted {format(new Date(note.deletedAt), 'MMM d, yyyy')}</span>
                                            {note.folder && (
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                    {note.folder.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleRestore(note.id)}
                                            disabled={restoreNoteMutation.isPending}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
                                            title="Restore"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(note.id)}
                                            disabled={permanentDeleteMutation.isPending}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete Forever"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Warning */}
                {trashedNotes.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                            Notes in trash are automatically deleted after 30 days. Use "Empty Trash" to delete all notes immediately.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
