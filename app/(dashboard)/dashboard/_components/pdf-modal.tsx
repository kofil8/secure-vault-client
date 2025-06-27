"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "@/styles/react-pdf/AnnotationLayer.css";
import "@/styles/react-pdf/TextLayer.css";

import { X } from "lucide-react";
import { useState } from "react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PDFModalProps = {
  url: string;
  onClose: () => void;
};

export default function PDFModal({ url, onClose }: PDFModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center'>
      <div className='bg-white rounded-md shadow-xl p-4 relative max-w-4xl w-full h-[90vh] overflow-auto'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-600 hover:text-black'
        >
          <X className='w-5 h-5' />
        </button>

        {/* PDF Viewer */}
        <div className='flex flex-col items-center mt-8'>
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => console.error("PDF load error:", err)}
            loading={<div>Loading PDF...</div>}
            error={<div className='text-red-500'>Failed to load PDF.</div>}
          >
            <Page pageNumber={pageNumber} width={600} />
          </Document>

          {/* Pagination Controls */}
          <div className='flex gap-3 items-center justify-center mt-4'>
            <button
              className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
            >
              Prev
            </button>
            <span className='text-sm'>
              Page {pageNumber} of {numPages}
            </span>
            <button
              className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
