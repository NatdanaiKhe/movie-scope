import api from "@/lib/axios";
import type { CreateProfilePayload, ProfileResponse } from "@/types";

export const profileService = {
  async create(payload: CreateProfilePayload): Promise<ProfileResponse> {
    const response = await api.post<ProfileResponse>("/profiles", payload);
    return response.data;
  },

  async getByUserId(userId: string): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>(`/profiles/${userId}`);
    return response.data;
  },
};

export default profileService;
