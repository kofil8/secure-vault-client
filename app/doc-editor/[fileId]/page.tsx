"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function EditorPage() {
  const { fileId } = useParams() as { fileId: string };
  const viewerRef = useRef<HTMLDivElement>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [docViewer, setDocViewer] = useState<any>(null);

  // Fetch file info and construct file URL
  useEffect(() => {
    if (!fileId) return;

    const fetchFile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
        );

        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const data = await res.json();

        const actualFilename =
          data?.data?.filename || data?.data?.fileName || data?.data?.name;

        if (!actualFilename) throw new Error("Filename missing in response");

        const finalUrl = `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/${actualFilename}`;
        setFilename(actualFilename);
        setFileUrl(finalUrl);
        console.log("📄 File loaded for WebViewer:", finalUrl);
      } catch (err: any) {
        console.error("Error fetching file:", err.message || err);
        toast.error(`❌ ${err.message || "Failed to load file"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  // Load WebViewer
  useEffect(() => {
    if (!fileUrl || !viewerRef.current) return;

    const loadViewer = async () => {
      const WebViewer = (await import("@pdftron/webviewer")).default;

      WebViewer(
        {
          path: "/lib/webviewer",
          initialDoc: fileUrl,
          licenseKey: process.env.APRYSE_LICENSE_KEY,
          enableOfficeEditing: true,
        },
        viewerRef.current!
      ).then((instance) => {
        const viewer = instance.Core.documentViewer;
        setDocViewer(viewer);
        setIsLoading(false);
      });
    };

    loadViewer();
  }, [fileUrl]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!docViewer || !filename || !fileId) return;

    const interval = setInterval(() => {
      handleSave(docViewer, filename, fileId, setLastSaved, true);
    }, 30000);

    return () => clearInterval(interval);
  }, [docViewer, filename, fileId]);

  const handleSave = async (
    viewer: any,
    filename: string,
    fileId: string,
    setLastSaved: (d: Date) => void,
    silent = false
  ) => {
    try {
      const data = await viewer.getDocument().getFileData();
      const blob = new Blob([data], { type: getMime(filename) });

      const formData = new FormData();
      formData.append("file", blob, filename);

      console.log("FormData being sent:", formData); // Debugging log to inspect FormData

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData); // Log response to see the error details
        throw new Error(`Error saving file: ${res.statusText}`);
      }

      const updatedData = await res.json();
      setFilename(updatedData.data.fileName);
      setFileUrl(updatedData.data.fileUrl);

      if (!silent) toast.success("✅ File saved");
      setLastSaved(new Date());
    } catch (err: any) {
      console.error("Save failed:", err.message || err);
      toast.error("❌ Save failed");
    }
  };

  const handleDownload = async () => {
    if (!docViewer || !filename) return;

    const fileData = await docViewer.getDocument().getFileData();
    const blob = new Blob([fileData], { type: getMime(filename) });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url); // prevent memory leaks
    toast.success("⬇️ Download started");
  };

  const renderAutosaveStatus = () => {
    if (!lastSaved) return "🕒 Not saved yet";
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return `💾 Autosaved ${seconds}s ago`;
  };

  return (
    <div className='w-full h-screen relative dark:bg-gray-900'>
      {/* Top Bar */}
      <div className='fixed top-0 w-full z-10 flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 shadow-sm'>
        <div className='text-sm text-gray-800 dark:text-white truncate max-w-xs'>
          {filename || "..."}
        </div>
        <div className='flex gap-2 items-center'>
          <span className='text-xs text-gray-500 dark:text-gray-300'>
            {renderAutosaveStatus()}
          </span>
          <button
            className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
            onClick={() =>
              handleSave(docViewer, filename, fileId, setLastSaved)
            }
          >
            💾 Save
          </button>
          <button
            className='px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded'
            onClick={handleDownload}
          >
            ⬇️ Download
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-gray-900'>
          <div className='animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent' />
        </div>
      )}

      {/* WebViewer */}
      <div ref={viewerRef} className='w-full h-full pt-[60px]' />
    </div>
  );
}

// Helper: MIME type from file extension
function getMime(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
}
