import type { MovieType } from "@/types";
import { Flame, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

function FeatureCard({ movies, type }: { movies: MovieType[]; type: string }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-lg text-yellow-400">No trending movies found</p>
      </div>
    );
  }

  const Header = (
    <>
      {type === "top-rated" ? (
        <span className="text-2xl font-bold">
          <Flame className="inline mr-2 text-2xl font-bold" />
          Top Rated Movies
        </span>
      ) : (
        <span className="text-2xl font-bold">
          <TrendingUp className="inline mr-2 text-2xl font-bold" />
          Trending Movies
        </span>
      )}
    </>
  );

  return (
    <div className="w-full h-full no-scrollbar flex flex-col items-start justify-start text-yellow-400 p-4 md:px-10">
      <div className="w-full flex justify-between items-center">
        {Header}
        <span className="text-lg ml-2 text-gray-300 hover:text-yellow-400 hover:underline transition">
          <Link
            to={`/movies?sort_by=${
              type === "trending" ? "popularity" : "rated"
            }`}
          >
            View All
          </Link>
        </span>
      </div>

      {/* Scrollable movie list */}
      <div className="w-full overflow-x-auto mt-4 custom-scrollbar ">
        <div className="flex gap-4">
          {movies &&
            movies.map(movie => (
              <div
                key={movie.id}
                className="min-w-[calc(100%/1)] sm:min-w-[calc(100%/2)] md:min-w-[calc(100%/3)] lg:min-w-[calc(100%/4)]"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
