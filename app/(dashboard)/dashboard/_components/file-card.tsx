"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star, Trash, MoreVertical, Download, FileEdit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import pdfIcon from "@/public/icons/pdf.png";
import docxIcon from "@/public/icons/docx.jpg";
import excelIcon from "@/public/icons/excel.png";
import imageIcon from "@/public/icons/image.png";
import fileIcon from "@/public/icons/file.png";

// Removed getThumbnailPreview import

type FileProps = {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    modified: string;
    starred: boolean;
    thumbnail?: string;
    downloadUrl?: string;
  };
  viewMode: "grid" | "list";
  onDelete?: (fileId: string) => Promise<void>;
};

export default function FileCard({ file, viewMode, onDelete }: FileProps) {
  const { id, name, type, size, modified, starred, downloadUrl, thumbnail } =
    file;
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    await onDelete(id);
  };

  const isEditable = ["pdf", "docx", "xlsx", "xls"].some((ext) =>
    name.toLowerCase().endsWith(ext)
  );

  const fallbackThumbnail = () => {
    if (name.toLowerCase().endsWith(".pdf")) return pdfIcon;
    if (name.toLowerCase().endsWith(".docx")) return docxIcon;
    if ([".xls", ".xlsx"].some((ext) => name.toLowerCase().endsWith(ext)))
      return excelIcon;
    if (
      [".png", ".jpg", ".jpeg", ".gif", ".webp"].some((ext) =>
        name.toLowerCase().endsWith(ext)
      )
    )
      return imageIcon;
    return fileIcon;
  };

  return (
    <Card
      className={cn(
        "group transition-shadow hover:shadow-md hover:border-primary border border-border rounded-2xl overflow-hidden",
        viewMode === "list" && "flex items-center justify-between"
      )}
    >
      <CardContent
        className={cn(
          "p-4",
          viewMode === "grid"
            ? "flex flex-col items-center space-y-3 text-center"
            : "w-full flex justify-between items-center"
        )}
      >
        {/* Thumbnail + File Info */}
        <div className='flex items-center gap-4 w-full'>
          <Image
            src={thumbnail || fallbackThumbnail()}
            alt={name}
            width={48}
            height={48}
            className='rounded-md object-cover'
          />

          <div className='flex flex-col'>
            <div className='font-medium text-sm truncate max-w-[200px]'>
              {name}
            </div>
            <div className='text-xs text-muted-foreground capitalize'>
              {type} • {(size / 1024).toFixed(1)} KB
            </div>
            <div className='text-xs text-muted-foreground'>
              Modified: {new Date(modified).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-4 ml-auto'>
          {viewMode === "list" && starred && (
            <span title='Starred'>
              <Star className='w-4 h-4 text-yellow-500' aria-label='Starred' />
            </span>
          )}

          {/* Dropdown Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='p-1 hover:bg-muted rounded-full'>
                <MoreVertical className='h-4 w-4' />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              side='bottom'
              align='end'
              className='bg-white border shadow-md rounded-md text-sm p-1 z-50'
            >
              <DropdownMenu.Item
                className='flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer'
                onClick={() =>
                  window.open(downloadUrl || thumbnail || "#", "_blank")
                }
              >
                <Download className='h-4 w-4' /> Download
              </DropdownMenu.Item>

              {isEditable && (
                <DropdownMenu.Item
                  className='flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer'
                  onClick={() => window.open(`/editor/${id}`, "_blank")}
                >
                  <FileEdit className='h-4 w-4' /> Open with OnlyOffice
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {viewMode === "list" && onDelete && (
            <button
              onClick={handleDelete}
              className='text-xs text-red-500 hover:underline flex items-center gap-1'
            >
              <Trash className='w-4 h-4' />
              {confirmingDelete ? "Confirm" : "Delete"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
