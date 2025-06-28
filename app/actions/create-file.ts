"use server";
import { cookies } from "next/headers";

export const createFile = async (type: "docx" | "xlsx" | "pdf") => {
  try {
    // Get the access token from cookies (server-side)
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized: No token found." };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/create/${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return { success: false, message: "Failed to create file." };
    }

    const data = await res.json();
    const fileUrl = data.data.url;

    return { success: true, fileUrl };
  } catch (error) {
    console.error("Error creating file:", error);
    return { success: false, message: "Error creating file." };
  }
};
