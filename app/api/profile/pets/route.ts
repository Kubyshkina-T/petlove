
import { NextRequest, NextResponse } from "next/server";

type PetInput = {
  name: string;
  title: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
};

export async function POST(request: NextRequest) {
  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in to continue." },
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

  let body: PetInput;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request data." },
      { status: 400 }
    );
  }

  const fields = [
    body.name,
    body.title,
    body.imgURL,
    body.species,
    body.birthday,
    body.sex,
  ];

  if (fields.some(
    (value) => typeof value !== "string" || !value.trim()
  )) {
    return NextResponse.json(
      { message: "Please fill in all fields." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${apiUrl}/users/current/pets/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: body.name.trim(),
          title: body.title.trim(),
          imgURL: body.imgURL.trim(),
          species: body.species.trim().toLowerCase(),
          birthday: body.birthday,
          sex: body.sex,
        }),
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
      const errorData = await response.json().catch(() => null);

      return NextResponse.json(
        {
          message:
            typeof errorData?.message === "string"
              ? errorData.message
              : "Failed to add pet. Check the entered information.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to PetLove." },
      { status: 502 }
    );
  }
}
