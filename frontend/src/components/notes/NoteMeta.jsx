import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Folder, Hash, Check, ChevronDown } from 'lucide-react';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';

export default function NoteMeta({ noteId, note }) {
    const queryClient = useQueryClient();
    const [showFolderMenu, setShowFolderMenu] = useState(false);
    const [showTagMenu, setShowTagMenu] = useState(false);
    const folderMenuRef = useRef(null);
    const tagMenuRef = useRef(null);

    const { data: folders = [] } = useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            const res = await api.get('/folders');
            return res.data.data;
        }
    });

    const { data: tags = [] } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await api.get('/tags');
            return res.data.data;
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.put(`/notes/${noteId}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['note', noteId]);
            queryClient.invalidateQueries(['notes']);
        }
    });

    const toggleTagMutation = useMutation({
        mutationFn: async (tagId) => {
            const hasTag = note?.tags?.some(t => t.tag.id === tagId);
            if (hasTag) {
                await api.delete(`/notes/${noteId}/tags/${tagId}`);
            } else {
                await api.post(`/notes/${noteId}/tags/${tagId}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['note', noteId]);
            queryClient.invalidateQueries(['notes']);
        }
    });

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (folderMenuRef.current && !folderMenuRef.current.contains(event.target)) {
                setShowFolderMenu(false);
            }
            if (tagMenuRef.current && !tagMenuRef.current.contains(event.target)) {
                setShowTagMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSetFolder = (folderId) => {
        updateNoteMutation.mutate({ folderId });
        setShowFolderMenu(false);
    };

    const handleToggleTag = (tagId) => {
        toggleTagMutation.mutate(tagId);
    };

    const getTagColor = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
            purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
            pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
            orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
            red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        };
        return colors[color] || colors.blue;
    };

    const currentFolder = note?.folder;
    const currentTags = note?.tags?.map(t => t.tag) || [];

    return (
        <div className="flex items-center gap-3 mb-4">
            {/* Folder Selector */}
            <div className="relative" ref={folderMenuRef}>
                <button
                    onClick={() => setShowFolderMenu(!showFolderMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                    <Folder size={14} className="text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">
                        {currentFolder?.name || 'No folder'}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showFolderMenu && (
                    <div className="absolute top-full mt-1 left-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 py-1">
                        <button
                            onClick={() => handleSetFolder(null)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                        >
                            {!currentFolder && <Check size={14} className="text-indigo-500" />}
                            <span className={!currentFolder ? 'ml-0' : 'ml-5'}>No folder</span>
                        </button>
                        {folders.map((folder) => (
                            <button
                                key={folder.id}
                                onClick={() => handleSetFolder(folder.id)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                            >
                                {currentFolder?.id === folder.id && <Check size={14} className="text-indigo-500" />}
                                <span className={currentFolder?.id === folder.id ? 'ml-0' : 'ml-5'}>{folder.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tag Selector */}
            <div className="relative" ref={tagMenuRef}>
                <button
                    onClick={() => setShowTagMenu(!showTagMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                    <Hash size={14} className="text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">
                        {currentTags.length > 0 ? `${currentTags.length} tags` : 'Add tags'}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showTagMenu && (
                    <div className="absolute top-full mt-1 left-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 py-1 max-h-64 overflow-y-auto">
                        {tags.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-slate-400 italic">No tags available</div>
                        ) : (
                            tags.map((tag) => {
                                const isSelected = currentTags.some(t => t.id === tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => handleToggleTag(tag.id)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                                    >
                                        {isSelected && <Check size={14} className="text-indigo-500" />}
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-xs",
                                            getTagColor(tag.color),
                                            isSelected ? 'ml-0' : 'ml-5'
                                        )}>
                                            {tag.name}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Display current tags */}
            {currentTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {currentTags.map((tag) => (
                        <span
                            key={tag.id}
                            className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                                getTagColor(tag.color)
                            )}
                        >
                            <Hash size={10} />
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
