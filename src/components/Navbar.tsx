"use client";

import { useEffect, useState } from "react";
import { movieService } from "@/services/movies.service";
import { ChevronDown, Search, Menu, X, Bookmark } from "lucide-react";
import type { MovieType } from "@/types/index";
import SearchResult from "./SearchResult";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieType[]>([]);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearUser = useAuthStore((state) => state.clearUser);
  const displayName = profile?.displayName ?? user?.name;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      clearUser();
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  };

  const authMenu = isAuthenticated && user && displayName ? (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsUserMenuOpen((value) => !value)}
        className="flex items-center gap-1 rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:text-yellow-500"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="menu"
      >
        {displayName}
        <ChevronDown
          className={`h-4 w-4 transition ${isUserMenuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isUserMenuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-44 rounded-lg border border-gray-800 bg-gray-950 py-2 shadow-lg"
        >
          <Link
            href="/watchlist"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-yellow-500"
            role="menuitem"
            onClick={() => setIsUserMenuOpen(false)}
          >
            <Bookmark className="h-4 w-4" />
            My Watchlist
          </Link>
          <div className="my-1 border-t border-gray-800" />
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-900 hover:text-yellow-500"
            role="menuitem"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  ) : (
    <>
      <Link
        href="/login"
        className="text-sm font-semibold text-gray-300 transition hover:text-yellow-500"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-600"
      >
        Sign up
      </Link>
    </>
  );

  const mobileAuthMenu = isAuthenticated && user && displayName ? (
    <>
      <Link
        href="/watchlist"
        className="flex items-center gap-2 text-gray-300 transition hover:text-yellow-500"
      >
        <Bookmark className="h-4 w-4" />
        My Watchlist
      </Link>
      <button
        type="button"
        onClick={() => setIsUserMenuOpen((value) => !value)}
        className="flex items-center justify-between text-left text-gray-300 transition hover:text-yellow-500"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="menu"
      >
        {displayName}
        <ChevronDown
          className={`h-4 w-4 transition ${isUserMenuOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isUserMenuOpen && (
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-gray-800 px-4 py-2 text-left text-gray-300 transition hover:text-yellow-500"
        >
          Log out
        </button>
      )}
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Sign up
      </Link>
    </>
  );

  const menuList = (
    <>
      <Link
        href="/movies"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Movies
      </Link>
      <Link
        href="/movies?sort_by=popular"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Trending
      </Link>
      <Link
        href="/movies?sort_by=rated"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Top Rated
      </Link>
    </>
  );

  // Even handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === "") return;
      try {
        const results = await movieService.searchMovies(searchQuery);
        setSearchResults(results.results || []);
        console.log("Search results:", results.results.slice(0, 5));
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    };

    const debounceTimeout = setTimeout(handleSearch, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-4 md:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-yellow-500 ml-1">
                  <Link href="/">MovieScope</Link>
                </span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {menuList}
            </nav>
          </div>

          {/* Desktop Search and User */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative text-white">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-40 lg:w-64 bg-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <SearchResult
                results={searchResults}
                setResults={setSearchResults}
              />
            </div>
            {/* <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition cursor-pointer">
              <User className="h-5 w-5 text-gray-300" />
            </button> */}
            {authMenu}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-800 transition"
            >
              <Search className="h-5 w-5 text-gray-300" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-800 transition"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-800">
            <div className="relative text-white">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <SearchResult
                results={searchResults}
                setResults={setSearchResults}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              {menuList}
              {mobileAuthMenu}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default NavBar;
