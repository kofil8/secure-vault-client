"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MoreVertical, FileText, FileType2, FileSpreadsheet, Image as ImageIcon} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  onDeleteError
}: FileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!file.id) {
      onDeleteError(new Error("Invalid file ID"));
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/files/${file.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete file");
      }

      onDeleteSuccess(file.id);
      toast.success("File deleted successfully");
    } catch (error) {
      onDeleteError(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
      <Card className={cn(
        "h-full overflow-hidden transition-all border-2",
        isSelected ? "border-primary bg-primary/5" : "border-transparent",
        viewMode === "grid" 
          ? "hover:border-gray-300 hover:shadow-md flex flex-col" 
          : "hover:bg-muted/50 flex-row items-center"
      )}>
        {/* Thumbnail */}
        <div className={cn(
          "relative bg-muted flex items-center justify-center",
          viewMode === "grid" 
            ? "aspect-square w-full" 
            : "w-10 h-10 min-w-[2.5rem] mx-2"
        )}>
          {file.thumbnail ? (
            <Image
              src={file.thumbnail}
              alt={file.name}
              fill
              className="object-cover"
              sizes={viewMode === "grid" ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "48px"}
            />
          ) : (
            <FileIcon type={file.type} className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {/* File Info */}
        <CardContent className={cn(
          "flex-1 min-w-0 p-2",
          viewMode === "grid" ? "flex flex-col" : "flex items-center justify-between"
        )}>
          <div className="min-w-0">
            <h3 className="text-sm font-medium truncate">{file.name}</h3>
            <p className={cn(
              "text-xs text-muted-foreground",
              viewMode === "grid" ? "truncate mt-1" : "hidden"
            )}>
              {file.size} • {file.modified}
            </p>
          </div>

          {/* List View Metadata */}
          {viewMode === "list" && (
            <div className="hidden md:flex items-center gap-4 ml-4">
              <span className="text-sm text-muted-foreground min-w-[4rem]">
                {file.size}
              </span>
              <span className="text-sm text-muted-foreground min-w-[6rem]">
                {file.modified}
              </span>
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <div className={cn(
          "flex items-center transition-opacity",
          viewMode === "grid" 
            ? "absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100" 
            : "pr-2"
        )}>
          {(isHovered || isSelected || viewMode === "list") && (
            <>
              {file.starred && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-1 rounded-full hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  {showDeleteConfirm ? (
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10"
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
    </div>
  );
}

function FileIcon({ type, className }: { type: string; className?: string }) {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("image")) return <ImageIcon className={className} />;
  if (lowerType.includes("pdf")) return <FileText className={className} />;
  if (lowerType.includes("word") || lowerType.includes("document")) 
    return <FileType2 className={className} />;
  if (lowerType.includes("spreadsheet") || lowerType.includes("excel")) 
    return <FileSpreadsheet className={className} />;
  return <FileText className={className} />;
}