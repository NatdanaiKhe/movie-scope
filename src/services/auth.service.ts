import api from "@/lib/axios";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

type RawAuthResponse =
  | AuthResponse
  | {
      id: string;
      email: string;
      name?: string;
    };

function normalizeAuthResponse(data: RawAuthResponse): AuthResponse {
  if ("user" in data) {
    return data;
  }

  return {
    user: {
      id: data.id,
      email: data.email,
      name: data.name ?? getFallbackName(data.email),
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
    const response = await api.post<RawAuthResponse>("/auth/me");
    return normalizeAuthResponse(response.data);
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};

export default authService;
