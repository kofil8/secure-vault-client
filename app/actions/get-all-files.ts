/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export async function getAllFiles() {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/file`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store", // always fetch fresh data
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch files");
    }

    const data = await res.json();
    return data?.data; // You can shape this based on API structure
  } catch (error: any) {
    throw new Error(error.message || "Failed to load files");
  }
}
