
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCard from "./file-card";

type FileListProps = {
  viewMode: "grid" | "list";
  searchQuery: string
};

// Mock data for files
const mockFiles = [
  {
    id: 1,
    name: "Project Proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "2 hours ago",
    starred: true,
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Design Assets.zip",
    type: "archive",
    size: "15.7 MB",
    modified: "1 day ago",
    starred: false,
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Meeting Recording.mp4",
    type: "video",
    size: "45.2 MB",
    modified: "3 days ago",
    starred: true,
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Logo Design.png",
    type: "image",
    size: "1.8 MB",
    modified: "1 week ago",
    starred: false,
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Budget Spreadsheet.xlsx",
    type: "document",
    size: "856 KB",
    modified: "2 weeks ago",
    starred: false,
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Presentation.pptx",
    type: "document",
    size: "12.3 MB",
    modified: "1 month ago",
    starred: true,
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
];

export default function FileList({ viewMode, searchQuery }: FileListProps) {

   

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Tabs defaultValue='all' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='all'>All Files</TabsTrigger>
        <TabsTrigger value='documents'>Documents</TabsTrigger>
        <TabsTrigger value='images'>Images</TabsTrigger>
        <TabsTrigger value='videos'>Videos</TabsTrigger>
        <TabsTrigger value='archives'>Archives</TabsTrigger>
      </TabsList>

      <TabsContent value='all' className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>
            All Files ({filteredFiles.length})
          </h2>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>
              {filteredFiles.length} files
            </Badge>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className='space-y-2'>
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} viewMode={viewMode} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}