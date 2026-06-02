"use client";

import type { MovieType } from "@/types/index";
import { Flame, TrendingUp } from "lucide-react";
import MovieCard from "./MovieCard";
import { Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

function FeatureCard({
  movies,
  type,
}: Readonly<{ movies: MovieType[]; type: string }>) {
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
    <div className="w-full no-scrollbar flex flex-col items-start justify-start text-yellow-400 p-4 md:px-10">
      <div className="w-full flex justify-between items-center">
        {Header}
        <span className="text-lg ml-2 text-gray-300 hover:text-yellow-400 hover:underline transition">
          <Link
            href={`/movies?sort_by=${
              type === "trending" ? "popularity" : "rated"
            }`}
          >
            View All
          </Link>
        </span>
      </div>

      {/* Scrollable movie list */}
      <div className="w-full mt-4">
        <Swiper
          className="w-full !h-auto"
          modules={[Navigation, Scrollbar]}
          spaceBetween={50}
          slidesPerView={4}
          breakpoints={{
            1440: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 2,
            },
            320: {
              slidesPerView: 1,
            },
          }}
          navigation
          scrollbar={{ draggable: true }}
        >
          {movies?.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default FeatureCard;
