"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, FileText, Plus, BarChart2, Folder } from "lucide-react";
import Navbar from "./_components/navbar";
import FileList from "./_components/file-list";
import Spinner from "./_components/ui/spinner";
import { getAllFiles } from "@/app/actions/get-all-files";
import { toast } from "sonner";
import { DashboardFile } from "./file-list-types";
import { createFile } from "@/app/actions/create-file";
import { motion } from "framer-motion";

export default function FileVaultDashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filetype, setFiletype] = useState<string>("");
  const [files, setFiles] = useState<DashboardFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageQuota] = useState(15 * 1024);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const allFiles = await getAllFiles({
          sortOrder: "desc",
          filetype,
          searchTerm: searchQuery,
        });
        setFiles(allFiles);
      } catch (err) {
        console.error("Failed to fetch files", err);
        toast.error("Failed to load files");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [filetype, searchQuery]);

  const handleFileDeleted = (deletedFileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== deletedFileId));
    toast.success("File deleted successfully");
  };

  const totalStorageMB = files.reduce((total, file) => {
    const sizeValue = parseFloat(file.size.split(" ")[0]);
    const unit = file.size.includes("MB") ? 1 : 0.001;
    return total + sizeValue * unit;
  }, 0);

  const storagePercentage = Math.min(
    100,
    (totalStorageMB / storageQuota) * 100
  );

  const getStorageBarColor = () => {
    if (storagePercentage <= 60) return "bg-green-500";
    if (storagePercentage <= 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleCreateFile = async (type: "docx" | "xlsx" | "pdf") => {
    setIsCreating(true);
    const result = await createFile(type);
    if (result.success) {
      toast.success("File created successfully!");
    } else {
      toast.error(result.message);
    }
    setIsCreating(false);
    setShowModal(false);
  };

  return (
    <div className='flex flex-col h-full bg-background text-foreground'>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filetype={filetype}
        setFiletype={setFiletype}
        setShowFilters={setShowFiltersModal}
      />

      {showFiltersModal && (
        <div className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center'>
          <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-[90vw] max-w-sm space-y-4'>
            <h3 className='text-lg font-semibold text-center'>Filter Files</h3>
            <button
              onClick={() => setShowFiltersModal(false)}
              className='w-full mt-4 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-all'
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className='flex-1 space-y-4 px-3 py-4 sm:px-6 lg:px-8 xl:px-10 overflow-auto'>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='h-full'
          >
            <Card className='h-full flex flex-col justify-between hover:shadow-md transition-shadow bg-card rounded-2xl border border-border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-semibold'>
                  Total Files
                </CardTitle>
                <FileText className='h-5 w-5 text-muted-foreground' />
              </CardHeader>
              <CardContent className='mt-auto'>
                <div className='text-3xl font-bold'>{files.length}</div>
                <p className='text-xs text-muted-foreground'>
                  {viewMode === "grid" ? "Grid view" : "List view"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className='h-full'
          >
            <Card className='h-full flex flex-col justify-between hover:shadow-md transition-shadow bg-card rounded-2xl border border-border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-semibold'>
                  Storage Used
                </CardTitle>
                <Archive className='h-5 w-5 text-muted-foreground' />
              </CardHeader>
              <CardContent className='mt-auto'>
                <div className='text-3xl font-bold'>
                  {totalStorageMB.toFixed(2)} MB
                </div>
                <div className='w-full bg-muted rounded-full h-2 mt-2'>
                  <div
                    className={`${getStorageBarColor()} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {storagePercentage.toFixed(1)}% of {storageQuota}MB used
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className='h-full'
          >
            <Card className='h-full flex flex-col justify-between hover:shadow-md transition-shadow bg-card rounded-2xl border border-border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-semibold'>
                  Active Projects
                </CardTitle>
                <BarChart2 className='h-5 w-5 text-muted-foreground' />
              </CardHeader>
              <CardContent className='mt-auto'>
                <div className='text-3xl font-bold'>8</div>
                <p className='text-xs text-muted-foreground'>Ongoing tasks</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className='h-full'
          >
            <Card className='h-full flex flex-col justify-between hover:shadow-md transition-shadow bg-card rounded-2xl border border-border'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-semibold'>
                  Archived
                </CardTitle>
                <Folder className='h-5 w-5 text-muted-foreground' />
              </CardHeader>
              <CardContent className='mt-auto'>
                <div className='text-3xl font-bold'>12</div>
                <p className='text-xs text-muted-foreground'>Completed items</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Spinner />
          </div>
        ) : (
          <FileList
            viewMode={viewMode}
            files={files}
            searchQuery={searchQuery}
            onFileDeleted={handleFileDeleted}
          />
        )}
      </div>

      <div className='fixed bottom-8 right-8 group'>
        <button
          onClick={() => setShowModal(true)}
          className='relative bg-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200'
        >
          <Plus className='h-6 w-6' />
          <span className='absolute top-1/2 right-full mr-3 transform -translate-y-1/2 text-sm px-2 py-1 bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity'>
            New File
          </span>
        </button>
      </div>

      {showModal && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
          onClick={() => setShowModal(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-xl shadow-2xl w-[90vw] max-w-sm space-y-4'
          >
            <h2 className='text-lg font-semibold text-center'>
              Select File Type
            </h2>
            <div className='flex flex-col space-y-2'>
              <button
                onClick={() => handleCreateFile("docx")}
                className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all'
                disabled={isCreating}
              >
                DOCX
              </button>
              <button
                onClick={() => handleCreateFile("xlsx")}
                className='bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all'
                disabled={isCreating}
              >
                Excel
              </button>
              <button
                onClick={() => handleCreateFile("pdf")}
                className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all'
                disabled={isCreating}
              >
                PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
