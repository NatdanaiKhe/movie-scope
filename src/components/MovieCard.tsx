import type { MovieType } from "@/types/";
import { getMoviePosterUrl } from "@/services/movies.service";
import { Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({movie}: {movie: MovieType}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="w-full h-full relative shadow-lg cursor-pointer"
    onClick={() => {
      navigate(`/movie/${movie.id}`, {
        state: { movie },
      });
    }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave} 
    >
      <img
        src={getMoviePosterUrl(movie.poster_path || "")}
        alt="Movie Poster"
        className="aspect-[2/3] object-cover rounded-t-lg"
      />

      {/* detail */}
      <div className={'absolute w-full left-0 bottom-0 p-4 md:p-10 z-10 bg-gradient-to-t from-black/100 to-transparent' + (isHovered ? ' block' : ' hidden')}>
        <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Star className="text-yellow-400" />
          <span className="text-lg text-white font-bold">
            {Number(movie.vote_average).toFixed(1)}
          </span>
          <span className="text-lg text-gray-300 font-semibold ml-2">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>

        <p className="text-lg text-white">
          {movie.overview.length > 50
            ? `${movie.overview.substring(0, 50)}...`
            : movie.overview}
        </p>

        {/* <button className=" mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold cursor-pointer rounded-4xl hover:bg-yellow-600 transition">
          <PlayIcon className="inline mr-2" />
          Watch Now
        </button> */}
      </div>
    </div>
  );
}

export default MovieCard