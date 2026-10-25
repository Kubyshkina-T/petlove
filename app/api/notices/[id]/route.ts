
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const apiUrl = process.env.PETLOVE_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/notices/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 401) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to load notice" },
        { status: response.status }
      );
    }

    const notice = await response.json();

    return NextResponse.json(notice);
  } catch {
    return NextResponse.json(
      { message: "Server connection error" },
      { status: 502 }
    );
  }
}
