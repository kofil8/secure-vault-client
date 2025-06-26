"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Calendar, FileText } from "lucide-react";
import Navbar from "./_components/navbar";
import FileList from "./_components/file-list";
import { getAllFiles } from "@/app/actions/get-all-files";
import Spinner from "./_components/ui/spinner";

type File = {
  id: number;
  name: string;
  type: string;
  size: string;
  modified: string;
  starred: boolean;
  thumbnail: string;
};

export default function FileVaultDashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      const allFiles = await getAllFiles();
      setFiles(allFiles);
      setIsLoading(false);
    };

    fetchFiles();
  }, []);

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className='flex-1 space-y-4 p-4 md:p-6'>
        {/* Stats Cards */}
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Files</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{files.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Storage Used
              </CardTitle>
              <Archive className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>2.1 GB</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Recent Activity
              </CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>24</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <FileList
            viewMode={viewMode}
            searchQuery={searchQuery}
            files={files}
          />
        )}
      </div>
    </>
  );
}
