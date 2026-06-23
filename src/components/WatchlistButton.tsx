"use client";

import { useEffect, useState, useRef } from "react";
import {
  Bookmark,
  BookmarkPlus,
  CheckCircle,
  Heart,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { watchlistService } from "@/services/watchlist.service";
import { useAuthStore } from "@/stores/auth.store";
import type { WatchlistStatus } from "@/types";
import { createPortal } from "react-dom";

type Props = {
  movieId: number;
  className?: string;
};

const STATUS_CONFIG: Record<
  WatchlistStatus,
  { icon: typeof Bookmark; label: string }
> = {
  watchlist: { icon: Bookmark, label: "Want to Watch" },
  watched: { icon: CheckCircle, label: "Watched" },
  favorite: { icon: Heart, label: "Favorite" },
};

const ALL_STATUSES: WatchlistStatus[] = ["watchlist", "watched", "favorite"];

export default function WatchlistButton({ movieId, className = "" }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentStatus, setCurrentStatus] = useState<WatchlistStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  // Fetch current status on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setFetching(false);
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      try {
        const { items } = await watchlistService.getWatchlist();
        if (cancelled) return;
        const existing = items.find((item) => item.movieId === movieId);
        setCurrentStatus(existing?.status ?? null);
      } catch {
        // Silently ignore
      } finally {
        if (!cancelled) setFetching(false);
      }
    }

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, movieId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (status: WatchlistStatus) => {
    setLoading(true);
    try {
      await watchlistService.toggleStatus(movieId, status);
      setCurrentStatus(status);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to update watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await watchlistService.removeMovie(movieId);
      setCurrentStatus(null);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: 192,
        zIndex: 9999,
      });
    }

    setIsOpen((v) => !v);
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className={`inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800/80 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-yellow-500 hover:text-yellow-500 ${className}`}
      >
        <BookmarkPlus className="h-4 w-4" />
        Log in to add
      </Link>
    );
  }

  // Loading initial state
  if (fetching) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-500 ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </button>
    );
  }

  const activeConfig = currentStatus ? STATUS_CONFIG[currentStatus] : null;

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
          activeConfig
            ? "border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            : "border border-gray-600 bg-gray-800/80 text-gray-300 hover:border-yellow-500 hover:text-yellow-500"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : activeConfig ? (
          <activeConfig.icon className="h-4 w-4" />
        ) : (
          <BookmarkPlus className="h-4 w-4" />
        )}
        {activeConfig ? activeConfig.label : "Watchlist"}
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-xl"
            style={menuStyle}
          >
            {ALL_STATUSES.map((status) => {
              const config = STATUS_CONFIG[status];
              const isActive = currentStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <config.icon className="h-4 w-4" />
                  {config.label}
                </button>
              );
            })}

            {currentStatus && (
              <>
                <div className="my-1 border-t border-gray-700" />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-gray-800"
                >
                  Remove from list
                </button>
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
