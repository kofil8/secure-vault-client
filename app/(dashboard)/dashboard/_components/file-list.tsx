"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCard from "./file-card";

type File = {
  id: number;
  name: string;
  type: string;
  size: string;
  modified: string;
  starred: boolean;
  thumbnail: string;
};

type FileListProps = {
  viewMode: "grid" | "list";
  searchQuery: string;
  files: File[];
};

export default function FileList({
  viewMode,
  searchQuery,
  files,
}: FileListProps) {
  const filterByQuery = (files: File[]) =>
    files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const fileTabs = {
    all: files,
    documents: files.filter((file) => file.type === "document"),
    images: files.filter((file) => file.type === "image"),
    videos: files.filter((file) => file.type === "video"),
    archives: files.filter((file) => file.type === "archive"),
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

      {Object.entries(fileTabs).map(([key, list]) => {
        const filtered = filterByQuery(list);
        return (
          <TabsContent key={key} value={key} className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>
                {key.charAt(0).toUpperCase() + key.slice(1)} ({filtered.length})
              </h2>
              <Badge variant='secondary'>{filtered.length} files</Badge>
            </div>
            {renderFiles(filtered)}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
