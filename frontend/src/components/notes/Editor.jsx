import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Trash2, Pin, ImagePlus, Download, FileDown,
    Bold, Italic
} from 'lucide-react';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';
import NoteMeta from './NoteMeta';
import { exportNoteAsMarkdown, exportNoteAsPDF } from '../../utils/export';


const FormattingToolbar = ({ editor }) => {
    if (!editor) return null;

    const toggleBold = () => editor.chain().focus().toggleBold().run();
    const toggleItalic = () => editor.chain().focus().toggleItalic().run();

    const Button = ({ onClick, isActive, icon: Icon, title }) => (
        <button
            onClick={onClick}
            className={cn(
                "p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400",
                isActive && "bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400"
            )}
            title={title}
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div className="flex items-center gap-1 p-1 mb-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-x-auto">
            <Button onClick={toggleBold} isActive={editor.isActive('bold')} icon={Bold} title="Bold (Cmd+B)" />
            <Button onClick={toggleItalic} isActive={editor.isActive('italic')} icon={Italic} title="Italic (Cmd+I)" />
        </div>
    );
};

export default function Editor({ noteId, onNoteDeleted }) {
    const queryClient = useQueryClient();
    const saveTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const editorContentRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: note, isLoading } = useQuery({
        queryKey: ['note', noteId],
        queryFn: async () => {
            const res = await api.get(`/notes/${noteId}`);
            return res.data.data;
        },
        enabled: !!noteId
    });

    const updateNoteMutation = useMutation({
        mutationFn: async (updatedData) => {
            const res = await api.put(`/notes/${noteId}`, updatedData);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']); // Refresh list to show updated title/preview
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/notes/${noteId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            if (onNoteDeleted) onNoteDeleted();
        }
    });

    const togglePinMutation = useMutation({
        mutationFn: async () => {
            const res = await api.put(`/notes/${noteId}`, { isPinned: !note?.isPinned });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            queryClient.invalidateQueries(['note', noteId]);
        }
    });

    // Image upload handler
    const uploadImage = async (file) => {
        console.log('Uploading image:', file.name, file.type, file.size);
        const formData = new FormData();
        formData.append('image', file);

        setIsUploading(true);
        try {
            const res = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Upload response:', res.data);
            const imageUrl = res.data.data.url;
            console.log('Image URL:', imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Image upload failed:', error);
            console.error('Error response:', error.response?.data);
            alert(`Image upload failed: ${error.response?.data?.error?.message || error.message}`);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Typography,
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            // Auto-save logic could go here
            // For now, we will save manually on blur or use a timer 
            // Let's implement a simple 1 second debounce
            const json = editor.getJSON();
            // We need a ref to handle the debounce timer to avoid re-renders,
            // but for this iteration let's just save on Blur to start simple? 
            // No, auto-save is better.
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[50vh]',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        uploadImage(file).then(url => {
                            const { schema } = view.state;
                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                            const node = schema.nodes.image.create({ src: url });
                            const transaction = view.state.tr.insert(coordinates.pos, node);
                            view.dispatch(transaction);
                        });
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                            uploadImage(file).then(url => {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            });
                        }
                        return true;
                    }
                }
                return false;
            },
        },
    });

    // Save content on 1s debounce
    useEffect(() => {
        if (!editor || !noteId) return;

        const handleUpdate = () => {
            const content = editor.getJSON();
            // Clear previous timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            // Set new timeout
            saveTimeoutRef.current = setTimeout(() => {
                updateNoteMutation.mutate({ content });
            }, 1000);
        };

        editor.on('update', handleUpdate);
        return () => {
            editor.off('update', handleUpdate);
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [editor, noteId]); // Removed updateNoteMutation from dependencies


    // Sync editor content when note changes
    useEffect(() => {
        if (editor && note && !editor.isFocused) {
            // Only set content if we are not currently typing to avoid cursor jumps
            // Or only on initial load. using !editor.isFocused is a naive check.
            // Better: Check if content is different or if it's the first load
            // For MVP: Just set on load.
            editor.commands.setContent(note.content || '');
        }
    }, [note, editor]); // Removing editor dependency to prevent loops? No, editor is stable.

    // Handle title change
    const handleTitleChange = (e) => {
        updateNoteMutation.mutate({ title: e.target.value });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNoteMutation.mutate();
        }
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        console.log('File selected:', file);
        if (file && file.type.startsWith('image/')) {
            try {
                console.log('Starting upload...');
                const url = await uploadImage(file);
                console.log('Upload complete, inserting image with URL:', url);
                editor?.commands.setImage({ src: url });
                console.log('Image inserted into editor');
            } catch (error) {
                console.error('File select error:', error);
                // Error already shown in uploadImage function
            }
        } else {
            alert('Please select an image file');
        }
    };

    if (!noteId) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-400 italic">
                Select a note to view
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-12">
                {/* Header with actions */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Insert image"
                        >
                            <ImagePlus size={18} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => exportNoteAsMarkdown(note)}
                            className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Export as Markdown (.md)"
                        >
                            <Download size={18} />
                        </button>
                        <button
                            onClick={() => exportNoteAsPDF(note, editorContentRef.current)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Export as PDF"
                        >
                            <FileDown size={18} />
                        </button>
                        <button
                            onClick={() => togglePinMutation.mutate()}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                note?.isPinned
                                    ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                            title={note?.isPinned ? "Unpin note" : "Pin note"}
                        >
                            <Pin size={18} fill={note?.isPinned ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete note"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Folder and Tags Meta */}
                <NoteMeta noteId={noteId} note={note} />

                <input
                    type="text"
                    defaultValue={note?.title || ''}
                    onBlur={handleTitleChange} // Save title on blur to avoid too many requests
                    key={note?.id} // Force re-render input when note changes
                    className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 outline-none placeholder-slate-300 dark:placeholder-slate-700 mb-8 text-slate-900 dark:text-white"
                    placeholder="Note Title"
                />

                {/* <FormattingToolbar editor={editor} /> */}

                <div ref={editorContentRef}>
                    <EditorContent editor={editor} className="editor-content" />
                </div>

                <div className="fixed bottom-4 right-4 text-xs text-slate-400 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                    {isUploading ? 'Uploading image...' : updateNoteMutation.isPending ? 'Saving...' : 'Saved'}
                </div>
            </div>
        </div>
    );
}
