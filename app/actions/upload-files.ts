"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE_MB = 10;

export async function uploadFiles(formData: FormData) {
  // Filter out invalid files
  const files = (formData.getAll("files") as File[]).filter(
    (file) =>
      ALLOWED_TYPES.includes(file.type) &&
      file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
  );

  if (files.length === 0) {
    throw new Error("No valid files to upload.");
  }

  const uploadForm = new FormData();
  files.forEach((file) => uploadForm.append("files", file));

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadForm,
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Upload failed");
  }

  const result = await res.json();

  // ✅ Revalidate dashboard to show updated file list
  revalidatePath("/dashboard");

  return result?.data;
}
