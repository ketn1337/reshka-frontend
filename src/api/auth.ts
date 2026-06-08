import { request } from './client';
import type { User } from './types';

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
  me: () => request<User>('/api/auth/me'),
};
