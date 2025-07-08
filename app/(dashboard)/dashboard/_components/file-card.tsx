"use client";

import { deleteFile } from "@/app/actions/delete-file";
import { handleDownload } from "@/app/actions/download-file";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreVertical, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type FileProps = {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
    starred: boolean;
    fileUrl: string;
    thumbnail?: string;
  };
  viewMode: "grid" | "list";
  isSelected?: boolean;
  onSelect?: () => void;
  onDeleteSuccess: (fileId: string) => void;
  onDeleteError: (error: unknown) => void;
};

export default function FileCard({
  file,
  viewMode,
  isSelected,
  onSelect,
  onDeleteSuccess,
  onDeleteError,
}: FileProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handlePreview = () => {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(file.type)) {
      setIsOpen(true);
    } else {
      toast.error("Preview not available for this file type.");
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const result = await deleteFile(fileId);
      console.log("Delete result:", result);
      if (result.success === true) {
        onDeleteSuccess(fileId);
        toast.success(result.message);
      } else {
        onDeleteError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      onDeleteError(error);
      toast.error("An error occurred while deleting the file.");
    }
  };

  const getFileIcon = () => {
    const map: { [key: string]: string } = {
      png: "🏞️",
      jpg: "🏞️",
      jpeg: "🏞️",
      gif: "🏞️",
      webp: "🏞️",
      pdf: "📄",
      docx: "📝",
      xlsx: "📊",
    };
    return <span className='text-4xl'>{map[file.type] || "📁"}</span>;
  };

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        viewMode === "grid" ? "h-full" : "w-full"
      )}
      onClick={onSelect}
    >
      <Card
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border bg-white/70 backdrop-blur-sm transition-all duration-200",
          isSelected
            ? "border-black ring-2 ring-black/70 shadow-lg scale-[1.02]"
            : "border-gray-200 hover:border-black/20 hover:shadow-md",
          viewMode === "grid" ? "flex flex-col" : "flex-row items-center"
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-xl border bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner",
            viewMode === "grid"
              ? "aspect-square w-full mb-3"
              : "w-16 h-16 min-w-[4rem] mx-4 my-2"
          )}
        >
          {getFileIcon()}
          {file.starred && (
            <Star className='absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-yellow-400 drop-shadow' />
          )}
        </div>

        {/* Info */}
        <CardContent
          className={cn(
            "flex-1 min-w-0 p-3",
            viewMode === "grid"
              ? "flex flex-col items-start"
              : "flex items-center justify-between"
          )}
        >
          <div className='min-w-0 w-full'>
            <h3
              className='text-sm font-medium truncate text-gray-900'
              title={file.name}
            >
              {file.name.length > 30
                ? file.name.slice(0, 27) + "..."
                : file.name}
            </h3>
            <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
              <span>{file.size}</span>
              <span className='hidden sm:inline'>•</span>
              <span className='hidden sm:inline'>{file.modified}</span>
            </div>
          </div>
        </CardContent>

        {/* Dropdown */}
        <div
          className={cn(
            "flex items-center transition-opacity",
            viewMode === "grid"
              ? "absolute top-2 right-2 opacity-0 group-hover:opacity-100"
              : "pr-3"
          )}
        >
          {(isSelected || viewMode === "list") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='p-1.5 rounded-full bg-white/80 backdrop-blur hover:bg-black/10 transition'
                  onClick={(e) => e.stopPropagation()}
                  aria-label='File actions'
                >
                  <MoreVertical className='w-5 h-5 text-gray-600' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                onClick={(e) => e.stopPropagation()}
                className='min-w-[180px] rounded-xl shadow-lg border bg-white'
              >
                {["png", "jpg", "jpeg", "gif", "webp"].includes(file.type) && (
                  <DropdownMenuItem onClick={handlePreview}>
                    👁 Preview
                  </DropdownMenuItem>
                )}
                {["pdf", "docx", "xlsx"].includes(file.type) && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/editor/${file.id}`)}
                  >
                    📝 Open with Editor
                  </DropdownMenuItem>
                )}
                {["xlsx"].includes(file.type) && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/excel-editor/${file.id}`)}
                  >
                    📝 Edit Excel file
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => handleDownload(file.id, file.name)}
                >
                  ⬇️ Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className='text-destructive hover:bg-destructive/10'
                >
                  🗑 Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Card>

      {/* Image Lightbox */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[{ src: file.fileUrl }]}
        />
      )}

      {/* Modal Delete */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{file.name}”?</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-500 mb-4'>
            Are you sure you want to delete this file? This action cannot be
            undone.
          </p>
          <DialogFooter className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={async () => {
                await handleDelete(file.id);
                setShowDeleteConfirm(false);
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
