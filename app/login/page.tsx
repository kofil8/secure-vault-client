"use client";

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

import { useState } from "react";
import { toast } from "sonner"
import SmallSpinner from "../(dashboard)/dashboard/_components/spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast("email and password is required", {
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem("token", "tokenafterlogin");
      setIsLoading(false);
      toast("You've been logged in.");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black px-4">
      <Card className="w-full max-w-md border border-black/10 bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-black">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-black/60">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-black/10 text-black placeholder:text-black/30"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black/80">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-black/10 text-black placeholder:text-black/30"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90 mt-3 relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SmallSpinner />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}