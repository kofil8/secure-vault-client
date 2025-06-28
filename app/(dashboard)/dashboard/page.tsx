"use client"; // Marking this file as a client component to use hooks like `useState`

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, FileText } from "lucide-react";
import Navbar from "./_components/navbar";
import FileList from "./_components/file-list";
import Spinner from "./_components/ui/spinner";
import { getAllFiles } from "@/app/actions/get-all-files";
import { toast } from "sonner";
import { DashboardFile } from "./file-list-types";
import { Plus } from "lucide-react"; // Import the Plus icon for the floating button
import { createFile } from "@/app/actions/create-file"; // Import the createFile action

export default function FileVaultDashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<DashboardFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageQuota] = useState(15 * 1024); // 15GB in MB
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal
  const [isCreating, setIsCreating] = useState(false); // State to manage loading during file creation

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const allFiles = await getAllFiles("desc");
        setFiles(allFiles);
      } catch (err) {
        console.error("Failed to fetch files", err);
        toast.error("Failed to load files");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []); // Run only once after the initial render

  const handleFileDeleted = (deletedFileId: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== deletedFileId)
    );
    toast.success("File deleted successfully");
  };

  const totalStorageMB = files.reduce((total, file) => {
    const sizeValue = parseFloat(file.size.split(" ")[0]);
    const unit = file.size.includes("MB") ? 1 : 0.001; // Convert KB to MB if needed
    return total + sizeValue * unit;
  }, 0);

  const storagePercentage = Math.min(
    100,
    (totalStorageMB / storageQuota) * 100
  );

  // Handle file creation using the action
  const handleCreateFile = async (type: "docx" | "xlsx" | "pdf") => {
    setIsCreating(true);

    // Call the createFile action
    const result = await createFile(type);

    if (result.success) {
      const fileUrl = result.fileUrl;

      // Create a link to download the file
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileUrl.split("/").pop(); // Extracts filename from URL
      a.click();

      toast.success("File created successfully!");
    } else {
      toast.error(result.message); // Display error message from action result
    }

    setIsCreating(false);
    setShowModal(false); // Close the modal after file creation
  };

  return (
    <div className='flex flex-col h-full'>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className='flex-1 space-y-4 p-4 md:p-6 overflow-auto'>
        {/* Storage Metrics */}
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='hover:shadow transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Files</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{files.length}</div>
              <p className='text-xs text-muted-foreground'>
                {viewMode === "grid" ? "Grid view" : "List view"}
              </p>
            </CardContent>
          </Card>

          <Card className='hover:shadow transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Storage Used
              </CardTitle>
              <Archive className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {totalStorageMB.toFixed(2)} MB
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                <div
                  className='bg-primary h-2 rounded-full'
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                {storagePercentage.toFixed(1)}% of {storageQuota}MB used
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File Display Area */}
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <Spinner />
          </div>
        ) : (
          <FileList
            viewMode={viewMode}
            files={files}
            searchQuery={searchQuery}
            onFileDeleted={handleFileDeleted} // Pass down the file delete handler
          />
        )}
      </div>

      {/* Floating "+" Button */}
      <div className='fixed bottom-10 right-10'>
        <button
          onClick={() => setShowModal(true)}
          className='bg-primary p-4 rounded-full text-white shadow-lg'
        >
          <Plus className='h-6 w-6' />
        </button>
      </div>

      {/* Modal to Select File Type */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Select File Type</h2>
            <div className='flex space-x-4'>
              <button
                onClick={() => handleCreateFile("docx")}
                className='bg-blue-500 text-white p-2 rounded'
                disabled={isCreating}
              >
                DOCX
              </button>
              <button
                onClick={() => handleCreateFile("xlsx")}
                className='bg-green-500 text-white p-2 rounded'
                disabled={isCreating}
              >
                Excel
              </button>
              <button
                onClick={() => handleCreateFile("pdf")}
                className='bg-red-500 text-white p-2 rounded'
                disabled={isCreating}
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
