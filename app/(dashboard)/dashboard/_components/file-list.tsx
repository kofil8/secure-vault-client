"use client";

import FileCard from "./file-card";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SomeOtherFileType } from "../file-list-types";

type FileListProps = {
  viewMode: "grid" | "list";
  files: SomeOtherFileType[];
  searchQuery?: string;
  onFileDeleted: (fileId: string) => void;
};

export default function FileList({
  viewMode,
  files,
  searchQuery,
  onFileDeleted,
}: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Memoize filtered files to avoid unnecessary recalculations
  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        // Skip files without IDs
        if (!file.id) {
          console.warn("File missing ID:", file.fileName);
          return false;
        }
        return file.fileName
          .toLowerCase()
          .includes(searchQuery?.toLowerCase() || "");
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [files, searchQuery]);

  const handleDeleteError = (error: unknown) => {
    toast.error(
      error instanceof Error ? error.message : "Failed to delete file"
    );
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // List view header component
  const ListHeader = () => (
    <div className='grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm text-muted-foreground border-b'>
      <div className='col-span-6'>Name</div>
      <div className='col-span-2'>Size</div>
      <div className='col-span-3'>Modified</div>
      <div className='col-span-1'>Actions</div>
    </div>
  );

  // Grid view container
  const GridView = () => (
    <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {filteredFiles.map((file) => (
        <FileCard
          key={`file-card-${file.id}`}
          file={file}
          viewMode='grid'
          isSelected={selectedFiles.includes(file.id)}
          onSelect={() => toggleFileSelection(file.id)}
          onDeleteSuccess={onFileDeleted}
          onDeleteError={handleDeleteError}
        />
      ))}
    </div>
  );

  // List view container
  const ListView = () => (
    <div className='space-y-1'>
      <ListHeader />
      {filteredFiles.map((file) => (
        <FileCard
          key={`file-row-${file.id}`}
          file={file}
          viewMode='list'
          isSelected={selectedFiles.includes(file.id)}
          onSelect={() => toggleFileSelection(file.id)}
          onDeleteSuccess={onFileDeleted}
          onDeleteError={handleDeleteError}
        />
      ))}
    </div>
  );

  return (
    <div className='space-y-4'>
      {viewMode === "grid" ? <GridView /> : <ListView />}
    </div>
  );
}
