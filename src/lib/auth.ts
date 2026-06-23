import { NextRequest } from "next/server";

const AUTH_API_URL =
  process.env.AUTH_API_URL ?? "http://localhost:3000/api/v1/auth";

export async function getAuthenticatedUserId(
  request: NextRequest,
): Promise<string | null> {
  try {
    const token = request.cookies.get("movie-scope-token")?.value;
    if (!token) return null;

    const response = await fetch(`${AUTH_API_URL}/me`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      id?: string;
      user?: { id?: string };
    };

    return data.id ?? data.user?.id ?? null;
  } catch (error) {
    console.error("getAuthenticatedUserId failed:", error);
    return null;
  }
}
