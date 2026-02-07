import { Type, List, CheckSquare, ArrowLeft, Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { Link } from 'react-router-dom';

const formattingOptions = [
    {
        category: 'Text Formatting',
        icon: <Type size={20} className="text-purple-500" />,
        items: [
            { name: 'Bold text', example: <span className="font-bold">Bold text</span> },
            { name: 'Italic text', example: <span className="italic">Italic text</span> },
            { name: 'Underline text', example: <span className="underline">Underline text</span> },
            { name: 'Strikethrough text', example: <span className="line-through">Strikethrough text</span> },
        ]
    },
    {
        category: 'Headings',
        icon: <Type size={20} className="text-indigo-500" />,
        items: [
            { name: 'Heading 1', example: <h1 className="text-3xl font-bold">Large heading</h1> },
            { name: 'Heading 2', example: <h2 className="text-2xl font-bold">Medium heading</h2> },
            { name: 'Heading 3', example: <h3 className="text-xl font-bold">Small heading</h3> },
            { name: 'Body', example: <p className="text-base">Regular paragraph text</p> },
        ]
    },
    {
        category: 'Lists',
        icon: <List size={20} className="text-blue-500" />,
        items: [
            {
                name: 'Bulleted List',
                example: (
                    <ul className="list-disc list-inside space-y-1">
                        <li>First item</li>
                        <li>Second item</li>
                        <li>Third item</li>
                    </ul>
                )
            },
            {
                name: 'Numbered List',
                example: (
                    <ol className="list-decimal list-inside space-y-1">
                        <li>First item</li>
                        <li>Second item</li>
                        <li>Third item</li>
                    </ol>
                )
            },
        ]
    },
    {
        category: 'Task Lists',
        icon: <CheckSquare size={20} className="text-green-500" />,
        items: [
            {
                name: 'Task list',
                example: (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked readOnly className="rounded" />
                            <span className="line-through text-slate-500">Completed task</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" readOnly className="rounded" />
                            <span>Pending task</span>
                        </div>
                    </div>
                )
            },
        ]
    },
];

export default function ShortcutsPage() {
    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950">
            <div className="flex-1 max-w-4xl mx-auto p-6 lg:p-10 flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/notes"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Notes
                    </Link>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <Type className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Formatting Guide
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">
                                All the ways you can format your notes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formatting Options Grid */}
                <div className="grid gap-6 pb-8">
                    {formattingOptions.map((section) => (
                        <div
                            key={section.category}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                {section.icon}
                                {section.category}
                            </h2>
                            <div className="space-y-4">
                                {section.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                            {item.name}
                                        </div>
                                        <div className="text-slate-900 dark:text-slate-100">
                                            {item.example}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Features */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        More Features
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <li className="flex gap-2">
                            <span className="text-indigo-500">•</span>
                            <span><strong>Images:</strong> Drag & drop, paste, or click the 📷 button to add images</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-500">•</span>
                            <span><strong>Code blocks:</strong> Perfect for snippets and technical notes</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span><strong>Block quotes:</strong> Highlight important information</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-500">•</span>
                            <span><strong>Auto-save:</strong> Your notes save automatically every second</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong>Export:</strong> Download as Markdown (.md) or PDF</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
