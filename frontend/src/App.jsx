import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useThemeStore from './store/useThemeStore';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import SearchPage from './pages/SearchPage';
import TrashPage from './pages/TrashPage';
import SettingsPage from './pages/SettingsPage';
import ShortcutsPage from './pages/ShortcutsPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    const initTheme = useThemeStore((state) => state.initTheme);

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/notes" element={<NotesPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/trash" element={<TrashPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/shortcuts" element={<ShortcutsPage />} />
                    </Route>
                    <Route path="/" element={<Navigate to="/notes" replace />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
