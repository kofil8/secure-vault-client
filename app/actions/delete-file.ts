"use server";

export async function deleteFile(
  fileId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete file: ${res.statusText}`);
    }

    const result = await res.json();
    return {
      success: true,
      message: result.message || "File deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, message: (error as Error).message };
  }
}
