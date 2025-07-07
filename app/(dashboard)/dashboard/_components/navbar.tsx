import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Filter, Grid3X3, List, Search, X } from "lucide-react";
import FileUploadDialog from "./file-upload-dialog";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  filetype,
  setFiletype,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  filetype: string;
  setFiletype: (t: string) => void;
  setShowFilters: (b: boolean) => void;
}) {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const allowedExtensions = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
  ];
  const filetypeOptions = allowedExtensions.map((ext) => ext.replace(".", ""));

  const handleFiletypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiletype(e.target.value);
    setShowFilterModal(false);
  };

  return (
    <header className='w-full border-b bg-background shadow-sm px-4 py-3'>
      <div className='grid grid-rows-[auto_auto_auto] gap-3 w-full'>
        {/* Row 1: View toggle + Theme + Upload */}
        <div className='flex flex-wrap items-center justify-end gap-2'>
          <div className='flex items-center border rounded-xl p-1 shadow-sm bg-muted'>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size='sm'
              onClick={() => setViewMode("grid")}
              className='rounded-xl'
            >
              <Grid3X3 className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size='sm'
              onClick={() => setViewMode("list")}
              className='rounded-xl'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
          <ThemeToggle />
          <FileUploadDialog />
        </div>

        {/* Row 2: Sidebar + Search + Filter */}
        <div className='flex items-center gap-2 flex-wrap justify-between w-full'>
          <SidebarTrigger />

          {/* Search */}
          <div className='relative flex-1 min-w-[180px] max-w-full sm:max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search files...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 rounded-xl shadow-sm bg-muted w-full'
            />
          </div>

          {/* Filter Button */}
          <Button
            variant='outline'
            size='sm'
            className='rounded-xl border-muted text-muted-foreground'
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <Filter className='h-4 w-4 mr-2' />
            Filter
          </Button>
        </div>

        {/* Row 3: Filter Modal (full width block) */}
        {showFilterModal && (
          <div className='w-full max-w-xs mx-auto bg-muted rounded-xl p-4 border shadow-xl'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-sm font-semibold text-muted-foreground'>
                File Type
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full hover:bg-destructive/10'
                onClick={() => setShowFilterModal(false)}
              >
                <X className='h-4 w-4 text-muted-foreground' />
              </Button>
            </div>
            <select
              className='border rounded-lg px-3 py-2 text-sm w-full bg-background shadow-sm'
              value={filetype}
              onChange={handleFiletypeChange}
            >
              <option value=''>All</option>
              {filetypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </header>
  );
}
