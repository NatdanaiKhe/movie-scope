import api from "@/lib/axios";
import type { WatchlistItem, WatchlistTogglePayload, WatchlistResponse, WatchlistStatus } from "@/types";

export const watchlistService = {
  async getWatchlist(): Promise<WatchlistResponse> {
    const response = await api.get<WatchlistResponse>("/watchlist");
    return response.data;
  },

  async toggleStatus(
    movieId: number,
    status: WatchlistStatus,
  ): Promise<{ item: WatchlistItem }> {
    const payload: WatchlistTogglePayload = { movieId, status };
    const response = await api.post<{ item: WatchlistItem }>(
      "/watchlist",
      payload,
    );
    return response.data;
  },

  async removeMovie(movieId: number): Promise<void> {
    await api.delete("/watchlist", { params: { movieId } });
  },
};

export default watchlistService;
