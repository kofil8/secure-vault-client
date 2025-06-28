// app/actions/change-password.ts
"use server";

import { cookies } from "next/headers";

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized: No token found." };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/change-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message:
          data.message ||
          data.errorMessages?.[0]?.message ||
          "Password change failed",
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
