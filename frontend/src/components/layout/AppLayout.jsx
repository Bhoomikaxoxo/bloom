import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Layout, FileText, CheckSquare, Hash, Folder,
    Settings, LogOut, Plus, Search, Menu, X,
    ChevronDown, ChevronRight, Star, Trash2, Moon, Sun, Keyboard
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { cn } from '../../lib/utils';
import FolderManager from '../ui/FolderManager';
import TagManager from '../ui/TagManager';
import ShortcutsModal from '../ui/ShortcutsModal';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

// Temporary mock data until we wire up APIs
const folders = [];
const tags = [];

export default function AppLayout() {
    const { user, logout } = useAuthStore();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Enable keyboard shortcuts
    useKeyboardShortcuts();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden glass-panel backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                glass-panel border-r border-slate-200/50 dark:border-slate-800/50
                flex flex-col
            `}>
                {/* User Profile Header */}
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
                    {/* Primary Nav */}
                    <div className="space-y-1">
                        <NavItem to="/notes" icon={<FileText size={18} />} label="All Notes" end />
                        <NavItem to="/tasks" icon={<CheckSquare size={18} />} label="Tasks" />
                        <NavItem to="/search" icon={<Search size={18} />} label="Search" />
                    </div>

                    {/* Filters */}
                    <div className="space-y-1">
                        <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Filters</div>
                        <NavItem to="/notes?filter=favorites" icon={<Star size={18} />} label="Favorites" />
                        <NavItem to="/trash" icon={<Trash2 size={18} />} label="Trash" />
                    </div>

                    {/* Folders */}
                    <FolderManager />

                    {/* Tags */}
                    <TagManager />
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                    <NavItem to="/shortcuts" icon={<Keyboard size={18} />} label="Shortcuts" />
                    <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-hidden relative flex flex-col">
                <div className="lg:hidden p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500">
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-lg">Bloom</span>
                </div>

                {/* Router Outlet for Page Content */}
                <div className="flex-1 overflow-hidden relative">
                    <Outlet />
                </div>
            </main>

            {/* Shortcuts Modal */}
            <ShortcutsModal />
        </div>
    );
}

function NavItem({ to, icon, label, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }
            `}
        >
            {icon}
            {label}
        </NavLink>
    );
}
