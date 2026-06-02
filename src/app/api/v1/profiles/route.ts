import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    userId?: string;
    displayName?: string;
    bio?: string | null;
    avatarUrl?: string | null;
  };

  if (!body.userId || !body.displayName) {
    return Response.json(
      { message: "userId and displayName are required" },
      { status: 400 },
    );
  }

  const profile = await prisma.profile.upsert({
    where: {
      userId: body.userId,
    },
    create: {
      userId: body.userId,
      displayName: body.displayName,
      bio: body.bio ?? null,
      avatarUrl: body.avatarUrl ?? null,
    },
    update: {
      displayName: body.displayName,
      bio: body.bio ?? null,
      avatarUrl: body.avatarUrl ?? null,
    },
  });

  return Response.json({ profile }, { status: 201 });
}
