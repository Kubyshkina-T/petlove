
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

async function updateFavorite(
  request: NextRequest,
  context: Context,
  action: "add" | "remove"
) {
  const { id } = await context.params;

  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in to continue." },
      { status: 401 }
    );
  }

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json(
      { message: "Invalid notice ID." },
      { status: 400 }
    );
  }

  const apiUrl = process.env.PETLOVE_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API is not configured." },
      { status: 500 }
    );
  }

  const method = action === "add" ? "POST" : "DELETE";

  try {
    const response = await fetch(
      `${apiUrl}/notices/favorites/${action}/${id}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      let message = "Failed to update favorites.";

      if (response.status === 401) {
        message = "Your session has expired. Please log in again.";
      } else if (response.status === 404) {
        message = "Notice not found.";
      }

      return NextResponse.json(
        { message },
        { status: response.status }
      );
    }

    const favorites: unknown = await response.json();

    if (
      !Array.isArray(favorites) ||
      !favorites.every((item) => typeof item === "string")
    ) {
      return NextResponse.json(
        { message: "Unexpected favorites response." },
        { status: 502 }
      );
    }

    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the server." },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: Context
) {
  return updateFavorite(request, context, "add");
}

export async function DELETE(
  request: NextRequest,
  context: Context
) {
  return updateFavorite(request, context, "remove");
}
