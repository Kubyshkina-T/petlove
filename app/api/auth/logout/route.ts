
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("petlove_token")?.value;
  const apiUrl = process.env.PETLOVE_API_URL;

  let backendError: string | null = null;

  if (token && apiUrl) {
    try {
      const backendResponse = await fetch(
        `${apiUrl}/users/signout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!backendResponse.ok) {
        backendError =
          "Could not end the session on the server.";
      }
    } catch {
      backendError =
        "Could not connect to the server to end the session.";
    }
  } else if (token && !apiUrl) {
    backendError = "Backend API is not configured.";
  }

  // Delete cookies regardless of backend response.
  const response = NextResponse.json({
    success: true,
    message: "Logged out locally.",
    backendError,
  });

  response.cookies.set("petlove_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("petlove_user_name", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
