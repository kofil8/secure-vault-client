"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import {
  Archive,
  Download,
  Edit,
  Eye,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Music,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";

// Supported file types
const fileTypeIcons = {
  pdf: FileText,
  document: FileText,
  image: ImageIcon,
  audio: Music,
  archive: Archive,
};

type FileType = keyof typeof fileTypeIcons | string;

export default function FileCard({
  file,
  viewMode,
}: {
  file: {
    id: number;
    name: string;
    type: FileType;
    size: string;
    modified: string;
    starred: boolean;
    thumbnail?: string;
  };
  viewMode: "grid" | "list";
}) {
  const IconComponent =
    fileTypeIcons[file.type as keyof typeof fileTypeIcons] || FileText;

  if (viewMode === "list") {
    return (
      <div className='flex items-center gap-4 p-4 border border-black/10 rounded-lg hover:bg-muted/50 transition-colors'>
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          <div className='flex-shrink-0'>
            <IconComponent className='h-8 w-8 text-muted-foreground' />
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-medium truncate'>{file.name}</p>
            <p className='text-sm text-muted-foreground'>{file.size}</p>
          </div>
        </div>

        <div className='hidden sm:block text-sm text-muted-foreground whitespace-nowrap'>
          {file.modified}
        </div>

        <div className='flex items-center gap-2'>
          {file.starred && (
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-white border border-black/10 shadow-md'
            >
              <DropdownMenuItem>
                <Eye className='mr-2 h-4 w-4' /> View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className='mr-2 h-4 w-4' /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className='mr-2 h-4 w-4' /> Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive'>
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <Card className='group hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white border border-black/10'>
      <CardContent className='p-4'>
        <div className='aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center relative overflow-hidden'>
          {file.type === "image" ? (
            <Image
              src={file.thumbnail || "/placeholder.svg"}
              alt={file.name}
              width={100}
              height={100}
              className='w-full h-full object-cover'
            />
          ) : (
            <IconComponent className='h-12 w-12 text-muted-foreground' />
          )}
          {file.starred && (
            <Star className='absolute top-2 right-2 h-4 w-4 fill-yellow-400 text-yellow-400' />
          )}
        </div>
        <div className='space-y-1'>
          <p className='font-medium text-sm truncate'>{file.name}</p>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>{file.size}</span>
            <span className='hidden sm:inline'>{file.modified}</span>
          </div>
        </div>
        <div className='flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <Button variant='ghost' size='sm' className='hover:bg-black/5'>
            <Eye className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm' className='hover:bg-black/5'>
            <Edit className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm' className='hover:bg-black/5'>
            <Download className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm' className='hover:bg-black/5'>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
