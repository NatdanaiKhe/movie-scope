import { Genre } from "@/types/index";
import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = process.env.TMDB_API_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const genre = searchParams.get("genre") || "";
    const sort = searchParams.get("sort") || "popularity";

    const sortMap: Record<string, string> = {
      popularity: "popularity.desc",
      rated: "vote_average.desc&vote_count.gte=1000",
    };

    let genreId = genre;

    // If genre is provided and not a number, fetch genre list to get ID
    if (genre && genre !== "" && isNaN(Number(genre))) {
      const genresRes = await fetch(
        `${TMDB_API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
      );
      if (genresRes.ok) {
        const genresData = await genresRes.json();
        const foundGenre = genresData.genres.find(
          (item: Genre) => item.name.toLowerCase() === genre.toLowerCase()
        );
        genreId = foundGenre ? foundGenre.id.toString() : "";
      }
    }

    const url = new URL(
      `${TMDB_API_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}${
        genreId ? `&with_genres=${genreId}` : ""
      }${sort ? `&sort_by=${sortMap[sort]}` : ""}`
    );

    // if (genreId && genreId !== "") {
    //   url.searchParams.append("with_genres", genreId);
    // }

    // if (sort && sortMap[sort]) {
    //   url.searchParams.append("sort_by", sortMap[sort]);
    // }

    console.log(url.toString());
    

    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movies" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}