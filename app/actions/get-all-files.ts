"use server";

import { cookies } from "next/headers";

export async function getAllFiles() {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    console.error("Unauthorized: No access token found");
    return [];
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/file`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch files");
    }

    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllFiles() error:", error.message);
    } else {
      console.error("getAllFiles() unknown error:", error);
    }
    return [];
  }
}
