import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Lock, Bell, Trash2, Download, Save, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import api from '../lib/axios';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('account');
    const [saveStatus, setSaveStatus] = useState('');

    // Account settings
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [taskReminders, setTaskReminders] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);

    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.put('/auth/profile', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.put('/auth/password', data);
            return res.data;
        },
        onSuccess: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSaveStatus('password-changed');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfileMutation.mutate({ name, email });
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        changePasswordMutation.mutate({ currentPassword, newPassword });
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'data', label: 'Data & Privacy', icon: Download },
    ];

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950">
            <div className="flex-1 max-w-5xl mx-auto p-6 lg:p-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="flex gap-8 flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 flex-shrink-0">
                        <div className="space-y-1 sticky top-0">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Information</h2>
                                        <form onSubmit={handleSaveProfile} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={updateProfileMutation.isPending}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <Save size={16} />
                                                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            {saveStatus === 'saved' && (
                                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                                    <CheckCircle size={16} /> Changes saved successfully
                                                </p>
                                            )}
                                        </form>
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Theme</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            Choose your preferred color scheme
                                        </p>
                                        <button
                                            onClick={toggleTheme}
                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
                                        >
                                            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Change Password</h2>
                                        <form onSubmit={handleChangePassword} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={changePasswordMutation.isPending}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                                            </button>
                                            {saveStatus === 'password-changed' && (
                                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                                    <CheckCircle size={16} /> Password changed successfully
                                                </p>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Notification Preferences</h2>
                                        <div className="space-y-4">
                                            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive email updates about your notes</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={emailNotifications}
                                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">Task Reminders</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when tasks are due</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={taskReminders}
                                                    onChange={(e) => setTaskReminders(e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">Weekly Digest</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Get a weekly summary of your activity</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={weeklyDigest}
                                                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Data & Privacy Tab */}
                            {activeTab === 'data' && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Export Your Data</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            Download all your notes and tasks in various formats
                                        </p>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Download size={20} className="text-indigo-600 dark:text-indigo-400" />
                                                    <div className="text-left">
                                                        <p className="font-medium text-slate-900 dark:text-white">Export as Markdown</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">Download all notes as .md files</p>
                                                    </div>
                                                </div>
                                            </button>
                                            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <div className="flex-items-center gap-3">
                                                    <Download size={20} className="text-indigo-600 dark:text-indigo-400" />
                                                    <div className="text-left">
                                                        <p className="font-medium text-slate-900 dark:text-white">Export as JSON</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">Download complete database backup</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            Irreversible actions
                                        </p>
                                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                            <Trash2 size={16} />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
