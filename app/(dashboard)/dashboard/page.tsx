"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Archive,
    Calendar,
    FileText,
} from "lucide-react";
import * as React from "react";
import Navbar from "./_components/navbar";
import FileList from "./_components/file-list";

export default function FileVaultDashboard() {

    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = React.useState("");

    return (
        <>
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} viewMode={viewMode} setViewMode={setViewMode} />
            <div className='flex-1 space-y-4 p-4 md:p-6'>
                {/* Stats Cards */}
                <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Files
                            </CardTitle>
                            <FileText className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>1,234</div>

                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Storage Used
                            </CardTitle>
                            <Archive className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>2.1 GB</div>

                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Recent Activity
                            </CardTitle>
                            <Calendar className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>24</div>
                        </CardContent>
                    </Card>
                </div>
                <FileList viewMode={viewMode} searchQuery={searchQuery} />
            </div>
        </>
    );
}
