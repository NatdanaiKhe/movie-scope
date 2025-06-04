import { useEffect, useState } from "react";
import type { MovieType } from "../types";
import { getAllMovies } from "@/services/movies.service";
import { useSearchParams } from "react-router-dom";
import Loader from "@/components/Loader";
import MovieCard from "@/components/MovieCard";

function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  console.log("Page parameter:", page);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const visiblePages = 5;
  let startPage = Math.max(page - Math.floor(visiblePages / 2), 1);

  // Ensure we always show `visiblePages` if possible
  if (startPage + visiblePages - 1 > totalPages) {
    startPage = Math.max(totalPages - visiblePages + 1, 1);
  }

  // event handler for
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return; // Prevent going to a negative page
    setSearchParams({ page: newPage.toString() });
  };

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getAllMovies(page);
        if (!data || !data.results) {
          throw new Error("No results found");
        }
        setTotalPages(data.total_pages);
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [searchParams,page]);

  if (loading) {
    return <Loader />;
  }

  if (movies.length === 0 && !loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-gray-500">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full flex-auto max-w-6xl p-4">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold mb-4 text-yellow-400">Movies</h1>
          <p className="text-gray-500 mb-4">
            Showing page {page} of {totalPages}
          </p>
        </div>
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>

      {/* pagination */}
      <nav aria-label="Page navigation">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <a
              onClick={() => handlePageChange(page - 1)}
              className="flex items-center justify-center px-3 h-8 cursor-pointer ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </a>
          </li>
          {Array.from({ length: visiblePages }, (_, index) => {
            const pageNumber = startPage + index;
            return (
              <li key={pageNumber}>
                <a
                  onClick={() => handlePageChange(pageNumber)}
                  className={`flex items-center justify-center px-3 h-8 cursor-pointer leading-tight ${
                    pageNumber === page
                      ? "text-yellow-400 bg-gray-900"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  {pageNumber}
                </a>
              </li>
            );
          })}
          <li>
            <a
              onClick={() => handlePageChange(page + 1)}
              className="flex items-center justify-center px-3 h-8 cursor-pointer leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Movies;
