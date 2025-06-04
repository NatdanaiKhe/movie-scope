// import MovieCard from "@/components/MovieCard"
import { useEffect, useState } from "react";
import { getPopularMovies,getTopRatedMovies  } from "@/services/movies.service";
import type { MovieType } from "@/types/";
import { LoaderCircle } from "lucide-react";
import TrendingMovies from "@/components/TrendingMovies";
import HeroSection from "@/components/HeroSection";
import TopRatedMovies from "@/components/TopRatedMovies";

function Home() {
  const [featuredMovie, setFeaturedMovie] = useState<MovieType | null>(null);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieType[] | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<MovieType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getPopularMovies();
        if (!data || !data.results) {
          throw new Error("No results found");
        }
        console.log("Fetched movies:", data.results);

        setFeaturedMovie(data.results[0]);
        setTrendingMovies(data.results.slice(1, 5)); 
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    async function fetchTopRatedMovies() {
      try {
        const data = await getTopRatedMovies();
        if (!data || !data.results) {
          throw new Error("No top rated movies found");
        }
        console.log("Fetched top rated movies:", data.results);
        setTopRatedMovies(data.results);
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
      }
    }

    Promise.all([fetchMovies(), fetchTopRatedMovies()])
      .then(() => {
        console.log("All movies fetched successfully");
      })
      .catch((error) => {
        console.error("Error in fetching movies:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoaderCircle className="text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (!trendingMovies || trendingMovies.length === 0 || !featuredMovie) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-8 ">
      <HeroSection movie={featuredMovie} />
      <TrendingMovies movies={trendingMovies} />
      <TopRatedMovies movies={topRatedMovies} />
    </div>
  );
}

export default Home;
