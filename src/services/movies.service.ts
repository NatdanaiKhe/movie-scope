import type { VideoType } from "../types/";

const apiBase = import.meta.env.VITE_TMDB_API_URL; 

export async function getMovieDetails(movieId: number) {
  const res = await fetch(`${apiBase}/movies/${movieId}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function getMovieCredits(movieId: number) {
  const res = await fetch(`${apiBase}/movies/${movieId}/credits`);
  if (!res.ok) throw new Error("Failed to fetch movie credits");
  return res.json();
}

export async function SearchMovies(query: string) {
  const res = await fetch(
    `${apiBase}/movies/search?query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
}

export async function getAllMovies(
  page: number = 1,
  genre: string = "",
  sort: string = "popularity"
) {
  const params = new URLSearchParams({
    page: page.toString(),
    sort,
  });

  if (genre && genre !== "") {
    params.append("genre", genre);
  }

  const res = await fetch(`${apiBase}/movies/discover?${params}`);
  if (!res.ok) throw new Error("Failed to fetch all movies");
  return res.json();
}

export async function getPopularMovies() {
  const res = await fetch(`${apiBase}/movies/popular`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function getTopRatedMovies() {
  const res = await fetch(`${apiBase}/movies/top-rated`);
  if (!res.ok) throw new Error("Failed to fetch top rated movies");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${apiBase}/genres`);
  if (!res.ok) throw new Error("Failed to fetch movie categories");
  return res.json();
}

export const getTrailerUrl = async (movieId: number) => {
  const res = await fetch(`${apiBase}/movies/${movieId}/videos`);
  if (!res.ok) throw new Error("Failed to fetch movie trailers");
  const data = await res.json();
  const trailer = data.results.find(
    (video: VideoType) => video.type === "Teaser" && video.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

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
