"use client";
import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className='mb-4'>
      <label className='block mb-1 text-sm font-medium text-gray-700'>
        {label}
      </label>
      <input
        {...props}
        className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
    </div>
  );
}
