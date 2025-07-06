export const fetchFileDetails = async (fileId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
    );
    if (!response.ok) throw new Error("Failed to fetch file details");

    const data = await response.json();
    return data; // Returns { filename, fileUrl, etc. }
  } catch (err) {
    console.error("Failed to load file details:", err);
    throw new Error("❌ Failed to load file details");
  }
};
