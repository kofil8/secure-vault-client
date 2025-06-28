"use client";
import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function PasswordInput({ label, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className='mb-4'>
      <label className='block mb-1 font-medium text-sm text-gray-700'>
        {label}
      </label>
      <div className='relative'>
        <input
          {...props}
          type={visible ? "text" : "password"}
          className='w-full px-3 py-2 border rounded-md shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          type='button'
          onClick={() => setVisible((v) => !v)}
          className='absolute right-2 top-2 text-gray-500'
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
