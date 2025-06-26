"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCard from "./file-card";

export type DashboardFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  modified: string;
  starred: boolean;
  thumbnail?: string;
};

type FileListProps = {
  viewMode: "grid" | "list";
  files: DashboardFile[];
  onDelete?: (fileId: string) => Promise<void>;
};

export default function FileList({ viewMode, files, onDelete }: FileListProps) {
  const sortByDateDesc = (arr: DashboardFile[]) =>
    [...arr].sort(
      (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
    );

  const fileTabs: Record<string, DashboardFile[]> = {
    all: sortByDateDesc(files),
    pdf: sortByDateDesc(
      files.filter((file) => file.name.toLowerCase().endsWith(".pdf"))
    ),
    docx: sortByDateDesc(
      files.filter((file) => file.name.toLowerCase().endsWith(".docx"))
    ),
    excel: sortByDateDesc(
      files.filter((file) =>
        [".xls", ".xlsx"].some((ext) => file.name.toLowerCase().endsWith(ext))
      )
    ),
    image: sortByDateDesc(files.filter((file) => file.type === "image")),
  };

  const renderFiles = (list: DashboardFile[]) =>
    viewMode === "grid" ? (
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {list.map((file, idx) => (
          <FileCard
            key={file.id ? `file-${file.id}` : `file-idx-${idx}`}
            file={file}
            viewMode={viewMode}
            onDelete={onDelete}
          />
        ))}
      </div>
    ) : (
      <div className='space-y-2'>
        {list.map((file, idx) => (
          <FileCard
            key={file.id ? `file-${file.id}` : `file-idx-${idx}`}
            file={file}
            viewMode={viewMode}
            onDelete={onDelete}
          />
        ))}
      </div>
    );

  return (
    <Tabs defaultValue='all' className='space-y-4'>
      <TabsList>
        {Object.keys(fileTabs).map((key) => (
          <TabsTrigger key={`trigger-${key}`} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(fileTabs).map(([key, list]) => (
        <TabsContent key={`content-${key}`} value={key} className='space-y-4'>
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
