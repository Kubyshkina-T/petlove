
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
]);

const IMAGE_URL_REGEX =
  /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/;

export async function POST(request: NextRequest) {
  const token = request.cookies.get("petlove_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in to upload a photo." },
      { status: 401 }
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary is not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please choose an image." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Unsupported image format." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Image size must be between 1 byte and 5 MB." },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const uploadData = new FormData();

    uploadData.append("file", file, file.name);
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        cloudName
      )}/image/upload`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            result?.error?.message ??
            "Failed to upload image to Cloudinary.",
        },
        { status: 502 }
      );
    }

    const imageUrl = result?.secure_url;

    if (
      typeof imageUrl !== "string" ||
      !IMAGE_URL_REGEX.test(imageUrl)
    ) {
      return NextResponse.json(
        {
          message: "Uploaded image URL has an unsupported format.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      imgURL: imageUrl,
    });
  } catch {
    return NextResponse.json(
      { message: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
