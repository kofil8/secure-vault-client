export async function getFileUrlById(fileId: string): Promise<{
  fileUrl: string;
  fileName: string;
}> {
  const res = await fetch(`http://localhost:7001/api/v1/files/${fileId}`);
  if (!res.ok) throw new Error("File not found");

  const file = await res.json();
  return {
    fileUrl: file.fileUrl,
    fileName: file.fileName,
  };
}
