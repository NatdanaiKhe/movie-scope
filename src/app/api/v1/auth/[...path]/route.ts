import { NextRequest } from "next/server";

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
  const targetUrl = new URL(`${AUTH_API_URL}/${path.join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.set("content-type", "application/json");
  headers.delete("host");
  headers.delete("content-length");

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : JSON.stringify({
          ...(await getJsonBody(request)),
          projectApiKey: AUTH_PROJECT_API_KEY,
        });

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
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
