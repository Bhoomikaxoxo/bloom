import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useKeyboardShortcuts() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only trigger if not typing in an input/textarea
            const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) ||
                document.activeElement?.getAttribute('contenteditable') === 'true';

            if (isTyping && !e.metaKey && !e.ctrlKey) return;

            // Cmd/Ctrl + K - Quick Search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                navigate('/search');
            }

            // Cmd/Ctrl + N - New Note
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                navigate('/notes');
                // Trigger new note creation (we'd need to expose this via a global state or event)
                const event = new CustomEvent('create-new-note');
                window.dispatchEvent(event);
            }

            // Cmd/Ctrl + T - Tasks
            if ((e.metaKey || e.ctrlKey) && e.key === 't') {
                e.preventDefault();
                navigate('/tasks');
            }

            // Cmd/Ctrl + / - Show shortcuts help
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                const event = new CustomEvent('show-shortcuts');
                window.dispatchEvent(event);
            }

            // Escape - Close modals/menus (handled by individual components)
            if (e.key === 'Escape') {
                const event = new CustomEvent('escape-pressed');
                window.dispatchEvent(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);
}
