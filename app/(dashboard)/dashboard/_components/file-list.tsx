// file-list.tsx
"use client";

import FileCard from "./file-card";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { DashboardFile } from "../file-list-types";

type FileListProps = {
  viewMode: "grid" | "list";
  files: DashboardFile[];
  searchQuery?: string;
  onFileDeleted: (fileId: string) => void;
};

export default function FileList({
  viewMode,
  files,
  searchQuery = "", // Default value for searchQuery
  onFileDeleted,
}: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Memoize filtered files to prevent unnecessary recalculations
  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  // Handle errors during deletion
  const handleDeleteError = (error: unknown) => {
    toast.error(
      error instanceof Error ? error.message : "Failed to delete file"
    );
  };

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className='space-y-4'>
      {viewMode === "grid" ? (
        <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id} // Unique key prop
              file={file}
              viewMode={viewMode}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={() => toggleFileSelection(file.id)}
              onDeleteSuccess={onFileDeleted}
              onDeleteError={handleDeleteError}
            />
          ))}
        </div>
      ) : (
        <div className='space-y-1'>
          {/* List View Header */}
          <div className='grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm text-muted-foreground border-b'>
            <div className='col-span-6'>Name</div>
            <div className='col-span-2'>Size</div>
            <div className='col-span-3'>Modified</div>
            <div className='col-span-1'>Actions</div>
          </div>

          {/* List View Files */}
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id} // Unique key prop
              file={file}
              viewMode={viewMode}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={() => toggleFileSelection(file.id)}
              onDeleteSuccess={onFileDeleted}
              onDeleteError={handleDeleteError}
            />
          ))}
        </div>
      )}
    </div>
  );
}
