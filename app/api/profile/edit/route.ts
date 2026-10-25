
import { NextRequest, NextResponse } from "next/server";

type EditUserBody = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in again." },
      { status: 401 }
    );
  }

  const apiUrl = process.env.PETLOVE_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "API is not configured." },
      { status: 500 }
    );
  }

  let body: EditUserBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.phone !== "string" ||
    typeof body.avatar !== "string" ||
    !body.name.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  ) {
    return NextResponse.json(
      { message: "Please check your profile information." },
      { status: 400 }
    );
  }

  if (body.avatar.trim()) {
    try {
      const avatarUrl = new URL(body.avatar.trim());

      if (avatarUrl.protocol !== "https:") {
        throw new Error("Invalid avatar URL");
      }
    } catch {
      return NextResponse.json(
        { message: "Avatar must be a valid HTTPS image URL." },
        { status: 400 }
      );
    }
  }

  try {
    const response = await fetch(`${apiUrl}/users/current/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        ...(body.avatar.trim()
          ? { avatar: body.avatar.trim() }
          : {}),
      }),
      cache: "no-store",
    });

    if (response.status === 401) {
      const result = NextResponse.json(
        { message: "Your session has expired. Please log in again." },
        { status: 401 }
      );

      result.cookies.delete("petlove_token");
      result.cookies.delete("petlove_user_name");

      return result;
    }

    if (!response.ok) {
      let message = "Could not update your profile.";

      if (response.status === 409) {
        message = "This email is already in use.";
      } else if (response.status === 400) {
        message = "Please check the entered information.";
      }

      return NextResponse.json(
        { message },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Could not connect to PetLove." },
      { status: 502 }
    );
  }
}
