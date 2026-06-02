import type { AuthUser, Profile } from "@/types";
import { create } from "zustand";

type AuthState = {
  user: AuthUser | null;
  profile: Profile | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser, profile?: Profile | null) => void;
  clearUser: () => void;
  setBootstrapping: (isBootstrapping: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isBootstrapping: true,
  isAuthenticated: false,
  setUser: (user, profile = user.profile ?? null) =>
    set({
      user: {
        ...user,
        profile,
      },
      profile,
      isAuthenticated: true,
      isBootstrapping: false,
    }),
  clearUser: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isBootstrapping: false,
    }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
}));
