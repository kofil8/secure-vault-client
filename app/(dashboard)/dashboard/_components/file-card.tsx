"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type FileProps = {
  file: {
    id: string; // updated to string
    name: string;
    type: string;
    size: string;
    modified: string;
    starred: boolean;
    thumbnail?: string;
  };
  viewMode: "grid" | "list";
};

export default function FileCard({ file, viewMode }: FileProps) {
  const { name, type, size, modified, starred, thumbnail } = file;

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
            <img
              src={thumbnail}
              alt={name}
              className='w-12 h-12 object-cover rounded-md'
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
            <div className='text-sm'>{size}</div>
            <div className='text-sm'>{modified}</div>
            {starred && <Star className='w-4 h-4 text-yellow-500' />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
