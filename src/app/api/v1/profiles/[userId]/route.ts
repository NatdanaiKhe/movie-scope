import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { userId } = await context.params;

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    return Response.json({ message: "Profile not found" }, { status: 404 });
  }

  return Response.json({ profile });
}
