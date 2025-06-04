const apiBase = import.meta.env.VITE_TMDB_API_URL;
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
import type { CategoryType, VideoType } from "../types/";

export async function getMovieDetails(movieId: number) {
  const res = await fetch(`${apiBase}/movie/${movieId}?api_key=${apiKey}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function getMovieCredits(movieId: number) {
  const res = await fetch(`${apiBase}/movie/${movieId}/credits?api_key=${apiKey}`);
  if (!res.ok) throw new Error("Failed to fetch movie credits");
  return res.json();
}

export async function SearchMovies(query: string) {
  const res = await fetch(`${apiBase}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
}

export async function getAllMovies(page: number = 1, genre:string , sort: string = "popularity") {
  const sortMap: Record<string, string> = {
    popularity: "popularity.desc",
    rated: "vote_average.desc&vote_count.gte=1000",
  };


  if(genre && genre !== ""){
    const res = await getCategories();
    const {id} = res.find((item:CategoryType)=> item.name.toLowerCase() == genre);
    console.log(id);
    genre = id;
  }
  

  const res = await fetch(`${apiBase}/discover/movie?api_key=${apiKey}&page=${page}${genre ? `&with_genres=${genre}` : ''}${sort ? `&sort_by=${sortMap[sort]}` : ''}`);
  if (!res.ok) throw new Error("Failed to fetch all movies");
  return res.json();
}

export async function getPopularMovies() {
  const res = await fetch(`${apiBase}/movie/popular?api_key=${apiKey}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function getTopRatedMovies() {
  const res = await fetch(`${apiBase}/movie/top_rated?api_key=${apiKey}`);
  if (!res.ok) throw new Error("Failed to fetch top rated movies");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${apiBase}/genre/movie/list?api_key=${apiKey}`);
  if (!res.ok) throw new Error("Failed to fetch movie categories");
  const data = await res.json();
  return data.genres;
}


export const getTrailerUrl = (movieId: number) => {
  const res = fetch(`${apiBase}/movie/${movieId}/videos?api_key=${apiKey}`).then(async (response) => {
    if (!response.ok) throw new Error("Failed to fetch movie trailers");
    const data = await response.json();
    const trailer = data.results.find((video: VideoType) => video.type === "Teaser" && video.site === "YouTube");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  });
  return res;
}

export const getMoviePosterUrl = (posterPath: string) => {
  
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://placehold.co/500x750?text=No+Poster+Available";
}

export const getMovieBackdropUrl = (backdropPath: string) => {
  return backdropPath
    ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
    : "https://placehold.co/1280x720?text=No+Backdrop+Available";
}

export const getCastProfileUrl = (profilePath: string) => {
  return profilePath
    ? `https://image.tmdb.org/t/p/w185${profilePath}`
    : "https://placehold.co/185x278?text=No+Profile+Available";
}