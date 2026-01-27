import { LogOut, Moon, Sun } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import Button from '../components/ui/Button';

export default function NotesPage() {
    const logout = useAuthStore((state) => state.logout);
    const { theme, toggleTheme } = useThemeStore();

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="glass-panel rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Slate
                        </h1>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleTheme}
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        Welcome to Slate! 🎉
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                        The backend is fully functional. The Notes editor, Tasks page, and remaining UI components will be implemented next.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
                        Authentication is working! Try toggling dark mode or logging out.
                    </p>
                </div>
            </div>
        </div>
    );
}
