"use server";

import { cookies } from "next/headers";

interface FetchParams {
  filetype?: string;
  searchTerm?: string;
  sortOrder?: "asc" | "desc";
}

export async function getAllFiles({
  filetype,
  searchTerm = "",
  sortOrder = "desc",
}: FetchParams) {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    console.error("Unauthorized: No access token found");
    return [];
  }

  try {
    const query = new URLSearchParams();
    if (filetype) query.append("filetype", filetype);
    if (searchTerm) query.append("searchTerm", searchTerm);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/files?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch files");
    }

    const data = await res.json();
    const rawFiles = data?.data?.result;

    interface RawFile {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      updatedAt: string;
      isFavorite?: boolean;
      fileUrl: string;
    }

    const mappedFiles = Array.isArray(rawFiles)
      ? rawFiles
          .map((file: RawFile) => ({
            id: file.id,
            name: file.fileName,
            type: file.fileType,
            fileUrl: file.fileUrl,
            size: formatFileSize(file.fileSize),
            modified: formatModifiedTime(file.updatedAt),
            updatedAt: file.updatedAt,
            starred: file.isFavorite || false,
            thumbnail: file.fileUrl,
          }))
          .sort((a, b) => {
            const timeA = new Date(a.updatedAt).getTime();
            const timeB = new Date(b.updatedAt).getTime();
            return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
          })
          .map((file) => file)
      : [];

    return mappedFiles;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllFiles() error:", error.message);
    } else {
      console.error("getAllFiles() unknown error:", error);
    }
    return [];
  }
}

function formatFileSize(bytes: number) {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${kb.toFixed(1)} KB`;
}

function formatModifiedTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

  return date.toLocaleDateString();
}
