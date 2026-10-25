
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: NextRequest,
  { params }: Context
) {
  const { id } = await params;
  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in again." },
      { status: 401 }
    );
  }

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json(
      { message: "Invalid pet ID." },
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

  try {
    const response = await fetch(
      `${apiUrl}/users/current/pets/remove/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 401) {
      const result = NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );

      result.cookies.delete("petlove_token");
      result.cookies.delete("petlove_user_name");

      return result;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            response.status === 404
              ? "Pet not found."
              : "Failed to remove pet.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to PetLove." },
      { status: 502 }
    );
  }
}
