
import { NextRequest, NextResponse } from "next/server";

type SignInResponse = {
  email: string;
  name: string;
  token: string;
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { message: "Email and password are required." },
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

    const response = await fetch(`${apiUrl}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: response.status }
      );
    }

    const user: SignInResponse = await response.json();

    if (!user.token) {
      return NextResponse.json(
        { message: "Authentication token is missing." },
        { status: 502 }
      );
    }

    const result = NextResponse.json({
      email: user.email,
      name: user.name,
    });

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
