import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const AUTH_API_URL =
  process.env.AUTH_API_URL ?? "http://localhost:3000/api/v1/auth";
const AUTH_PROJECT_API_KEY = process.env.AUTH_PROJECT_API_KEY;

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyAuthRequest(request: NextRequest, context: RouteContext) {
  if (!AUTH_PROJECT_API_KEY) {
    return Response.json(
      { message: "Missing AUTH_PROJECT_API_KEY" },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const authPath = path.join("/");
  const targetUrl = new URL(`${AUTH_API_URL}/${path.join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.set("content-type", "application/json");
  headers.delete("host");
  headers.delete("content-length");

  const requestBody =
    request.method === "GET" || request.method === "HEAD"
      ? null
      : await getJsonBody(request);
  const body = requestBody
    ? JSON.stringify({
        ...requestBody,
        projectApiKey: AUTH_PROJECT_API_KEY,
      })
    : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  if (request.method === "POST" && authPath === "register" && response.ok) {
    await createProfileAfterRegister(response.clone(), requestBody);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

async function createProfileAfterRegister(
  response: Response,
  requestBody: Record<string, unknown> | null,
) {
  try {
    const data = (await response.json()) as {
      id?: string;
      name?: string;
    };
    const userId = data.id;
    const displayName = getString(requestBody?.name) ?? getString(data.name);

    if (!userId || !displayName) {
      console.error("Profile creation skipped after register:", {
        hasUserId: Boolean(userId),
        hasDisplayName: Boolean(displayName),
      });
      return;
    }

    await prisma.profile.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        displayName,
      },
      update: {
        displayName,
      },
    });
  } catch (error) {
    console.error("Profile creation failed after auth register:", error);
  }
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function getJsonBody(request: NextRequest) {
  const text = await request.text();

  if (!text) {
    return {};
  }

  return JSON.parse(text) as Record<string, unknown>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyAuthRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyAuthRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyAuthRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyAuthRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyAuthRequest(request, context);
}
