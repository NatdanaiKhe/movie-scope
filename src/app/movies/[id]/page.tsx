import Link from "next/link";
import { notFound } from "next/navigation";
import { movieService, getMovieBackdropUrl } from "@/services/movies.service";
import type { MovieCreditsType, Genre } from "@/types";
import {
  Calendar,
  Clapperboard,
  PlayIcon,
  Star,
  WalletMinimal,
} from "lucide-react";
import CastCard from "@/components/CastCard";
import Loader from "@/components/Loader";

type PageProps = {
  params: { id: string };
};

export default async function MoviePage({ params }: PageProps) {
  const { id: paramId } = await params;
  console.log("params", paramId);

  const id = Number(paramId);
  console.log("id", id);

  if (!Number.isFinite(id)) notFound();

  const [movie, credits, movieTrailer] = await Promise.all([
    movieService.getMovieDetails(id).catch(() => null),
    movieService.getMovieCredits(id).catch(() => null),
    movieService.getTrailerUrl(id).catch(() => null),
  ]);

  if (!id) {
    notFound();
  }

  if (!movie) {
    return <Loader />;
  }

  const safeCredits: MovieCreditsType = credits ?? { cast: [], crew: [] };

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center md:px-10">
      {/* Backdrop */}
      <div
        className="w-full h-[500px] md:h-auto md:aspect-video bg-cover bg-center md:rounded-lg shadow-lg relative"
        style={{
          backgroundImage: `url(${getMovieBackdropUrl(movie.backdrop_path)})`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent md:rounded-lg" />

        {/* Content */}
        <div className="absolute w-full md:w-xl left-0 bottom-10 p-4 md:p-10 z-10">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1>

          <div className="flex items-center text-gray-300 font-semibold gap-2 mt-2">
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
            {movie.tagline && <em>&quot;{movie.tagline}&quot;</em>}
          </div>

          <div className="text-lg text-white mt-4">
            {movie.genres.map((genre: Genre, idx: number) => (
              <span key={genre.id}>
                {genre.name}
                {idx + 1 === movie.genres.length ? "" : ", "}
              </span>
            ))}
          </div>

          {movieTrailer && (
            <Link
              href={movieTrailer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-4xl hover:bg-yellow-600 transition"
            >
              <PlayIcon className="inline mr-2" />
              Watch Trailer
            </Link>
          )}
        </div>
      </div>

      {/* Overview */}
      <div className="w-full p-4 md:p-10">
        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
        <p className="text-lg text-gray-300">{movie.overview}</p>
      </div>

      {/* Detail */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-10">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-start items-center">
            <Calendar className="inline mr-2 text-2xl font-bold text-yellow-400" />
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

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-start items-center">
            <Clapperboard className="inline mr-2 text-2xl font-bold text-yellow-400" />
            <h3 className="inline text-xl font-bold text-white">Director</h3>
          </div>
          <h3 className="ml-2 text-lg text-gray-300 mt-4">
            {safeCredits.crew.find((m) => m.job === "Director")?.name ??
              "Unknown"}
          </h3>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-start items-center">
            <WalletMinimal className="inline mr-2 text-2xl font-bold text-yellow-400" />
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
          {safeCredits.cast.length === 0 && (
            <h1 className="text-white">No data</h1>
          )}
          {safeCredits.cast.slice(0, 5).map((c) => (
            <CastCard
              key={c.cast_id}
              cast={{
                id: c.cast_id,
                name: c.name,
                character: c.character,
                profile_path: c.profile_path,
              }}
            />
          ))}
        </div>
      </div>

      {/* Crew */}
      <div className="w-full p-4 md:p-10">
        <h2 className="text-2xl font-bold text-white mb-4">Featured Crew</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeCredits.crew.length === 0 && (
            <h1 className="text-white">No data</h1>
          )}
          {safeCredits.crew.slice(0, 5).map((m) => (
            <CastCard
              key={m.id}
              cast={{
                id: m.id,
                name: m.name,
                character: m.job,
                profile_path: m.profile_path,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
