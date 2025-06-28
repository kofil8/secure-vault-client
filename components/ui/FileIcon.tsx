import React from "react";
import {
  FileText,
  FileType2,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";

type FileIconProps = {
  type: string;
  className?: string;
};

const FileIcon: React.FC<FileIconProps> = ({ type, className }) => {
  const lowerType = type.toLowerCase();

  if (lowerType.includes("image")) return <ImageIcon className={className} />;
  if (lowerType.includes("pdf")) return <FileText className={className} />;
  if (lowerType.includes("word") || lowerType.includes("document"))
    return <FileType2 className={className} />;
  if (lowerType.includes("spreadsheet") || lowerType.includes("excel"))
    return <FileSpreadsheet className={className} />;

  return <FileText className={className} />;
};

export default FileIcon;
