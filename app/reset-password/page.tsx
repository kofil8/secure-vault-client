"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "../actions/forgot-password";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { LoadingButton } from "@/components/ui/LoadingButton";
import toast from "react-hot-toast";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const validation = passwordSchema.safeParse(newPassword);
    if (!validation.success) {
      return toast.error(validation.error.errors[0].message);
    }

    setLoading(true);
    const res = await resetPassword(token, newPassword);
    setLoading(false);

    if (res.success) {
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      toast.error(res.message || "Failed to reset password");
    }
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg'>
      <h2 className='text-xl font-semibold mb-6'>Reset Password</h2>
      <PasswordInput
        label='New Password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder='Enter new password'
      />
      <LoadingButton onClick={handleReset} loading={loading}>
        Set New Password
      </LoadingButton>
    </div>
  );
}
