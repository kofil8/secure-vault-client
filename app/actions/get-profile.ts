// app/actions/get-profile.ts
"use server";

import { cookies } from "next/headers";

export async function getProfile() {
    
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data?.data;
}
