"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    startTransition(() => {
      // Simulate async API request
      setTimeout(() => {
        toast.success(
          "If this email exists, reset instructions have been sent."
        );
      }, 1000);
    });
  };

  return (
    <Card className='w-full max-w-md border border-black/10 bg-white shadow-xl'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold tracking-tight text-black'>
          Forgot Password
        </CardTitle>
        <CardDescription className='text-black/60'>
          Enter your email address and we will send you a password reset link.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-black/80'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-white border-black/10 text-black placeholder:text-black/30'
              required
            />
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            className='w-full bg-black text-white hover:bg-black/90 mt-3'
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
