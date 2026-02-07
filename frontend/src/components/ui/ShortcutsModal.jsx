import { useEffect, useState } from 'react';
import { X, Command, Search, FileText, CheckSquare, Keyboard } from 'lucide-react';

const shortcuts = [
    {
        category: 'Navigation',
        items: [
            { keys: ['⌘', 'K'], description: 'Quick search' },
            { keys: ['⌘', 'N'], description: 'New note' },
            { keys: ['⌘', 'T'], description: 'Go to tasks' },
            { keys: ['Esc'], description: 'Close dialogs' },
        ]
    },
    {
        category: 'Editor',
        items: [
            { keys: ['⌘', 'B'], description: 'Bold' },
            { keys: ['⌘', 'I'], description: 'Italic' },
            { keys: ['⌘', 'U'], description: 'Underline' },
            { keys: ['⌘', 'Shift', 'X'], description: 'Strikethrough' },
            { keys: ['⌘', 'Z'], description: 'Undo' },
            { keys: ['⌘', 'Shift', 'Z'], description: 'Redo' },
        ]
    },
    {
        category: 'Formatting',
        items: [
            { keys: ['⌘', 'Alt', '1'], description: 'Heading 1' },
            { keys: ['⌘', 'Alt', '2'], description: 'Heading 2' },
            { keys: ['⌘', 'Alt', '3'], description: 'Heading 3' },
            { keys: ['⌘', 'Shift', '7'], description: 'Ordered list' },
            { keys: ['⌘', 'Shift', '8'], description: 'Bullet list' },
            { keys: ['⌘', 'Shift', '9'], description: 'Task list' },
        ]
    },
    {
        category: 'General',
        items: [
            { keys: ['⌘', '/'], description: 'Show shortcuts' },
        ]
    }
];

export default function ShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleShow = () => setIsOpen(true);
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('show-shortcuts', handleShow);
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('show-shortcuts', handleShow);
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Keyboard className="text-indigo-600 dark:text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Master Bloom with these shortcuts</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {shortcuts.map((section) => (
                        <div key={section.category}>
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                {section.category}
                            </h3>
                            <div className="space-y-2">
                                {section.items.map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, i) => (
                                                <span key={i} className="flex items-center gap-1">
                                                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs font-mono text-slate-900 dark:text-slate-100 shadow-sm">
                                                        {key}
                                                    </kbd>
                                                    {i < shortcut.keys.length - 1 && (
                                                        <span className="text-slate-400 text-xs">+</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs font-mono">⌘ /</kbd> anytime to view shortcuts
                    </p>
                </div>
            </div>
        </div>
    );
}
