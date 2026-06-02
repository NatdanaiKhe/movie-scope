import type { AuthUser } from "@/types";
import { create } from "zustand";

type AuthState = {
  user: AuthUser | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setBootstrapping: (isBootstrapping: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isBootstrapping: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isBootstrapping: false,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isBootstrapping: false,
    }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
}));
