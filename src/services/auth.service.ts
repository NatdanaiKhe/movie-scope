import api from "@/lib/axios";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

type RawAuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  id?: string;
  email?: string;
  name?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
};

function normalizeAuthResponse(data: RawAuthResponse): AuthResponse {
  if (data.user) {
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name ?? getFallbackName(data.user.email),
      },
    };
  }

  return {
    user: {
      id: data.id ?? "",
      email: data.email ?? "",
      name: data.name ?? getFallbackName(data.email ?? ""),
    },
  };
}

function getFallbackName(email: string) {
  return email.split("@")[0] || "User";
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<RawAuthResponse>("/auth/login", payload);
    return normalizeAuthResponse(response.data);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<RawAuthResponse>("/auth/register", payload);
    return normalizeAuthResponse(response.data);
  },

  async me(): Promise<AuthResponse> {
    const response = await api.get<RawAuthResponse>("/auth/me");
    return normalizeAuthResponse(response.data);
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};

export default authService;
