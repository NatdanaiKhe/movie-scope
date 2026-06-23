"use client";

import { useEffect, useState, useCallback } from "react";
import type { MovieType, WatchlistItem } from "@/types";
import { watchlistService } from "@/services/watchlist.service";
import { movieService } from "@/services/movies.service";
import { useAuthStore } from "@/stores/auth.store";
import Loader from "@/components/Loader";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";
import { X } from "lucide-react";

type TabKey = "watchlist" | "watched" | "favorite";

const TABS: { key: TabKey; label: string }[] = [
  { key: "watchlist", label: "Want to Watch" },
  { key: "watched", label: "Watched" },
  { key: "favorite", label: "Favorites" },
];

type MovieWithStatus = {
  movie: MovieType;
  watchlistItem: WatchlistItem;
};

export default function WatchlistPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  const [movies, setMovies] = useState<MovieWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("watchlist");
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { items } = await watchlistService.getWatchlist();

      if (items.length === 0) {
        setMovies([]);
        return;
      }

      const movieDetails = await Promise.all(
        items.map(async (item): Promise<MovieWithStatus> => {
          const movie = (await movieService.getMovieDetails(
            item.movieId,
          )) as MovieType;
          return { movie, watchlistItem: item };
        }),
      );

      setMovies(movieDetails);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    }
  }, [isAuthenticated, fetchWatchlist]);

  const handleRemove = async (movieId: number) => {
    try {
      await watchlistService.removeMovie(movieId);
      setMovies((prev) =>
        prev.filter((m) => m.watchlistItem.movieId !== movieId),
      );
    } catch (err) {
      console.error("Error removing movie:", err);
    }
  };

  const counts = {
    watchlist: movies.filter((m) => m.watchlistItem.status === "watchlist")
      .length,
    watched: movies.filter((m) => m.watchlistItem.status === "watched").length,
    favorite: movies.filter((m) => m.watchlistItem.status === "favorite")
      .length,
  };

  const filteredMovies = movies.filter(
    (m) => m.watchlistItem.status === activeTab,
  );

  if (isBootstrapping) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900">
        <p className="text-gray-400 text-lg mb-4">
          You need to be logged in to view your watchlist.
        </p>
        <Link
          href="/login"
          className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen flex justify-start flex-col bg-gray-900">
      <div className="w-full flex-auto px-10 mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-yellow-400">
          My Watchlist
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
                activeTab === tab.key
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-800 px-2 py-0.5 rounded-full">
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchWatchlist}
              className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No movies in this list yet</p>
          </div>
        )}

        {/* Movie grid */}
        {!error && filteredMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMovies.map(({ movie, watchlistItem }) => (
              <div key={watchlistItem.id} className="relative group">
                <MovieCard movie={movie} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(movie.id);
                  }}
                  className="absolute top-2 right-2 z-20 p-1.5 bg-black/70 rounded-full text-gray-400 hover:text-red-400 hover:bg-black/90 transition opacity-0 group-hover:opacity-100"
                  title="Remove from watchlist"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
