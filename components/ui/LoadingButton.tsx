// app/_components/ui/LoadingButton.tsx
"use client";
import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({ loading, children, ...props }: Props) {
  return (
    <button
      disabled={loading}
      className={`w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition flex items-center justify-center ${
        loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children}
    </button>
  );
}
