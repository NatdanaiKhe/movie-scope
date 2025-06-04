import { Flame } from "lucide-react";
import type { MovieType } from "@/types";
import MovieCard from "./MovieCard";

function TopRatedMovies({ movies }: { movies: MovieType[] | null }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-lg text-yellow-400">No trending movies found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start text-yellow-400 md:px-10">
      <div className="w-full flex justify-between items-center ">
        <span className="text-2xl font-bold">
          <Flame className="inline mr-2 text-2xl font-bold" />
          Top Rated Movies
        </span>

        <span className="text-lg ml-2 text-gray-300 hover:text-yellow-400 hover:underline transition">
          <a href="/trending">View All</a>
        </span>
      </div>
      <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {movies &&
          movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
}

export default TopRatedMovies