import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["watchlist", "watched", "favorite"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch watchlist" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      movieId?: unknown;
      status?: string;
    };

    if (typeof body.movieId !== "number") {
      return NextResponse.json(
        { message: "movieId (number) is required" },
        { status: 400 },
      );
    }

    const status: string = body.status ?? "watchlist";
    if (!VALID_STATUSES.includes(status as ValidStatus)) {
      return NextResponse.json(
        { message: `status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 },
      );
    }

    const item = await prisma.watchlistItem.upsert({
      where: {
        userId_movieId: { userId, movieId: body.movieId },
      },
      create: {
        userId,
        movieId: body.movieId,
        status: status as ValidStatus,
      },
      update: {
        status: status as ValidStatus,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to update watchlist" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieIdParam = searchParams.get("movieId");

    if (!movieIdParam) {
      return NextResponse.json(
        { message: "movieId query parameter is required" },
        { status: 400 },
      );
    }

    const movieId = parseInt(movieIdParam, 10);
    if (isNaN(movieId)) {
      return NextResponse.json(
        { message: "movieId must be a number" },
        { status: 400 },
      );
    }

    await prisma.watchlistItem.delete({
      where: {
        userId_movieId: { userId, movieId },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { message: "Failed to remove watchlist item" },
      { status: 500 },
    );
  }
}
