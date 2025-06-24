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
import { toast } from "sonner";
import SmallSpinner from "../dashboard/_components/spinner";

export default function ResetPassword() {
    const [step, setStep] = useState<"securityQuestion" | "resetPassword">(
        "securityQuestion"
    );
    const [answer, setAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Simulated user's security question and answer
    const securityQuestion = "What is your mother's maiden name?";
    const correctAnswer = "Smith"; // This should come from your backend

    // Step 1: Submit security question answer
    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call to validate security answer
            await new Promise((resolve) => setTimeout(resolve, 1500));

            if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
                toast(
                    "Security answer verified.",
                );
                setStep("resetPassword");
            } else {
                toast(
                    "Incorrect answer. Please try again.",
                );
            }
        } catch (err) {
            console.log("err", err);
            toast(
                "Something went wrong. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Submit new password
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call to reset password
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast(
                "Your password has been successfully reset."
            );

            // Redirect or show success screen
            setTimeout(() => {
                window.location.href = "/login"; // Or useRouter.push('/login')
            }, 1000);
        } catch (err) {
            console.log("err", err);

            toast(
                "Failed to reset password. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black px-4">
            <Card className="w-full max-w-md border border-black/10 bg-white shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-black">
                        {step === "securityQuestion" ? "Verify Identity" : "Reset Password"}
                    </CardTitle>
                    <CardDescription className="text-black/60">
                        {step === "securityQuestion"
                            ? "Answer your security question to continue."
                            : "Enter your new password below."}
                    </CardDescription>
                </CardHeader>

                {step === "securityQuestion" ? (
                    <form onSubmit={handleSecuritySubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="securityAnswer" className="text-black/80">
                                    {securityQuestion}
                                </Label>
                                <Input
                                    id="securityAnswer"
                                    placeholder="Your answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="bg-white border-black/10 text-black"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-black/90 mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <SmallSpinner />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Answer"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-black/80">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="bg-white border-black/10 text-black"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-black/90 mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <SmallSpinner />
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}