/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include", // ensure the cookie is sent
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Logout failed");
    }

    (await cookies()).delete("accessToken");

    return { success: true };
  } catch (error: any) {
    console.log("err", error);
    throw new Error(error.message || "Logout failed");
  }
}
