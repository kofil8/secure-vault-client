"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExcelEditor from "./ExcelEditor";

interface FileInfo {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  };
}

export default function XlsxEditorPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.fileId as string;
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<FileInfo>(
          `http://localhost:7001/api/v1/files/${fileId}`
        );
        setFileInfo(response.data);
      } catch (err) {
        setError("Failed to load file information");
        console.error("Error fetching file info:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileInfo();
  }, [fileId]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <div className='text-red-500'>{error}</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Check for fileInfo.data.fileType instead of fileInfo.fileType
  if (!fileInfo?.data || fileInfo.data.fileType.toLowerCase() !== "xlsx") {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <div>This file cannot be edited as an Excel spreadsheet</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>
            Editing: {fileInfo.data.fileName}
          </h1>
          <p className='text-sm text-muted-foreground'>
            File size: {(fileInfo.data.fileSize / 1024).toFixed(2)} KB
          </p>
        </div>
        <Button variant='outline' onClick={() => router.back()}>
          Close Editor
        </Button>
      </div>

      <ExcelEditor fileId={fileId} onClose={() => router.back()} />
    </div>
  );
}
