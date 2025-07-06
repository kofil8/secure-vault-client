// types/excel.d.ts

/**
 * Core Excel File Metadata
 */
export interface ExcelFileMetadata {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  version?: number;
  lastSavedAt?: string;
  updatedAt: string;
}

/**
 * Worksheet Data Structures
 */
interface Sheet {
  id: string;
  name: string;
  rows: {
    number: number;
    values: any[];
  }[];
}

export interface Row {
  values: any[]; // Legacy row structure (first value often empty in exceljs)
}

/**
 * API Response Structure
 */
export interface ExcelApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ExcelFileData;
}

/**
 * Complete Excel File Data (Frontend)
 */
export interface ExcelFileData extends ExcelFileMetadata {
  sheets: Sheet[];
}

/**
 * Editor Component Props
 */
export interface ExcelEditorProps {
  fileId: string;
  onClose: () => void;
  initialData?: ExcelFileData;
}

/**
 * Editing Operation Types
 */
export interface CellEdit {
  [rowIndex: number]: {
    [colIndex: number]: any;
  };
}

export interface SheetEdits {
  [sheetName: string]: CellEdit;
}

export interface SheetUpdate {
  name: string;
  data: any[][];
}

/**
 * File Info Response (for page.tsx)
 */
export interface FileInfoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ExcelFileMetadata;
}

/**
 * Supported Excel Formats
 */
export type ExcelFormats = "xlsx" | "xls" | "csv";

interface WorkbookData {
  id: string;
  fileName: string;
  fileType: string;
  version: number;
  lastSavedAt?: string;
  updatedAt: string;
  sheets: Sheet[];
}
