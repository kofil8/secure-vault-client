"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Archive,
  Calendar,
  FileText,
  FileType2,
  FileSpreadsheet,
  ImageIcon,
} from "lucide-react";
import Navbar from "./_components/navbar";
import FileList from "./_components/file-list";
import Spinner from "./_components/ui/spinner";
import { DashboardFile } from "./_components/file-list";
import { getAllFiles } from "@/app/actions/get-all-files";
import { deleteFile } from "@/app/actions/delete-file";

export default function FileVaultDashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<DashboardFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortKey, setSortKey] = useState<"name" | "modified">("modified");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const allFiles = await getAllFiles("desc");
        setFiles(
          allFiles.map((file) => ({
            ...file,
            size: Number(file.size),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch files", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const totalStorageMB = (
    files.reduce((acc, file) => acc + file.size, 0) /
    (1024 * 1024)
  ).toFixed(2);

  const sortFiles = (arr: DashboardFile[]) =>
    [...arr].sort((a, b) =>
      sortKey === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b.modified).getTime() - new Date(a.modified).getTime()
    );

  const fileTabs = {
    all: sortFiles(files),
    pdf: sortFiles(files.filter((f) => f.name.toLowerCase().endsWith(".pdf"))),
    docx: sortFiles(
      files.filter((f) => f.name.toLowerCase().endsWith(".docx"))
    ),
    excel: sortFiles(
      files.filter((f) =>
        [".xls", ".xlsx"].some((ext) => f.name.toLowerCase().endsWith(ext))
      )
    ),
    image: sortFiles(files.filter((f) => f.type === "image")),
  };

  const sectionIcons: Record<string, JSX.Element> = {
    all: <FileText className='h-5 w-5 text-muted-foreground' />,
    pdf: <FileText className='h-5 w-5 text-muted-foreground' />,
    docx: <FileType2 className='h-5 w-5 text-muted-foreground' />,
    excel: <FileSpreadsheet className='h-5 w-5 text-muted-foreground' />,
    image: <ImageIcon className='h-5 w-5 text-muted-foreground' />,
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className='flex-1 space-y-4 p-4 md:p-6'>
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
              <div className='text-2xl font-bold'>{totalStorageMB} MB</div>
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

        <div className='flex justify-end'>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as "name" | "modified")}
            className='border rounded px-3 py-1 text-sm'
          >
            <option value='modified'>Sort by Date</option>
            <option value='name'>Sort by Name</option>
          </select>
        </div>

        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Spinner />
          </div>
        ) : (
          <div className='space-y-6'>
            {Object.entries(fileTabs).map(([key, list]) => (
              <div key={`section-${key}`} className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold flex items-center gap-2'>
                    {sectionIcons[key]} {key.toUpperCase()} ({list.length})
                  </h2>
                </div>
                <FileList
                  viewMode={viewMode}
                  files={list}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
