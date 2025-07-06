"use client";

import { useEffect, useRef, useState } from "react";

export default function WebViewer() {
  const viewer = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true); // Loading state for WebViewer

  useEffect(() => {
    if (!viewer.current) return;

    // Dynamically import WebViewer
    import("@pdftron/webviewer")
      .then((module) => {
        const WebViewer = module.default as (
          options: {
            path: string;
            licenseKey: string;
            initialDoc: string;
            enableOfficeEditing: boolean;
          },
          element: HTMLElement | null
        ) => Promise<any>;

        // Initialize WebViewer with the options
        WebViewer(
          {
            path: "/lib/webviewer", // Path to the WebViewer resources
            licenseKey:
              "demo:1751550156402:61a5da71030000000029531cfa87944655cbd28ba889042c7fa69b9b90", // Replace with your license key
            initialDoc: "http://localhost:7001/uploads/Cover-Letter-(1).docx",
            enableOfficeEditing: true, // Path to your document (e.g., docx, pdf)
          },
          viewer.current
        )
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("WebViewer initialization failed:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error loading WebViewer module", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            zIndex: 10,
          }}
        >
          <span>Loading Docs Editor...</span>
        </div>
      )}
      <div
        ref={viewer}
        style={{ width: "100%", height: "100vh", backgroundColor: "#f0f0f0" }}
      />
    </>
  );
}
