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
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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
    googleDocId?: string;
    googleSheetId?: string;
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
  const [isOpen, setIsOpen] = useState(false);

  const handlePreview = () => {
    const previewUrl = file.fileUrl;
    if (file.type === "pdf" || file.type === "docx") {
      const googleDocsViewerUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
        previewUrl
      )}`;
      window.open(googleDocsViewerUrl, "_blank");
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "xlsx"
    ) {
      const googleSheetsViewerUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRhdg4z8xGgxtTxNB9v7DNFdo7b0doYnh5Wjlh7wVJ9OkDpSy1qA0l78L1wvu9UuxtDnlvW_1NVwghZ/pub?output=xlsx`;
      window.open(googleSheetsViewerUrl, "_blank");
    } else if (
      file.type === "png" ||
      file.type === "jpg" ||
      file.type === "jpeg" ||
      file.type === "gif" ||
      file.type === "webp"
    ) {
      setIsOpen(true);
    } else {
      toast.error("Preview not available for this file type.");
    }
  };

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

  const handleOpenWithEditor = async (fileId: string) => {
    try {
      // Fetch the editor config from your backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/editor-config/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.data) {
        const { document, editorConfig } = data.data;

        // Open the file in OnlyOffice Editor (URL from OnlyOffice Cloud)
        const editorUrl = `https://documentserver.onlyoffice.com/editor/embedded?url=${encodeURIComponent(
          document.url
        )}&user=${encodeURIComponent(editorConfig.user.name)}`;

        // Open the editor in a new tab
        window.open(editorUrl, "_blank");
      } else {
        toast.error("Unable to generate the editor link.");
      }
    } catch (error) {
      toast.error("An error occurred while opening the file.");
      console.error(error);
    }
  };

  // Helper for file type icons
  const getFileIcon = () => {
    if (
      file.type === "png" ||
      file.type === "jpg" ||
      file.type === "jpeg" ||
      file.type === "gif" ||
      file.type === "webp"
    )
      return <span className='text-3xl'>🏞️</span>;
    if (file.type === "pdf") return <span className='text-3xl'>📄</span>;
    if (file.type === "docx") return <span className='text-3xl'>📝</span>;
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "xlsx"
    )
      return <span className='text-3xl'>📊</span>;
    return <span className='text-3xl'>📁</span>;
  };

  return (
    <div
      className={cn(
        "relative group transition-shadow",
        viewMode === "grid" ? "h-full" : "w-full"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all border-2 shadow-sm bg-white hover:shadow-xl",
          isSelected ? "border-primary bg-primary/10" : "border-muted",
          viewMode === "grid"
            ? "hover:border-primary/40 flex flex-col"
            : "hover:bg-muted/70 flex-row items-center"
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative flex items-center justify-center bg-muted rounded-lg shadow-sm border border-muted-foreground/10",
            viewMode === "grid"
              ? "aspect-square w-full mb-2"
              : "w-14 h-14 min-w-[3.5rem] mx-4 my-2"
          )}
        >
          {getFileIcon()}
          {file.starred && (
            <Star className='absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-yellow-400 drop-shadow' />
          )}
        </div>

        {/* File Info */}
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
              className='text-base font-semibold truncate text-foreground'
              title={file.name}
            >
              {file.name.length > 30
                ? file.name.slice(0, 27) + "..."
                : file.name}
            </h3>
            <div
              className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground mt-1",
                viewMode === "grid" ? "truncate" : ""
              )}
            >
              <span>{file.size}</span>
              <span className='hidden sm:inline'>•</span>
              <span className='hidden sm:inline'>{file.modified}</span>
            </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary'
                  onClick={(e) => e.stopPropagation()}
                  aria-label='File actions'
                >
                  <MoreVertical className='w-5 h-5 text-muted-foreground' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                onClick={(e) => e.stopPropagation()}
                className='min-w-[180px] rounded-lg shadow-lg border bg-white'
              >
                <DropdownMenuItem
                  className='hover:bg-primary/10 cursor-pointer'
                  onClick={handlePreview}
                >
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='hover:bg-primary/10 cursor-pointer'
                  onClick={() => handleOpenWithEditor(file.id)}
                >
                  Open with Editor
                </DropdownMenuItem>

                <DropdownMenuItem
                  className='hover:bg-primary/10 cursor-pointer'
                  onClick={() => handleDownload(file.id, file.name)}
                >
                  Download
                </DropdownMenuItem>
                {showDeleteConfirm ? (
                  <>
                    <DropdownMenuItem
                      className='text-destructive focus:bg-destructive/10 font-semibold'
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleDelete(file.id);
                        setShowDeleteConfirm(false);
                      }}
                    >
                      Confirm Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='hover:bg-muted cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(false);
                      }}
                    >
                      Cancel
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    className='hover:bg-destructive/10 text-destructive cursor-pointer'
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Card>

      {/* Lightbox for Image Preview */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[
            {
              src: file.fileUrl,
            },
          ]}
        />
      )}
    </div>
  );
}
