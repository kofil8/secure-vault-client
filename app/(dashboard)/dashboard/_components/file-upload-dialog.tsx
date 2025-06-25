"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function FileUploadDialog() {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles); 
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        processFiles(selectedFiles);
    };

    const processFiles = (fileList: File[]) => {
        const newFiles = [...files, ...fileList];
        setFiles(newFiles);

        const newPreviews = fileList.map((file) =>
            file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
        );

        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    console.log("files", files);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Files
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                        Drag and drop files here or click to browse
                    </DialogDescription>
                </DialogHeader>

                {/* Hidden Input */}
                <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                />

                {/* Drop Zone */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                        Drop files here or click to upload
                    </p>
                    <Button variant="outline" size="sm" type="button">
                        Browse Files
                    </Button>
                </div>

                {/* File Preview Section */}
                {files.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded"
                                >
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="flex items-center gap-2 truncate flex-1 text-left">
                                                {previews[index] ? (
                                                    <Image
                                                        src={previews[index]}
                                                        alt={file.name}
                                                        width={32}
                                                        height={32}
                                                        className="h-8 w-8 object-cover rounded"
                                                    />
                                                ) : (
                                                    <span className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                                                        📄
                                                    </span>
                                                )}
                                                <span className="truncate max-w-[180px]">{file.name}</span>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-xl">
                                            <DialogHeader>
                                                <DialogTitle>Preview: {file.name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="mt-4 flex justify-center">
                                                {file.type.startsWith("image/") && previews[index] ? (
                                                    <Image
                                                        src={previews[index]}
                                                        alt={file.name}
                                                        width={500}
                                                        height={500}
                                                        className="max-h-[60vh] w-auto rounded"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                                        <ImageIcon className="h-16 w-16" />
                                                        <span>Preview not available for this file type</span>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}