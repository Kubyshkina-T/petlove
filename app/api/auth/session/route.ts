
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("petlove_token")?.value;

  const noCache = {
    "Cache-Control": "no-store",
  };

  if (!token) {
    return NextResponse.json(
      {
        isAuthenticated: false,
        name: null,
      },
      { headers: noCache }
    );
  }

  const apiUrl = process.env.PETLOVE_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API is not configured." },
      { status: 500, headers: noCache }
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
        {
          isAuthenticated: false,
          name: null,
        },
        { headers: noCache }
      );

      result.cookies.delete("petlove_token");
      result.cookies.delete("petlove_user_name");

      return result;
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to verify session." },
        { status: 502, headers: noCache }
      );
    }

    const user: { name: string } = await response.json();

    return NextResponse.json(
      {
        isAuthenticated: true,
        name: user.name,
      },
      { headers: noCache }
    );
  } catch {
    return NextResponse.json(
      { message: "Connection to server failed." },
      { status: 502, headers: noCache }
    );
  }
}
