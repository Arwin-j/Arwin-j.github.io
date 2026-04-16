'use client';

import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  setAuth: (token: string, user: AuthState['user']) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  }
}));
