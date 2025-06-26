"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCard from "./file-card";

type File = {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string; // ISO date string
  starred: boolean;
  thumbnail?: string;
};

type FileListProps = {
  viewMode: "grid" | "list";
  files: File[];
};

export default function FileList({ viewMode, files }: FileListProps) {
  // Sort by most recent first
  const sortByDateDesc = (arr: File[]) =>
    [...arr].sort(
      (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
    );

  const fileTabs: Record<string, File[]> = {
    all: sortByDateDesc(files),
    documents: sortByDateDesc(files.filter((file) => file.type === "document")),
    images: sortByDateDesc(files.filter((file) => file.type === "image")),
    videos: sortByDateDesc(files.filter((file) => file.type === "video")),
    archives: sortByDateDesc(files.filter((file) => file.type === "archive")),
  };

  const renderFiles = (list: File[]) =>
    viewMode === "grid" ? (
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {list.map((file) => (
          <FileCard key={file.id} file={file} viewMode={viewMode} />
        ))}
      </div>
    ) : (
      <div className='space-y-2'>
        {list.map((file) => (
          <FileCard key={file.id} file={file} viewMode={viewMode} />
        ))}
      </div>
    );

  return (
    <Tabs defaultValue='all' className='space-y-4'>
      <TabsList>
        {Object.keys(fileTabs).map((key) => (
          <TabsTrigger key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(fileTabs).map(([key, list]) => (
        <TabsContent key={key} value={key} className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              {key.charAt(0).toUpperCase() + key.slice(1)} ({list.length})
            </h2>
            <Badge variant='secondary'>{list.length} files</Badge>
          </div>
          {renderFiles(list)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
