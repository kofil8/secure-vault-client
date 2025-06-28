import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star } from "lucide-react";
import Image from "next/image";
import FileIcon from "@/components/ui/FileIcon";
import { deleteFile } from "@/app/actions/delete-file";

// Define the FileCard props
type FileProps = {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
    starred: boolean;
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

  // State to store the iframe source (OnlyOffice URL)
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  // Function to handle editing the file in OnlyOffice
  const handleEditInOnlyOffice = async (fileId: string) => {
    try {
      // Call the backend to get the editor config for OnlyOffice
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/onlyoffice/config/${fileId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        const { document } = data.data.editorConfig;
        // Set the iframe source to the document URL from OnlyOffice
        setIframeSrc(document.url);
      } else {
        toast.error("Failed to load editor config.");
      }
    } catch {
      toast.error("Error opening the file in OnlyOffice.");
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
          isSelected ? "border-primary bg-primary/5" : "border-transparent",
          viewMode === "grid"
            ? "hover:border-gray-300 hover:shadow-md flex flex-col"
            : "hover:bg-muted/50 flex-row items-center"
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative bg-muted flex items-center justify-center",
            viewMode === "grid"
              ? "aspect-square w-full"
              : "w-10 h-10 min-w-[2.5rem] mx-2"
          )}
        >
          {file.thumbnail ? (
            <Image
              src={file.thumbnail}
              alt={file.name}
              fill
              className='object-cover'
              sizes={
                viewMode === "grid"
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  : "48px"
              }
            />
          ) : (
            <FileIcon
              type={file.type}
              className='w-5 h-5 text-muted-foreground'
            />
          )}
        </div>

        {/* File Info */}
        <CardContent
          className={cn(
            "flex-1 min-w-0 p-2",
            viewMode === "grid"
              ? "flex flex-col"
              : "flex items-center justify-between"
          )}
        >
          <div className='min-w-0'>
            <h3 className='text-sm font-medium truncate'>{file.name}</h3>
            <p
              className={cn(
                "text-xs text-muted-foreground",
                viewMode === "grid" ? "truncate mt-1" : "hidden"
              )}
            >
              {file.size} • {file.modified}
            </p>
          </div>
        </CardContent>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center transition-opacity",
            viewMode === "grid"
              ? "absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100"
              : "pr-2"
          )}
        >
          {(isHovered || isSelected || viewMode === "list") && (
            <>
              {file.starred && (
                <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className='p-1 rounded-full hover:bg-muted'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className='w-4 h-4 text-muted-foreground' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Add the Edit in OnlyOffice option */}
                  <DropdownMenuItem
                    onClick={() => handleEditInOnlyOffice(file.id)}
                  >
                    Edit in OnlyOffice
                  </DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  {showDeleteConfirm ? (
                    <DropdownMenuItem
                      className='text-destructive focus:bg-destructive/10'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id); // Call delete function
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

      {/* Conditionally Render Iframe */}
      {iframeSrc && (
        <div className='w-full mt-4'>
          <iframe
            src={iframeSrc}
            width='100%'
            height='600'
            style={{ border: "none" }}
            title='OnlyOffice Editor'
          ></iframe>
        </div>
      )}
    </div>
  );
}
