"use client";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        const data = await authService.me();
        if (isMounted) {
          setUser(data.user);
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
