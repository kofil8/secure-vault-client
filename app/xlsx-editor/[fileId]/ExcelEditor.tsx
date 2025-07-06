"use client";

import { ExcelFileData, SheetEdits, SheetUpdate } from "@/app/types/excel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import * as ExcelJS from "exceljs";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ExcelEditorProps {
  fileId: string;
  onClose: () => void;
}

export default function ExcelEditor({ fileId, onClose }: ExcelEditorProps) {
  const [workbookData, setWorkbookData] = useState<ExcelFileData | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edits, setEdits] = useState<SheetEdits>({});

  const fetchExcelData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<ExcelFileData>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/excel/${fileId}`
      );

      if (!response.data?.sheets || response.data.sheets.length === 0) {
        throw new Error("Excel file contains no sheets");
      }

      setWorkbookData(response.data);
      setActiveSheet(response.data.sheets[0].name);
    } catch (err: any) {
      setError(err.message || "Failed to load Excel file");
      console.error("Error loading Excel file:", err);
      toast.error(err.message || "Failed to load Excel file");
    } finally {
      setIsLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    fetchExcelData();
  }, [fetchExcelData]);

  const handleCellChange = useCallback(
    (sheetName: string, rowIndex: number, colIndex: number, value: any) => {
      setEdits((prev) => ({
        ...prev,
        [sheetName]: {
          ...prev[sheetName],
          [rowIndex]: {
            ...prev[sheetName]?.[rowIndex],
            [colIndex]: value,
          },
        },
      }));
    },
    []
  );

  const saveChanges = useCallback(async () => {
    if (!workbookData || Object.keys(edits).length === 0) return;

    try {
      setIsSaving(true);
      setError(null);

      const sheetUpdates: SheetUpdate[] = workbookData.sheets.map((sheet) => {
        const sheetEdit = edits[sheet.name] || {};
        const updatedData = sheet.data ? [...sheet.data] : [];

        Object.entries(sheetEdit).forEach(([rowIdx, cols]) => {
          const rowIndex = parseInt(rowIdx);
          if (updatedData[rowIndex]) {
            Object.entries(cols).forEach(([colIdx, value]) => {
              const colIndex = parseInt(colIdx);
              if (colIndex < updatedData[rowIndex].length) {
                updatedData[rowIndex][colIndex] = value;
              }
            });
          }
        });

        return {
          name: sheet.name,
          data: updatedData,
        };
      });

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/excel/${fileId}`,
        { sheets: sheetUpdates }
      );

      toast.success("Changes saved successfully");
      await fetchExcelData(); // Refresh data
      setEdits({});
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save changes");
      console.error("Error saving Excel file:", err);
      toast.error(err.response?.data?.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }, [edits, fileId, workbookData, fetchExcelData]);

  const exportToExcel = useCallback(async () => {
    if (!workbookData) return;

    try {
      setIsExporting(true);
      setError(null);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "My Drive Clone";
      workbook.created = new Date();

      workbookData.sheets.forEach((sheet) => {
        const worksheet = workbook.addWorksheet(sheet.name);

        // Add all rows with data
        sheet.data?.forEach((row) => {
          worksheet.addRow(row);
        });

        // Auto-size columns
        worksheet.columns.forEach((column) => {
          if (column.values) {
            const maxLength = column.values.reduce(
              (max, value) => Math.max(max, (value?.toString() || "").length),
              10
            );
            column.width = Math.min(Math.max(maxLength + 2, 10), 50);
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${workbookData.fileName.replace(
        /\.[^/.]+$/,
        ""
      )}_edited.xlsx`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast.success("Excel file exported successfully");
    } catch (err: any) {
      setError("Failed to export file");
      console.error("Error exporting Excel:", err);
      toast.error("Failed to export file");
    } finally {
      setIsExporting(false);
    }
  }, [workbookData]);

  const currentSheet = workbookData?.sheets.find((s) => s.name === activeSheet);

  if (isLoading) {
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        {error}
        <Button onClick={fetchExcelData} className='ml-4' variant='outline'>
          Retry
        </Button>
      </div>
    );
  }

  if (!workbookData || !currentSheet) {
    return (
      <div className='p-4'>
        No data available
        <Button onClick={onClose} className='ml-4'>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-4'>
          <select
            value={activeSheet}
            onChange={(e) => setActiveSheet(e.target.value)}
            className='p-2 border rounded'
            disabled={isSaving}
          >
            {workbookData.sheets.map((sheet) => (
              <option key={sheet.name} value={sheet.name}>
                {sheet.name}
              </option>
            ))}
          </select>
          <span className='text-sm text-muted-foreground'>
            {Object.keys(edits).length > 0
              ? `${Object.keys(edits).length} unsaved changes`
              : "All changes saved"}
          </span>
        </div>
        <div className='flex gap-2'>
          <Button onClick={onClose} variant='outline' disabled={isSaving}>
            Close
          </Button>
        </div>
      </div>

      <div className='overflow-auto mb-4 border rounded-lg max-h-[70vh]'>
        <table className='min-w-full'>
          <thead className='sticky top-0 bg-gray-50'>
            <tr>
              <th className='border p-1 text-xs w-8'>#</th>
              {currentSheet.data?.[0]?.map((_, colIndex) => (
                <th key={colIndex} className='border p-1 text-xs'>
                  {String.fromCharCode(65 + colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentSheet.data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className='border p-1 bg-gray-50 text-xs'>
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className='border p-1'>
                    <input
                      type='text'
                      value={
                        edits[activeSheet]?.[rowIndex]?.[colIndex] ??
                        (cell === null || cell === undefined ? "" : cell)
                      }
                      onChange={(e) =>
                        handleCellChange(
                          activeSheet,
                          rowIndex,
                          colIndex,
                          e.target.value
                        )
                      }
                      className='w-full p-1 border-none focus:outline-none focus:ring-1 focus:ring-blue-300'
                      disabled={isSaving}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex gap-2'>
        <Button
          onClick={saveChanges}
          disabled={Object.keys(edits).length === 0 || isSaving}
        >
          {isSaving ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
          Save Changes
        </Button>
        <Button
          onClick={exportToExcel}
          variant='outline'
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
          ) : null}
          Export to Excel
        </Button>
      </div>
    </div>
  );
}
