
import { NextRequest, NextResponse } from "next/server";

import type { Notice } from "@/types/notice";
import type { Pet } from "@/types/pet";

type CurrentUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  noticesFavorites?: Notice[];
  pets?: Pet[];
  noticesViewed?: Notice[];
};

export async function GET(request: NextRequest) {
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
      { message: "API is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/users/current/full`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 401) {
      const result = NextResponse.json(
        { message: "Session expired" },
        { status: 401 }
      );

      result.cookies.delete("petlove_token");
      result.cookies.delete("petlove_user_name");

      return result;
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to load profile" },
        { status: 502 }
      );
    }

    const user: CurrentUser = await response.json();

    return NextResponse.json(
      {
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        avatar: user.avatar ?? "",
        noticesFavorites: user.noticesFavorites ?? [],
        pets: user.pets ?? [],
        noticesViewed: user.noticesViewed ?? [],
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 502 }
    );
  }
}
