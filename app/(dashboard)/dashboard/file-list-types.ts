export type DashboardFile = {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  filePath?: string;
  fileBlob?: any;
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  version?: number;
  lastSavedAt?: string | null;
  lastSavedById?: string | null;
};

export type SomeOtherFileType = {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  starred: boolean;
  thumbnail?: string;
};

export type FileCardProps = {
  file: DashboardFile;
  viewMode: "grid" | "list";
  isSelected?: boolean;
  onSelect?: () => void;
  onDeleteSuccess: (fileId: string) => void;
  onDeleteError: (error: unknown) => void; // Added this line
};

export type FileListProps = {
  viewMode: "grid" | "list";
  files: DashboardFile[];
  searchQuery?: string;
  onFileDeleted: (fileId: string) => void;
};
