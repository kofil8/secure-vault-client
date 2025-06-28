/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { loginUser } from "../actions/login-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SmallSpinner from "../(dashboard)/dashboard/_components/spinner";

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
    <Card className='w-full max-w-md border border-black/10 bg-white shadow-xl'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold tracking-tight text-black'>
          Welcome Back
        </CardTitle>
        <CardDescription className='text-black/60'>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <form action={handleAction}>
        <CardContent className='space-y-4'>
          {/* Email */}
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-black/80'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='you@example.com'
              className='bg-white border-black/10 text-black placeholder:text-black/30'
              required
              disabled={isPending}
            />
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-black/80'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              className='bg-white border-black/10 text-black placeholder:text-black/30'
              required
              disabled={isPending}
            />
            <div className='text-right'>
              <Link
                href='/forgot-password'
                className='text-sm text-blue-600 hover:underline'
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            className='w-full bg-black text-white hover:bg-black/90 mt-3'
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
        </CardFooter>
      </form>
    </Card>
  );
}
