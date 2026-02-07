import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NotesList from '../components/notes/NotesList';
import Editor from '../components/notes/Editor';

export default function NotesPage() {
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedNoteId) {
            setSelectedNoteId(location.state.selectedNoteId);
            // Optional: iterate state to clear it to avoid reopening on refresh, 
            // but standard behavior is fine for now.
        }
    }, [location.state]);

    return (
        <div className="flex h-full w-full">
            {/* Notes List Panel */}
            <div className={`
                w-full lg:w-80 border-r border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col
                ${selectedNoteId ? 'hidden lg:flex' : 'flex'}
            `}>
                <NotesList
                    onSelectNote={(id) => setSelectedNoteId(id)}
                    selectedNoteId={selectedNoteId}
                />
            </div>

            {/* Editor Panel */}
            <div className={`
                flex-1 h-full bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm
                ${!selectedNoteId ? 'hidden lg:block' : 'block'}
            `}>
                {selectedNoteId ? (
                    <div className="h-full relative flex flex-col">
                        <div className="lg:hidden p-2 border-b border-slate-200/50 dark:border-slate-800/50">
                            <button onClick={() => setSelectedNoteId(null)} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                ← Back to list
                            </button>
                        </div>
                        <Editor noteId={selectedNoteId} onNoteDeleted={() => setSelectedNoteId(null)} />
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <p className="text-lg font-medium">No note selected</p>
                            <p className="text-sm">Select a note from the list to view</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
