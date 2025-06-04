export type MovieType = {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  release_date: string; // ISO 8601 format (e.g., "2025-03-31")
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type MovieDetailsType = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string; // ISO 8601 format (e.g., "2025-03-31")
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  runtime: number; // in minutes
  tagline?: string; // optional
  revenue?: number; // in USD
  
};

export type VideoType = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string; // ISO 8601 format (e.g., "2025-03-31T12:00:00Z")
  iso_639_1: string;
  iso_3166_1: string;
  size: number;
}

export type MovieCreditsType = {
  id: number;
  cast: {
    cast_id: number;
    character: string;
    credit_id: string; 
    name: string;
    order: number;
    profile_path: string | null; 

  }[];
  crew: {
    id: number;
    department: string;
    job: string;
    name: string;
    profile_path: string | null; 
  }[]; 
}

export type CastType = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null; // URL to the actor's profile picture
}

export type CrewType = {
  id: number;
  name: string;
  job: string; // Role in the movie (e.g., Director, Producer)
  profile_path: string | null; // URL to the crew member's profile picture
}

export type CategoryType = {
  id: number;
  name: string;
}
