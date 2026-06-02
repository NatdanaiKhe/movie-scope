"use client";

import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthUser, Profile } from "@/types";
import { useEffect } from "react";

async function loadProfile(user: AuthUser): Promise<Profile | null> {
  try {
    const { profile } = await profileService.getByUserId(user.id);
    return profile;
  } catch {
    try {
      const { profile } = await profileService.create({
        userId: user.id,
        displayName: user.name,
      });
      return profile;
    } catch (error) {
      console.error("Profile load failed during auth bootstrap:", error);
      return null;
    }
  }
}

function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        const data = await authService.me();
        const profile = await loadProfile(data.user);
        if (isMounted) {
          setUser(data.user, profile);
        }
      } catch {
        if (isMounted) {
          clearUser();
        }
      } finally {
        if (isMounted) {
          setBootstrapping(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [clearUser, setBootstrapping, setUser]);

  return <>{children}</>;
}

export default AuthProvider;
