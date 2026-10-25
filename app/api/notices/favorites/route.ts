
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { isAuthenticated: false, favoriteIds: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const apiUrl = process.env.PETLOVE_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/users/current`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      const result = NextResponse.json(
        { isAuthenticated: false, favoriteIds: [] },
        { headers: { "Cache-Control": "no-store" } }
      );

      result.cookies.delete("petlove_token");
      result.cookies.delete("petlove_user_name");

      return result;
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to load favorites." },
        { status: 502 }
      );
    }

    const user: {
      noticesFavorites?: { _id: string }[];
    } = await response.json();

    if (!Array.isArray(user.noticesFavorites)) {
      return NextResponse.json(
        { message: "Invalid favorites data." },
        { status: 502 }
      );
    }

    const favoriteIds = user.noticesFavorites.map(
      (notice) => notice._id
    );

    return NextResponse.json(
      { isAuthenticated: true, favoriteIds },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the server." },
      { status: 502 }
    );
  }
}
