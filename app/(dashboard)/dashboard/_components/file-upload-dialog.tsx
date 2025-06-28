"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, FileText, File } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadFiles } from "@/app/actions/upload-files";
import { useRouter } from "next/navigation"; // ✅ Added

export default function FileUploadDialog() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // ✅ Added

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const MAX_FILE_SIZE_MB = 10;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList: File[]) => {
    const validFiles: File[] = [];
    const previews: string[] = [];

    fileList.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not an allowed file type.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      validFiles.push(file);
      previews.push(
        file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
      );
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...previews]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    startTransition(async () => {
      try {
        await uploadFiles(formData);
        toast.success("Files uploaded successfully!");
        setFiles([]);
        setPreviews([]);
        router.refresh(); // ✅ Refresh dashboard content after upload
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || "Upload failed");
        } else {
          toast.error("Upload failed");
        }
      }
    });
  };

  const totalSizeMB = (
    files.reduce((acc, file) => acc + file.size, 0) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='gap-2'>
          <Upload className='h-4 w-4' />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files here or click to browse. Max {MAX_FILE_SIZE_MB}
            MB per file.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileInputRef}
          id='file-upload'
          type='file'
          multiple
          accept='.pdf,.docx,.xlsx,.xls,image/*'
          onChange={handleFileInput}
          className='hidden'
        />

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-sm text-muted-foreground mb-2'>
            Drop files here or click to upload
          </p>
          <Button variant='outline' size='sm' type='button'>
            Browse Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className='mt-4'>
            <h4 className='text-sm font-medium mb-1'>Uploaded Files:</h4>
            <p className='text-xs text-muted-foreground mb-2'>
              Total size: {totalSizeMB} MB
            </p>
            <ul className='space-y-2 max-h-40 overflow-y-auto'>
              {files.map((file, index) => (
                <li
                  key={index}
                  className='flex items-center justify-between gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded'
                >
                  <div className='flex items-center gap-2 truncate flex-1 text-left'>
                    {previews[index] ? (
                      <Image
                        src={previews[index]}
                        alt={file.name}
                        width={32}
                        height={32}
                        className='h-8 w-8 object-cover rounded'
                      />
                    ) : (
                      <span className='h-8 w-8 flex items-center justify-center'>
                        {file.type.includes("pdf") ||
                        file.name.endsWith(".pdf") ? (
                          <FileText className='h-5 w-5' />
                        ) : (
                          <File className='h-5 w-5' />
                        )}
                      </span>
                    )}
                    <span className='truncate max-w-[180px]'>{file.name}</span>
                  </div>

                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 p-0 text-muted-foreground hover:text-destructive'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              type='button'
              onClick={handleUpload}
              disabled={isPending}
              className='w-full text-white mt-4'
            >
              {isPending ? "Uploading..." : "Upload Now"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
