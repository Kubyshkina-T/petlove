
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ?? "Failed to upload image."
    );
  }

  if (typeof result?.imgURL !== "string") {
    throw new Error("Image URL was not returned.");
  }

  return result.imgURL;
}
