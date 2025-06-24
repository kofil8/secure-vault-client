import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Filter, Grid3X3, List, Search } from "lucide-react";
import FileUploadDialog from "./file-upload-dialog";

export default function Navbar({ searchQuery, setSearchQuery, viewMode, setViewMode }: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
}) {
    return (
        <header className='flex h-16 shrink-0 items-center gap-2 px-4 border-b'>
            <SidebarTrigger className='-ml-1' />
            <div className='flex items-center gap-2 flex-1'>
                <div className='relative flex-1 max-w-sm'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search files...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-10'
                    />
                </div>
                <Button variant='outline' size='sm'>
                    <Filter className='h-4 w-4 mr-2' />
                    Filter
                </Button>
            </div>
            <div className='flex items-center gap-2'>
                <div className='flex items-center border rounded-lg p-1'>
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size='sm'
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid3X3 className='h-4 w-4' />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size='sm'
                        onClick={() => setViewMode("list")}
                    >
                        <List className='h-4 w-4' />
                    </Button>
                </div>
                <FileUploadDialog />
            </div>
        </header>
    )
}