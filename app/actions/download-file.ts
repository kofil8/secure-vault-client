import { toast } from "sonner";

export const handleDownload = async (fileId: string, fileName: string) => {
  const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/download/${fileId}`;

  console.log(downloadUrl);
  try {
    // Fetch the file data from the backend
    const response = await fetch(downloadUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch file.");
    }

    // Convert the response to a blob
    const blob = await response.blob();

    // Create a link element
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob); // Create an object URL for the Blob

    link.href = url;
    link.download = fileName; // Use the file's name as the default filename

    // Append the link to the document, trigger a click, then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
    window.URL.revokeObjectURL(url);

    toast("File is downloading...");
  } catch (error) {
    console.error(error);
    toast("Failed to download the file.");
  }
};
