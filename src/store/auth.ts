import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      initialized: false,
      async login(email, password) {
        set({ loading: true, error: null });
        try {
          const { user } = await authApi.login(email, password);
          set({ user, loading: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Login failed';
          set({ loading: false, error: msg });
          throw e;
        }
      },
      async logout() {
        try {
          await authApi.logout();
        } catch {
          // ignore network error during logout
        }
        set({ user: null });
      },
      async fetchMe() {
        set({ loading: true });
        try {
          const u = await authApi.me();
          set({ user: u, loading: false, initialized: true });
        } catch {
          set({ user: null, loading: false, initialized: true });
        }
      },
      clear() {
        set({ user: null, error: null });
      },
    }),
    { name: 'reshka-auth', partialize: (s) => ({ user: s.user }) },
  ),
);
