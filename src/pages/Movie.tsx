import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieCredits, getMovieDetails } from "@/services/movies.service";
import type { MovieDetailsType, MovieCreditsType } from "@/types";
import { getMovieBackdropUrl } from "@/services/movies.service";
import {
  Calendar,
  Clapperboard,
  PlayIcon,
  Star,
  WalletMinimal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getTrailerUrl } from "@/services/movies.service";
import CastCard from "@/components/CastCard";
import Loader from "@/components/Loader";

function Movie() {
  const { movieId } = useParams<{ movieId: string }>();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [credits, setCredits] = useState<MovieCreditsType | null>(null);
  const [movieTrailer, setMovieTrailer] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      console.error("No movie ID provided in URL");
      return;
    }
    const fetchMovieDetails = async () => {
      try {
        const id = parseInt(movieId, 10);
        if (isNaN(id)) {
          throw new Error("Invalid movie ID");
        }
        const movieDetails = await getMovieDetails(id);
        if (!movieDetails) {
          throw new Error("No movie details found");
        }
        setMovie(movieDetails);
        const movieTrailer = await getTrailerUrl(id);
        if (movieTrailer) {
          setMovieTrailer(movieTrailer);
          console.log("Trailer URL:", movieTrailer);
        } else {
          console.log("No trailer found for this movie.");
        }
        console.log("Movie details:", movieDetails);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchCredits = async () => {
      try {
        const id = parseInt(movieId, 10);
        if (isNaN(id)) {
          throw new Error("Invalid movie ID");
        }
        const creditsData = await getMovieCredits(id);

        if (!creditsData) {
          throw new Error("No movie credits found");
        }
        setCredits(creditsData);
        console.log("Movie credits:", creditsData);
      } catch (error) {
        console.error("Error fetching movie credits:", error);
      }
    };

    Promise.all([fetchMovieDetails(), fetchCredits()])
      .then(() => {
        setLoading(false);
      })
      .catch(error => {
        console.error("Error in fetching movie data:", error);
      });
  }, [movieId]);

  if (loading) {
    return <Loader />;
  }

  if (!movie || !movie.id || credits === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center md:px-10">
      <div
        className="w-full h-[500px] md:h-auto md:aspect-video  bg-cover bg-center md:rounded-lg shadow-lg relative"
        style={{
          backgroundImage: `url(${getMovieBackdropUrl(movie.backdrop_path)})`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:rounded-lg"></div>

        {/* Content */}
        <div className="absolute w-full md:w-xl left-0 bottom-10 p-4 md:p-10 z-10">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
          <div className="flex items-center text-gray-300 font-semibold  gap-2 mt-2">
            <Star className="text-yellow-400" />
            <span className="text-lg text-white font-bold">
              {Number(movie.vote_average).toFixed(1)}
            </span>
            <span className="text-lg ml-2">|</span>
            <span className="text-lg ml-2">{movie.runtime} min</span>
            <span className="text-lg ml-2">|</span>
            <span className="text-lg ml-2">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          <div className="text-lg text-gray-300 mt-2">
            {movie.tagline && <em>"{movie.tagline}"</em>}
          </div>
          <div className="text-lg text-white mt-4">
            {movie.genres.map((genre, _index) => (
              <span key={genre.id}>
                {genre.name}
                {_index + 1 === movie.genres.length ? "" : ", "}
              </span>
            ))}
          </div>
          <button className=" mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold cursor-pointer rounded-4xl hover:bg-yellow-600 transition">
            <PlayIcon className="inline mr-2" />
            <Link
              to={movieTrailer ?? "#"}
              target="_blank"
              className="text-black"
            >
              Watch Trailer
            </Link>
          </button>
        </div>
      </div>

      {/* overview */}
      <div className="w-full p-4 md:p-10">
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <p className="text-lg text-gray-300">{movie.overview}</p>
      </div>

      {/* detail */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-10">
        <div className=" bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-start items-center">
            <Calendar className="inline mr-2 text-2xl font-bold text-yellow-400 " />
            <h3 className="inline text-xl font-bold text-white">
              Release Date
            </h3>
          </div>

          <h3 className="ml-2 text-lg text-gray-300 mt-4">
            {new Date(movie.release_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        <div className=" bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-start items-center">
            <Clapperboard className="inline mr-2 text-2xl font-bold text-yellow-400 " />
            <h3 className="inline text-xl font-bold text-white">Director</h3>
          </div>

          <h3 className="ml-2 text-lg text-gray-300 mt-4">
            {credits.crew.find(member => member.job === "Director")?.name ||
              "Unknown"}
          </h3>
        </div>

        <div className=" bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-start items-center">
            <WalletMinimal className="inline mr-2 text-2xl font-bold text-yellow-400 " />
            <h3 className="inline text-xl font-bold text-white">Revenue</h3>
          </div>

          <h3 className="ml-2 text-lg text-gray-300 mt-4">
            {movie.revenue
              ? `$${movie.revenue.toLocaleString()}`
              : "Not available"}
          </h3>
        </div>
      </div>

      {/* Cast */}
      <div className="w-full p-4 md:p-10">
        <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credits.cast.length == 0 && <h1 className="text-white">No data</h1>}
          {credits.cast.slice(0, 5).map(castMember => (
            <CastCard
              key={castMember.cast_id}
              cast={{
                id: castMember.cast_id,
                name: castMember.name,
                character: castMember.character,
                profile_path: castMember.profile_path,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full p-4 md:p-10">
        <h2 className="text-2xl font-bold text-white mb-4">Featured Crew</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credits.crew.length == 0 && <h1 className="text-white">No data</h1>}
          {credits.crew.slice(0, 5).map(crewMember => (
            <CastCard
              key={crewMember.id}
              cast={{
                id: crewMember.id,
                name: crewMember.name,
                character: crewMember.job,
                profile_path: crewMember.profile_path,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Movie;
