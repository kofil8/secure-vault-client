"use client";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css"; // Import Handsontable's styles
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

const ExcelEditor: React.FC = () => {
  const [workbook, setWorkbook] = useState<any>(null);
  const [sheetData, setSheetData] = useState<any>([]);
  const hotRef = useRef<any>(null); // To reference the Handsontable instance
  const [handsontableInstance, setHandsontableInstance] =
    useState<Handsontable | null>(null);

  useEffect(() => {
    const loadExcelFile = async () => {
      try {
        const url = "http://localhost:7001/uploads/Venom.xlsx";
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        // Read the Excel file with SheetJS
        const wb = XLSX.read(arrayBuffer, { type: "array" });

        // Assuming the first sheet is the one we want to display
        const sheet = wb.Sheets[wb.SheetNames[0]];

        // Convert sheet data to JSON format for easy manipulation
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays (rows and cells)
        setWorkbook(wb);
        setSheetData(jsonData);

        // Initialize Handsontable with the loaded data (if not already initialized)
        if (!handsontableInstance && hotRef.current) {
          const hot = new Handsontable(hotRef.current, {
            data: jsonData,
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            licenseKey: "non-commercial-and-evaluation",
            afterChange: (changes: any) => {
              // After a change in the table, update the sheetData and workbook
              if (changes) {
                const updatedData = [...sheetData]; // Make a copy of the data
                changes.forEach(([row, col, oldValue, newValue]) => {
                  updatedData[row][col] = newValue;
                });
                setSheetData(updatedData); // Update state with new data
              }
            },
            undo: true, // Enable undo/redo
            copyPaste: true, // Enable copy/paste
            columnSorting: true, // Enable column sorting
            wordWrap: true, // Enable word wrap for cells
            manualColumnResize: true, // Allow column resizing
            manualRowResize: true, // Allow row resizing
            mergeCells: true, // Allow merging cells
            filters: true, // Enable filtering
            toolbar: true, // Enable toolbar
            hiddenColumns: true, // Show/hide columns
            hiddenRows: true, // Show/hide rows
            allowInsertRow: true, // Allow row insertion
            allowInsertColumn: true, // Allow column insertion
            allowRemoveRow: true, // Allow row removal
            allowRemoveColumn: true, // Allow column removal
          });
          setHandsontableInstance(hot); // Store the instance for potential future use
        }
      } catch (error) {
        console.error("Error loading the Excel file:", error);
      }
    };

    loadExcelFile();
  }, [sheetData, handsontableInstance]); // Re-run this useEffect only when sheetData or handsontableInstance changes

  const handleDownload = () => {
    const updatedSheet = XLSX.utils.aoa_to_sheet(sheetData); // Convert back to sheet format
    const updatedWorkbook = { ...workbook };
    updatedWorkbook.Sheets[updatedWorkbook.SheetNames[0]] = updatedSheet;

    const wbout = XLSX.write(updatedWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([wbout], {
      bookType: "xlsx",
      type: "application/octet-stream",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited-file.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 p-6'>
      <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
        Excel Editor
      </h1>

      {/* Handsontable container */}
      <div
        ref={hotRef}
        className='w-full bg-white shadow-lg rounded-lg'
        style={{
          height: "calc(100vh - 200px)", // Full screen with space for header and button
          overflow: "hidden",
        }}
      />

      {/* Button to download the edited Excel file */}
      <div className='w-full p-4 mt-6'>
        <button
          onClick={handleDownload}
          className='w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200'
        >
          Download Edited File
        </button>
      </div>
    </div>
  );
};

export default ExcelEditor;
