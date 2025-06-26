"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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
      className={cn(viewMode === "list" && "flex items-center justify-between")}
    >
      <CardContent
        className={cn(
          "p-4",
          viewMode === "grid" && "flex flex-col items-center space-y-2",
          viewMode === "list" && "w-full flex justify-between items-center"
        )}
      >
        {/* Thumbnail */}
        <div className='flex items-center space-x-4'>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={name}
              width={48}
              height={48}
              className='rounded-md object-cover'
            />
          ) : (
            <div className='w-12 h-12 bg-muted rounded-md' />
          )}
          <div>
            <div className='font-semibold'>{name}</div>
            <div className='text-sm text-muted-foreground capitalize'>
              {type}
            </div>
          </div>
        </div>

        {/* Metadata */}
        {viewMode === "list" && (
          <div className='flex items-center space-x-4'>
            <div className='text-sm'>{(size / 1024).toFixed(1)} KB</div>
            <div className='text-sm'>
              {new Date(modified).toLocaleDateString()}
            </div>
            {starred && <Star className='w-4 h-4 text-yellow-500' />}
            {onDelete && (
              <button
                onClick={handleDelete}
                className='text-sm text-red-500 hover:text-red-700 flex items-center gap-1'
              >
                <Trash className='w-4 h-4' />{" "}
                {confirmingDelete ? "Confirm" : "Delete"}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
