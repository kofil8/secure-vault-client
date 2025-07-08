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

    // Remove the access token cookie
    (await cookies()).delete("accessToken");

    // Instead of redirecting here, we return a signal for client-side redirection
    return { success: true, redirectToLogin: true }; // Returning the redirect signal
  } catch (error: unknown) {
    console.log("err", error);

    if (error instanceof Error) {
      throw new Error(error.message || "Logout failed");
    }

    throw new Error("Logout failed");
  }
}
