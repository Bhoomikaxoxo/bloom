import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Folder, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';

export default function FolderManager() {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    const { data: folders = [], isLoading } = useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            const res = await api.get('/folders');
            return res.data.data;
        }
    });

    const createFolderMutation = useMutation({
        mutationFn: async (name) => {
            const res = await api.post('/folders', { name });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['folders']);
            setNewFolderName('');
            setIsCreating(false);
        }
    });

    const updateFolderMutation = useMutation({
        mutationFn: async ({ id, name }) => {
            const res = await api.put(`/folders/${id}`, { name });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['folders']);
            setEditingId(null);
        }
    });

    const deleteFolderMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/folders/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['folders']);
            queryClient.invalidateQueries(['notes']);
        }
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (newFolderName.trim()) {
            createFolderMutation.mutate(newFolderName.trim());
        }
    };

    const handleUpdate = (id) => {
        if (editingName.trim()) {
            updateFolderMutation.mutate({ id, name: editingName.trim() });
        } else {
            setEditingId(null);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this folder? Notes will not be deleted.')) {
            deleteFolderMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-2 group">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Folders</span>
                <button
                    onClick={() => setIsCreating(true)}
                    className="text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Create new folder */}
            {isCreating && (
                <form onSubmit={handleCreate} className="px-3 py-1 flex items-center gap-1">
                    <Folder size={14} className="text-slate-400" />
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                        autoFocus
                        className="flex-1 bg-transparent text-sm outline-none border-b border-indigo-500"
                    />
                    <button type="submit" className="text-green-500 hover:text-green-600">
                        <Check size={14} />
                    </button>
                    <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                    </button>
                </form>
            )}

            {/* Folder list */}
            {isLoading ? (
                <div className="text-sm text-slate-500 px-3 italic">Loading...</div>
            ) : folders.length === 0 && !isCreating ? (
                <div className="text-sm text-slate-500 px-3 italic">No folders yet</div>
            ) : (
                folders.map((folder) => (
                    <div
                        key={folder.id}
                        className="group relative"
                    >
                        {editingId === folder.id ? (
                            <div className="px-3 py-1 flex items-center gap-1">
                                <Folder size={14} className="text-slate-400" />
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => handleUpdate(folder.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdate(folder.id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    autoFocus
                                    className="flex-1 bg-transparent text-sm outline-none border-b border-indigo-500"
                                />
                            </div>
                        ) : (
                            <NavLink
                                to={`/notes?folder=${folder.id}`}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                                    isActive
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <Folder size={14} />
                                <span className="flex-1 truncate">{folder.name}</span>
                                <span className="text-xs text-slate-400">{folder._count?.notes || 0}</span>
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setEditingId(folder.id);
                                            setEditingName(folder.name);
                                        }}
                                        className="p-0.5 hover:text-indigo-500"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(folder.id);
                                        }}
                                        className="p-0.5 hover:text-red-500"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </NavLink>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
