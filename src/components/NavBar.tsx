import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SearchMovies } from "@/services/movies.service";
import { Search, Menu, X } from "lucide-react";
import type { MovieType } from "@/types";
import SearchResult from "./SearchResult";
import "@/styles/navbar.css"

function NavBar() {
  // const navigate = useNavigate();
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieType[]>([]);

  const menuList = (
    <>
      <Link
        to="/movies"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Movies
      </Link>
      <Link
        to="/movies?sort_by=popular"
        className="text-gray-300 hover:text-yellow-500 transition"
      >
        Trending
      </Link>
      <Link
        to="/movies?sort_by=rated"
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
        const results = await SearchMovies(searchQuery);
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
                  <Link to="/">MovieScope</Link>
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
              
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default NavBar;
