import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreVertical, Star } from "lucide-react";
import Image from "next/image";
import {
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
import { toast } from "sonner";
import { deleteFile } from "@/app/actions/delete-file";
import Lightbox from "yet-another-react-lightbox"; // Import Lightbox
import "yet-another-react-lightbox/styles.css"; // Import Lightbox CSS
import { Document, Page } from "react-pdf"; // For PDF preview
import { PDFDownloadLink, pdf } from "@react-pdf/renderer"; // Import the PDF renderer

type FileProps = {
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    modified: string;
    starred: boolean;
    thumbnail?: string;
  };
  viewMode: "grid" | "list";
  isSelected?: boolean;
  onSelect?: () => void;
  onDeleteSuccess: (fileId: string) => void;
  onDeleteError: (error: unknown) => void;
};

function getFileIcon(type: string) {
  if (type === "application/pdf")
    return <FaFilePdf className='w-8 h-8 text-red-500' />;
  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type === "application/msword"
  )
    return <FaFileWord className='w-8 h-8 text-blue-500' />;
  if (
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "application/vnd.ms-excel"
  )
    return <FaFileExcel className='w-8 h-8 text-green-600' />;
  if (type.startsWith("image/"))
    return <FaFileImage className='w-8 h-8 text-yellow-500' />;
  return <FaFileAlt className='w-8 h-8 text-gray-400' />;
}

const MyDocument = ({ fileUrl }: { fileUrl: string }) => (
  <Document file={fileUrl}>
    <Page pageNumber={1} />
  </Document>
);

export default function FileCard({
  file,
  viewMode,
  isSelected,
  onSelect,
  onDeleteSuccess,
  onDeleteError,
}: FileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Lightbox open state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // To store PDF URL for preview

  useEffect(() => {
    // Generate the PDF using `@react-pdf/renderer`
    if (file.type === "application/pdf") {
      const generatePdf = async () => {
        // Create PDF blob and URL
        const blob = await pdf(<MyDocument fileUrl={file.name} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      };
      generatePdf();
    }
  }, [file]);

  // Function to handle editing the file in OnlyOffice
  const handleEditInOnlyOffice = async (fileId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/onlyoffice/config/${fileId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        const { document } = data.data.editorConfig;
        window.open(document.url, "_blank");
      } else {
        toast.error("Failed to load editor config.");
      }
    } catch {
      toast.error("Error opening the file in OnlyOffice.");
    }
  };

  // Function to handle file deletion
  const handleDelete = async (fileId: string) => {
    try {
      const result = await deleteFile(fileId);

      if (result.success) {
        onDeleteSuccess(fileId);
        toast.success(result.message);
      } else {
        onDeleteError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      onDeleteError(error);
      toast.error("An error occurred while deleting the file.");
    }
  };

  // Handle file preview
  const handlePreview = () => {
    const previewUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${file.name}`;
    console.log("Preview URL:", previewUrl); // Log URL for debugging

    // Handle file types based on MIME type
    if (file.type === "application/pdf") {
      setPdfUrl(previewUrl); // Set the PDF URL
    } else if (file.type.startsWith("image/")) {
      setIsOpen(true); // Open lightbox for image preview
    } else {
      toast.error("Preview not available for this file type.");
    }
  };

  return (
    <div
      className={cn(
        "relative group",
        viewMode === "grid" ? "h-full" : "w-full"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all border-2",
          isSelected ? "border-primary bg-primary/10" : "border-transparent",
          viewMode === "grid"
            ? "hover:border-primary/40 hover:shadow-lg flex flex-col"
            : "hover:bg-muted/70 flex-row items-center"
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative flex items-center justify-center bg-muted rounded-lg shadow-sm",
            viewMode === "grid"
              ? "aspect-square w-full mb-2"
              : "w-12 h-12 min-w-[3rem] mx-3 my-2"
          )}
        >
          {file.thumbnail &&
          (file.type.startsWith("image/png") ||
            file.type.startsWith("image/jpg") ||
            file.type.startsWith("image/jpeg") ||
            file.type.startsWith("image/webp")) ? (
            <Image
              src={file.thumbnail}
              alt={file.name}
              fill
              className='object-cover rounded-lg'
              sizes={
                viewMode === "grid"
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  : "48px"
              }
            />
          ) : (
            getFileIcon(file.type)
          )}
        </div>

        {/* File Info */}
        <CardContent
          className={cn(
            "flex-1 min-w-0 p-2",
            viewMode === "grid"
              ? "flex flex-col items-start"
              : "flex items-center justify-between"
          )}
        >
          <div className='min-w-0'>
            <h3 className='text-base font-semibold truncate text-foreground'>
              {file.name}
            </h3>
            <p
              className={cn(
                "text-xs text-muted-foreground",
                viewMode === "grid" ? "truncate mt-1" : "mr-2"
              )}
            >
              {file.size}
              {viewMode === "grid" && <> • {file.modified}</>}
            </p>
          </div>
        </CardContent>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center transition-opacity",
            viewMode === "grid"
              ? "absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100"
              : "pr-3"
          )}
        >
          {(isHovered || isSelected || viewMode === "list") && (
            <>
              {file.starred && (
                <Star className='w-5 h-5 text-yellow-500 fill-yellow-500 mr-1' />
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className='p-1 rounded-full hover:bg-muted transition-colors'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className='w-5 h-5 text-muted-foreground' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  onClick={(e) => e.stopPropagation()}
                  className='min-w-[160px]'
                >
                  <DropdownMenuItem onClick={handlePreview}>
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditInOnlyOffice(file.id)}
                  >
                    Edit in OnlyOffice
                  </DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  {showDeleteConfirm ? (
                    <DropdownMenuItem
                      className='text-destructive focus:bg-destructive/10'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                    >
                      Confirm Delete
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </Card>

      {/* Conditionally Render PDF Preview */}
      {pdfUrl && (
        <div className='absolute inset-0 z-10 bg-black/80 flex items-center justify-center'>
          <iframe src={pdfUrl} width='100%' height='100%' frameBorder='0' />
          {/* Download Link for PDF */}
          <div className='absolute bottom-5 left-5 bg-white p-2 rounded'>
            <PDFDownloadLink
              document={<MyDocument fileUrl={file.name} />}
              fileName={file.name}
              className='text-blue-500'
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download PDF"
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}

      {/* Conditionally Render Lightbox for Image Preview */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[
            {
              src: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${file.name}`,
            },
          ]} // Use image URL for lightbox
        />
      )}
    </div>
  );
}
