"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/app/actions/change-password";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { LoadingButton } from "@/components/ui/LoadingButton";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/, {
      message:
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

type FormData = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await changePassword(data.currentPassword, data.newPassword);

    if (res.success) {
      toast.success(res.message);
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg'>
      <h2 className='text-xl font-semibold mb-6'>Change Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <PasswordInput
            label='Current Password'
            {...register("currentPassword")}
            placeholder='Enter current password'
          />
          {errors.currentPassword && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <PasswordInput
            label='New Password'
            {...register("newPassword")}
            placeholder='Enter new password'
          />
          {errors.newPassword && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <LoadingButton type='submit' loading={isSubmitting}>
          Change Password
        </LoadingButton>
      </form>
    </div>
  );
}
