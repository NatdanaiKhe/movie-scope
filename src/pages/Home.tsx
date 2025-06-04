// import MovieCard from "@/components/MovieCard"
import { useEffect, useState } from "react";
import { getPopularMovies,getTopRatedMovies  } from "@/services/movies.service";
import type { MovieType } from "@/types/";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import CategoryList from "@/components/CategoryList";
import Loader from "@/components/Loader";

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


        setFeaturedMovie(data.results[0]);
        setTrendingMovies(data.results.slice(1)); 
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
      <Loader/>
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
      <FeatureCard type="trending" movies={trendingMovies} />
      <FeatureCard type="top-rated" movies={topRatedMovies || []} />
      <CategoryList />
    </div>
  );
}

export default Home;
