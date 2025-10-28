import {  NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = process.env.TMDB_API_URL;

export async function GET() {
  try {
    const res = await fetch(
      `${TMDB_API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch genres" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data.genres);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}