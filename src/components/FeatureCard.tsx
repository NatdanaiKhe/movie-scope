import type { MovieType } from "@/types";
import { Flame, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";

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
      <Swiper
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
        onReachEnd={() => {}}
        navigation
        scrollbar={{ draggable: true }}
        className="w-full flex flex-row overflow-x-auto mt-4"
      >
        {movies &&
          movies.map(movie => (
            <SwiperSlide key={movie.id}>
              <MovieCard key={movie.id} movie={movie} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default FeatureCard;
