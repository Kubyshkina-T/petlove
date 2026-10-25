
import { NextRequest, NextResponse } from "next/server";

type SignUpResponse = {
  email: string;
  name: string;
  token: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 7
    ) {
      return NextResponse.json(
        { message: "Invalid registration data." },
        { status: 400 }
      );
    }

    const apiUrl = process.env.PETLOVE_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { message: "API URL is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const message =
        response.status === 409
          ? "This email is already registered."
          : "Registration failed. Please try again.";

      return NextResponse.json(
        { message },
        { status: response.status }
      );
    }

    const user: SignUpResponse = await response.json();

    if (!user.token) {
      return NextResponse.json(
        { message: "Authentication token is missing." },
        { status: 502 }
      );
    }

    const result = NextResponse.json(
      {
        name: user.name,
        email: user.email,
      },
      { status: 201 }
    );

    result.cookies.set("petlove_token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
      
result.cookies.set("petlove_user_name", user.name, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});
      
    return result;
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
