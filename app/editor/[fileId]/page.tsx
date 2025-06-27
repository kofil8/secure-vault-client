"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FileData {
  id: string;
  version: string;
  fileType: string;
  fileName: string;
  fileUrl: string;
}

export default function FileEditorPage() {
  const { fileId } = useParams();
  const [file, setFile] = useState<FileData | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const res = await fetch(`/api/files/${fileId}`);
      const data = await res.json();
      setFile(data.data);
    };
    fetchFile();
  }, [fileId]);

  if (!file) return <div>Loading editor...</div>;

  const config = {
    document: {
      fileType: file.fileType,
      key: file.id + "-" + file.version,
      title: file.fileName,
      url: file.fileUrl,
    },
    documentType: getDocumentType(file.fileType),
    editorConfig: {
      mode: "edit",
      callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/onlyoffice/save/${file.id}`,
      user: {
        id: "user-1",
        name: "Editor User",
      },
    },
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <script
        src='http://localhost/web-apps/apps/api/documents/api.js'
        async
      ></script>
      <div
        id='onlyoffice-editor'
        style={{ height: "100%", width: "100%" }}
      ></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.DocEditor = new DocsAPI.DocEditor("onlyoffice-editor", ${JSON.stringify(
              config
            )});
          `,
        }}
      />
    </div>
  );
}

function getDocumentType(type: string) {
  if (["docx", "doc"].includes(type)) return "text";
  if (["xlsx", "xls"].includes(type)) return "spreadsheet";
  if (["pptx", "ppt"].includes(type)) return "presentation";
  return "text";
}
