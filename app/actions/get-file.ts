"use server";

export const fetchFileDetails = async (fileId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
    );

    if (!response.ok) throw new Error("Failed to fetch file details");

    const json = await response.json();
    const { id, fileName, fileUrl } = json.data;

    if (!fileName || !fileUrl) {
      throw new Error("Missing fileName or fileUrl in response");
    }

    return { id, fileName, fileUrl };
  } catch (err) {
    console.error("Failed to load file details:", err);
    throw new Error("❌ Failed to load file details");
  }
};
