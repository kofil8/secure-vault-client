"use server";

import { cookies } from "next/headers";

export async function deleteFile(fileId: string) {
  // Validate fileId
  if (!fileId || typeof fileId !== "string" || !/^[a-f\d]{24}$/i.test(fileId)) {
    return {
      success: false,
      message: "Invalid file ID format",
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return {
      success: false,
      message: "Unauthorized: No access token",
    };
  }

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/files/permanent/${encodeURIComponent(fileId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete file",
      };
    }

    return {
      success: true,
      message: result.message || "File deleted successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      message: (error as Error).message || "Failed to delete file",
    };
  }
}
