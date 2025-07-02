"use server";
import { cookies } from "next/headers";
import { toast } from "sonner"; // Ensure toast is imported correctly

export const handleOpenWithEditor = async (fileId: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    console.error("Unauthorized: No access token found");
    toast.error("Unauthorized: No access token found");
    return;
  }

  try {
    // Fetch the editor config from backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/editor-config/${fileId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (response.ok && data.data) {
      const { document, editorConfig } = data.data;

      // Build the OnlyOffice Editor URL
      const editorUrl = `https://documentserver.onlyoffice.com/editor/embedded?url=${encodeURIComponent(
        document.url
      )}&user=${encodeURIComponent(editorConfig.user.name)}`;

      // Open the editor in a new tab
      window.open(editorUrl, "_blank");
    } else {
      toast.error("Unable to generate the editor link.");
    }
  } catch (error) {
    toast.error("An error occurred while opening the file.");
    console.error(error);
  }
};
