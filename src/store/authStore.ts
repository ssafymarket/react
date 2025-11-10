import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: { id: 1, email: 'admin@ssafy.com', name: '관리자', role: 'ADMIN', createdAt: '', updatedAt: '' },
      token: 'test-token',
      isLoggedIn: true,

      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isLoggedIn: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isLoggedIn: false });
      },

      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
