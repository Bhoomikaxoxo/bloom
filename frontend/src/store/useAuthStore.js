import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),

    setUser: (user) => set({ user, isAuthenticated: true }),

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
