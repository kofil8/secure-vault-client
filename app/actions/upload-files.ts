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
  const files = formData.getAll("files") as File[];

  const uploadForm = new FormData();

  files.forEach((file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return;

    uploadForm.append("files", file);
  });

  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files`, {
    method: "POST",
    body: uploadForm,
    credentials: "include",
    cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Upload failed");
  }

  const result = await res.json();
  revalidatePath("/");
  return result?.data;
}
