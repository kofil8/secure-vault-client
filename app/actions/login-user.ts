"use server";

// import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      // optionally include credentials if needed
      credentials: "include",
      cache: "no-store", // prevent Next.js from caching the response
    }
  );

  if (!res.ok) {
    // Handle HTTP errors
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();

  return data;
}
