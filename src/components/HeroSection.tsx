import { getTrailerUrl,getMovieBackdropUrl } from "@/services/movies.service";
import type { MovieType } from "@/types"
import { PlayIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function HeroSection({movie}: {movie: MovieType }) {
  const [movieTrailer, setMovieTrailer] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const trailerUrl = await getTrailerUrl(movie.id);
        if (trailerUrl) {
          setMovieTrailer(trailerUrl);
          console.log("Trailer URL:", trailerUrl);
        } else {
          console.log("No trailer found for this movie.");
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    }
    fetchTrailer();
  }, [movie.id]);
  return (
    <div className="w-full h-[500px] flex justify-center items-center md:px-10">
      <div
        className="w-full h-full bg-cover bg-center md:rounded-lg shadow-lg relative"
        style={{
          backgroundImage: `url(${getMovieBackdropUrl(movie.backdrop_path)})`,
          
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:rounded-lg"></div>

        {/* Content */}
        <div className="absolute w-full md:w-xl left-0 bottom-0 p-4 md:p-10 z-10">
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
            {movie.overview.length > 200
              ? `${movie.overview.substring(0, 200)}...`
              : movie.overview}
          </p>

          <button className=" mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold cursor-pointer rounded-4xl hover:bg-yellow-600 transition">
            <PlayIcon className="inline mr-2" />
            <Link to={movieTrailer??'#'} target="_blank" className="text-black">
              Watch Trailer
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection