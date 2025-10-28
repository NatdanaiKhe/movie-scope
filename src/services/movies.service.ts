import api from "@/lib/axios";
import type { VideoType } from "@/types";

// Movie Service - All API calls in one place
export const movieService = {
  // Get movie details by ID
  async getMovieDetails(movieId: number) {
    const response = await api.get(`/movies/${movieId}`);   
    console.log("getMovieDetails",response.data);
    return response.data;
  },

  // Get movie credits (cast & crew)
  async getMovieCredits(movieId: number) {
    const response = await api.get(`/movies/${movieId}/credits`);
    return response.data;
  },

  // Search movies by query
  async searchMovies(query: string) {
    const response = await api.get("/movies/search", {
      params: { query },
    });
    return response.data;
  },

  // Get all movies with filters
  async getAllMovies(
    page: number = 1,
    genre: string = "",
    sort: string = "popularity"
  ) {
    const params: { page: number; sort: string; genre: string } = {
      page,
      sort,
      genre,
    };
    if (genre && genre !== "") {
      params.genre = genre;
    }

    const response = await api.get("/movies/discover", { params });
    return response.data;
  },

  // Get popular movies
  async getPopularMovies() {
    const response = await api.get("/movies/popular");
    return response.data;
  },

  // Get top rated movies
  async getTopRatedMovies() {
    const response = await api.get("/movies/top-rated");
    return response.data;
  },

  // Get movie categories/genres
  async getCategories() {
    const response = await api.get("/genres");
    return response.data;
  },

  // Get movie trailer URL
  async getTrailerUrl(movieId: number): Promise<string | null> {
    const response = await api.get(`/movies/${movieId}/videos`);
    const trailer = response.data.results.find(
      (video: VideoType) => video.type === "Teaser" && video.site === "YouTube"
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  },
};

// Utility functions for image URLs (no API calls needed)
export const getMoviePosterUrl = (posterPath: string) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://placehold.co/500x750?text=No+Poster+Available";
};

export const getMovieBackdropUrl = (backdropPath: string) => {
  return backdropPath
    ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
    : "https://placehold.co/1280x720?text=No+Backdrop+Available";
};

export const getCastProfileUrl = (profilePath: string) => {
  return profilePath
    ? `https://image.tmdb.org/t/p/w185${profilePath}`
    : "https://placehold.co/185x278?text=No+Profile+Available";
};

export default movieService;
