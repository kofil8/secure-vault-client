"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type FileProps = {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    modified: string;
    starred: boolean;
    thumbnail?: string;
  };
  viewMode: "grid" | "list";
  onDelete?: (fileId: string) => Promise<void>;
};

export default function FileCard({ file, viewMode, onDelete }: FileProps) {
  const { id, name, type, size, modified, starred, thumbnail } = file;
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
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={name}
              width={48}
              height={48}
              className='rounded-md object-cover'
            />
          ) : (
            <div className='w-12 h-12 bg-gray-200 rounded-md' />
          )}

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

            {/* Editor Button */}
            {["docx", "xlsx", "pdf"].includes(type.toLowerCase()) && (
              <button
                onClick={() => window.open(`/editor/${id}`, "_blank")}
                className='text-xs text-blue-600 hover:underline mt-1 self-start'
              >
                Open with Editor
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {viewMode === "list" && (
          <div className='flex items-center gap-4 ml-auto'>
            {starred && (
              <span title='Starred'>
                <Star
                  className='w-4 h-4 text-yellow-500'
                  aria-label='Starred'
                />
              </span>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className='text-xs text-red-500 hover:underline flex items-center gap-1'
              >
                <Trash className='w-4 h-4' />
                {confirmingDelete ? "Confirm" : "Delete"}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
