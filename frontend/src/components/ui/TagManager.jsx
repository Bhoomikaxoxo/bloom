import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';

const TAG_COLORS = [
    { name: 'blue', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    { name: 'green', class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    { name: 'purple', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    { name: 'pink', class: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
    { name: 'orange', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
    { name: 'red', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
];

export default function TagManager() {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('blue');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingColor, setEditingColor] = useState('blue');

    const { data: tags = [], isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await api.get('/tags');
            return res.data.data;
        }
    });

    const createTagMutation = useMutation({
        mutationFn: async ({ name, color }) => {
            const res = await api.post('/tags', { name, color });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tags']);
            setNewTagName('');
            setNewTagColor('blue');
            setIsCreating(false);
        }
    });

    const updateTagMutation = useMutation({
        mutationFn: async ({ id, name, color }) => {
            const res = await api.put(`/tags/${id}`, { name, color });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tags']);
            setEditingId(null);
        }
    });

    const deleteTagMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/tags/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tags']);
            queryClient.invalidateQueries(['notes']);
            queryClient.invalidateQueries(['tasks']);
        }
    });

    const handleCreate = (e) => {
        e.preventDefault();
        if (newTagName.trim()) {
            createTagMutation.mutate({ name: newTagName.trim(), color: newTagColor });
        }
    };

    const handleUpdate = (id) => {
        if (editingName.trim()) {
            updateTagMutation.mutate({ id, name: editingName.trim(), color: editingColor });
        } else {
            setEditingId(null);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this tag?')) {
            deleteTagMutation.mutate(id);
        }
    };

    const getColorClass = (color) => {
        return TAG_COLORS.find(c => c.name === color)?.class || TAG_COLORS[0].class;
    };

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-2 group">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</span>
                <button
                    onClick={() => setIsCreating(true)}
                    className="text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Create new tag */}
            {isCreating && (
                <form onSubmit={handleCreate} className="px-3 py-1 space-y-2">
                    <div className="flex items-center gap-1">
                        <Hash size={14} className="text-slate-400" />
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="Tag name"
                            autoFocus
                            className="flex-1 bg-transparent text-sm outline-none border-b border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                        {TAG_COLORS.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                onClick={() => setNewTagColor(color.name)}
                                className={cn(
                                    "w-4 h-4 rounded-full border-2 transition-all",
                                    newTagColor === color.name ? "border-slate-900 dark:border-white scale-110" : "border-transparent",
                                    color.class
                                )}
                            />
                        ))}
                        <button type="submit" className="ml-auto text-green-500 hover:text-green-600">
                            <Check size={14} />
                        </button>
                        <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={14} />
                        </button>
                    </div>
                </form>
            )}

            {/* Tag list */}
            {isLoading ? (
                <div className="text-sm text-slate-500 px-3 italic">Loading...</div>
            ) : tags.length === 0 && !isCreating ? (
                <div className="text-sm text-slate-500 px-3 italic">No tags yet</div>
            ) : (
                <div className="flex flex-wrap gap-2 px-3">
                    {tags.map((tag) => (
                        <div key={tag.id} className="group relative">
                            {editingId === tag.id ? (
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onBlur={() => handleUpdate(tag.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleUpdate(tag.id);
                                            if (e.key === 'Escape') setEditingId(null);
                                        }}
                                        autoFocus
                                        className="px-2 py-0.5 text-xs rounded-full bg-transparent border border-indigo-500 outline-none"
                                    />
                                    <div className="flex gap-1">
                                        {TAG_COLORS.map((color) => (
                                            <button
                                                key={color.name}
                                                type="button"
                                                onClick={() => setEditingColor(color.name)}
                                                className={cn(
                                                    "w-3 h-3 rounded-full border transition-all",
                                                    editingColor === color.name ? "border-slate-900 dark:border-white scale-110" : "border-transparent",
                                                    color.class
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={`/notes?tag=${tag.id}`}
                                    className={({ isActive }) => cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all",
                                        getColorClass(tag.color),
                                        isActive && "ring-2 ring-offset-1 ring-indigo-500"
                                    )}
                                >
                                    <Hash size={10} />
                                    <span>{tag.name}</span>
                                    <span className="text-[10px] opacity-70">{tag._count?.notes || 0}</span>
                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 ml-1">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setEditingId(tag.id);
                                                setEditingName(tag.name);
                                                setEditingColor(tag.color);
                                            }}
                                            className="hover:text-current"
                                        >
                                            <Edit2 size={10} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDelete(tag.id);
                                            }}
                                            className="hover:text-red-600"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </div>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
