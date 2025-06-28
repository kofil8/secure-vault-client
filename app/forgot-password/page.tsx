"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/ui/InputField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { toast } from "sonner"; // <-- Updated import here
import {
  getSecurityQuestions,
  verifyAnswers,
} from "@/app/actions/forgot-password";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "questions">("email");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return toast.error("Please enter your email");

    setLoading(true);
    const res = await getSecurityQuestions(trimmedEmail);
    setLoading(false);

    if (res.success) {
      setQuestions(res.data.questions);
      setStep("questions");
      toast.success("Security questions loaded");
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const handleVerifyAnswers = async () => {
    const trimmedAnswers = answers.map((a) => a.trim());
    if (trimmedAnswers.some((a) => !a))
      return toast.error("Please answer all questions");

    setLoading(true);
    const res = await verifyAnswers(email.trim(), trimmedAnswers);
    setLoading(false);

    console.log("verifyAnswers response:", res); // debug

    if (res.success) {
      toast.success("Verified! Redirecting...");
      router.push(`/reset-password?token=${res.data.token}`);
    } else {
      toast.error(res.message || "Incorrect answers");
    }
  };

  // Reset answers if email changes after questions loaded
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (step === "questions") {
      setStep("email");
      setAnswers(["", "", ""]);
      setQuestions([]);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg'>
      <h2 className='text-xl font-semibold mb-6'>Forgot Password</h2>

      {step === "email" ? (
        <>
          <InputField
            label='Email'
            type='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter your email'
            disabled={loading}
            id='email-input'
          />
          <LoadingButton
            onClick={handleEmailSubmit}
            loading={loading}
            disabled={loading}
          >
            Get Security Questions
          </LoadingButton>
        </>
      ) : (
        <>
          {questions.map((q, i) => (
            <InputField
              key={i}
              label={q}
              type='text'
              value={answers[i]}
              onChange={(e) => {
                const updated = [...answers];
                updated[i] = e.target.value;
                setAnswers(updated);
              }}
              placeholder='Your answer'
              disabled={loading}
              id={`answer-${i}`}
            />
          ))}
          <LoadingButton
            onClick={handleVerifyAnswers}
            loading={loading}
            disabled={loading}
          >
            Verify Answers
          </LoadingButton>
        </>
      )}
    </div>
  );
}
