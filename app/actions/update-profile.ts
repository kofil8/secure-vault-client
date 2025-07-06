"use server";

import { cookies } from "next/headers";

export async function updateProfileAction(formData: FormData): Promise<{
  success: boolean;
  message: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return {
      success: false,
      message: "No access token found",
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/update`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Update failed",
      };
    }

    return {
      success: true,
      message: data?.message || "Profile updated successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Unexpected error",
    };
  }
}
