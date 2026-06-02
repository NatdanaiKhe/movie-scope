'use client'

import type { MovieType } from "@/types/index";
import { getMoviePosterUrl } from "@/services/movies.service";
import { Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";

function MovieCard({movie, className}: Readonly<{movie: MovieType, className?:string}>) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      className={clsx(
        "w-full aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg cursor-pointer",
        className,
      )}
      onClick={() => {
        router.push(`/movies/${movie.id}`);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-700"></div>
      )}
      <Image
        src={getMoviePosterUrl(movie.poster_path || "")}
        alt={movie.title}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        width={500}
        height={500}
      />

      {/* detail */}
      <div
        className={
          "absolute w-full left-0 bottom-0 p-4 md:p-10 z-10 rounded-lg bg-gradient-to-t from-black/100 to-transparent" +
          (isHovered ? " block" : " hidden")
        }
      >
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
