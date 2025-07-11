"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import SmallSpinner from "../(dashboard)/dashboard/_components/spinner";
import { loginUser } from "../actions/login-user";

// Import Framer Motion for animations
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleAction = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await loginUser(formData);
        if (res?.success) {
          toast.success("Login successful!");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      } catch (err: any) {
        toast.error(err.message || "Login failed");
      }
    });
  };

  return (
    <motion.div
      className='min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-500 to-purple-600'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Card className='w-full max-w-md sm:max-w-lg border border-black/10 bg-white shadow-lg rounded-lg p-6 sm:p-8'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl sm:text-4xl font-bold text-gray-800'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form action={handleAction}>
          <CardContent className='space-y-6'>
            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-gray-700'>
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                className='bg-white border-2 border-gray-300 text-gray-700 placeholder:text-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 transition-all duration-300 w-full'
                required
                disabled={isPending}
              />
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700'>
                Password
              </Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                className='bg-white border-2 border-gray-300 text-gray-700 placeholder:text-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 transition-all duration-300 w-full'
                required
                disabled={isPending}
              />
              <div className='text-right mt-2'>
                <Link
                  href='/forgot-password'
                  className='text-sm text-teal-600 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </CardContent>

          {/* Footer section manually implemented */}
          <div className='flex flex-col space-y-4 p-6'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Button
                type='submit'
                className='w-full bg-teal-600 text-white hover:bg-teal-700 focus:outline-none py-3 rounded-lg shadow-md'
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <SmallSpinner /> Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
