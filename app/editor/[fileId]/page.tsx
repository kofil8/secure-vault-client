"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

// ✅ Fallback types for Apryse document viewer instance
type DocumentViewer = {
  getDocument: () => {
    getFileData: () => Promise<ArrayBuffer>;
  };
};

type WebViewerInstanceFallback = {
  Core: {
    documentViewer: DocumentViewer;
  };
};

export default function EditorPage() {
  const { fileId } = useParams() as { fileId: string };
  const viewerRef = useRef<HTMLDivElement>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [docViewer, setDocViewer] = useState<DocumentViewer | null>(null);

  useEffect(() => {
    if (!fileId) return;

    const fetchFile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${fileId}`
        );
        if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);

        const data = await res.json();
        const actualFilename =
          data?.data?.fileName || data?.data?.filename || data?.data?.name;

        if (!actualFilename) throw new Error("Missing filename in response");

        const finalUrl = `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/${actualFilename}`;
        setFilename(actualFilename);
        setFileUrl(finalUrl);
      } catch (err: unknown) {
        console.error("Error fetching file:", err);
        const message =
          err instanceof Error ? err.message : "Could not load file";
        toast.error(`❌ ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

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
        const typed = instance as unknown as WebViewerInstanceFallback;
        setDocViewer(typed.Core.documentViewer);
        setIsLoading(false);
      });
    };

    loadViewer();
  }, [fileUrl]);

  const handleSave = useCallback(
    async (silent = false) => {
      if (!docViewer || !filename || !fileId) return;

      try {
        const data = await docViewer.getDocument().getFileData();
        const blob = new Blob([data], { type: getMime(filename) });
        const formData = new FormData();
        formData.append("file", blob, filename);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/content/${fileId}`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.message || res.statusText);
        }

        const updated = await res.json();
        setFilename(updated.data.fileName);
        setFileUrl(updated.data.fileUrl);

        if (!silent) toast.success("✅ File saved successfully");
        setLastSaved(new Date());
      } catch (err: unknown) {
        console.error("Save failed:", err);
        const message = err instanceof Error ? err.message : "Save failed";
        toast.error(`❌ ${message}`);
      }
    },
    [docViewer, filename, fileId]
  );

  useEffect(() => {
    if (!docViewer || !filename || !fileId) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (!lastSaved || now.getTime() - lastSaved.getTime() > 60000) {
        handleSave(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [docViewer, filename, fileId, lastSaved, handleSave]);

  const handleDownload = async () => {
    if (!docViewer || !filename) return;

    const data = await docViewer.getDocument().getFileData();
    const blob = new Blob([data], { type: getMime(filename) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("⬇️ Download started");
  };

  const renderAutosaveStatus = () => {
    if (!lastSaved) return "🕒 Not saved yet";
    const secondsAgo = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return `💾 Autosaved ${secondsAgo}s ago`;
  };

  return (
    <div className='w-full h-screen relative dark:bg-gray-900'>
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
            onClick={() => handleSave(false)}
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

      {isLoading && (
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-gray-900'>
          <div className='animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent' />
        </div>
      )}

      <div ref={viewerRef} className='w-full h-full pt-[60px]' />
    </div>
  );
}

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
