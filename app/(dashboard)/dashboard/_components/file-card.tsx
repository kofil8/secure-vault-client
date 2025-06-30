import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreVertical, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox"; // Import Lightbox
import "yet-another-react-lightbox/styles.css"; // Import Lightbox CSS
import { handleDownload } from "@/app/actions/download-file";
import { deleteFile } from "@/app/actions/delete-file";

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
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Lightbox open state

  // Function to handle image preview in Lightbox
  const handlePreview = () => {
    const previewUrl = file.fileUrl;

    if (file.type === "pdf") {
      // For PDFs, use Google Docs Viewer
      const googleDocsViewerUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
        previewUrl
      )}`;
      window.open(googleDocsViewerUrl, "_blank");
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // For DOCX files, use Google Docs Viewer
      const googleDocsViewerUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
        previewUrl
      )}`;
      window.open(googleDocsViewerUrl, "_blank");
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      // For Excel files, use Google Sheets Viewer
      const googleSheetsViewerUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRhdg4z8xGgxtTxNB9v7DNFdo7b0doYnh5Wjlh7wVJ9OkDpSy1qA0l78L1wvu9UuxtDnlvW_1NVwghZ/pub?output=xlsx`;
      window.open(googleSheetsViewerUrl, "_blank");
    } else if (
      file.type === "png" ||
      file.type === "jpg" ||
      file.type === "jpeg" ||
      file.type === "gif" ||
      file.type === "webp"
    ) {
      setIsOpen(true); // Open lightbox for image preview
    } else {
      toast.error("Preview not available for this file type.");
    }
  };

  // Function to handle file deletion
  const handleDelete = async (fileId: string) => {
    try {
      const result = await deleteFile(fileId);

      if (result.success) {
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

  return (
    <div
      className={cn(
        "relative group",
        viewMode === "grid" ? "h-full" : "w-full"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all border-2",
          isSelected ? "border-primary bg-primary/10" : "border-transparent",
          viewMode === "grid"
            ? "hover:border-primary/40 hover:shadow-lg flex flex-col"
            : "hover:bg-muted/70 flex-row items-center"
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative flex items-center justify-center bg-muted rounded-lg shadow-sm",
            viewMode === "grid"
              ? "aspect-square w-full mb-2"
              : "w-12 h-12 min-w-[3rem] mx-3 my-2"
          )}
        >
          {file.thumbnail &&
          (file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/jpeg" ||
            file.type === "image/webp") ? (
            <Image
              src={file.thumbnail}
              alt={file.name}
              fill
              className='object-cover rounded-lg'
              sizes={
                viewMode === "grid"
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  : "48px"
              }
            />
          ) : (
            <span role='img' aria-label='File' className='text-3xl'>
              📁
            </span>
          )}
        </div>

        {/* File Info */}
        <CardContent
          className={cn(
            "flex-1 min-w-0 p-2",
            viewMode === "grid"
              ? "flex flex-col items-start"
              : "flex items-center justify-between"
          )}
        >
          <div className='min-w-0'>
            <h3 className='text-base font-semibold truncate text-foreground'>
              {file.name}
            </h3>
            <p
              className={cn(
                "text-xs text-muted-foreground",
                viewMode === "grid" ? "truncate mt-1" : "mr-2"
              )}
            >
              {file.size}
              {viewMode === "grid" && <> • {file.modified}</>}
            </p>
          </div>
        </CardContent>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center transition-opacity",
            viewMode === "grid"
              ? "absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100"
              : "pr-3"
          )}
        >
          {(isHovered || isSelected || viewMode === "list") && (
            <>
              {file.starred && (
                <Star className='w-5 h-5 text-yellow-500 fill-yellow-500 mr-1' />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className='p-1 rounded-full hover:bg-muted transition-colors'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className='w-5 h-5 text-muted-foreground' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  onClick={(e) => e.stopPropagation()}
                  className='min-w-[160px]'
                >
                  <DropdownMenuItem onClick={handlePreview}>
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDownload(file.id, file.name)}
                  >
                    Download
                  </DropdownMenuItem>
                  {showDeleteConfirm ? (
                    <DropdownMenuItem
                      className='text-destructive focus:bg-destructive/10'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                    >
                      Confirm Delete
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </Card>

      {/* Conditionally Render Lightbox for Image Preview */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[
            {
              src: file.fileUrl, // Use the correct file URL from backend
            },
          ]}
        />
      )}
    </div>
  );
}
