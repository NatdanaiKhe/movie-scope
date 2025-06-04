import { Link } from "react-router-dom";
import type { MovieType } from "../types";
import { getMoviePosterUrl } from "@/services/movies.service";

function SearchResult({
  results,
  setResults,
}: {
  results: MovieType[];
  setResults: (results: MovieType[]) => void;
}) {
  return (
    <ul className="absolute mt-1 left-0 right-0 bg-gray-800 text-white rounded shadow-lg z-50">
      {results.slice(0, 5).map(movie => (
        <li
          key={movie.id}
          className="px-4 py-2 hover:bg-gray-700 hover:text-yellow-400 cursor-pointer text-sm"
        >
          <div className="flex items-center space-x-2">
            <img
              src={getMoviePosterUrl(movie.poster_path || "")}
              alt={movie.title}
              className="w-10 h-15 rounded"
            />
            <Link
              to={`/movie/${movie.id}`}
              className="block"
              onClick={() => {
                setResults([]);
              }}
            >
              {movie.title}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SearchResult