"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner"; // ✅ Import from sonner

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
      <Toaster position='top-right' richColors />{" "}
    </ThemeProvider>
  );
}
