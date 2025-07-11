"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/ui/InputField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { toast } from "sonner";
import { AiOutlineArrowLeft, AiOutlineEdit } from "react-icons/ai"; // Importing edit icon
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex].trim() === "") {
      return toast.error("Please answer the question before proceeding");
    }

    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleVerifyAnswers();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleVerifyAnswers = async () => {
    const trimmedAnswers = answers.map((a) => a.trim());
    if (trimmedAnswers.some((a) => !a))
      return toast.error("Please answer all questions");

    setLoading(true);
    const res = await verifyAnswers(email.trim(), trimmedAnswers);
    setLoading(false);

    if (res.success) {
      toast.success("Verified! Redirecting...");
      router.push(`/reset-password?token=${res.data.token}`);
    } else {
      toast.error(res.message || "Incorrect answers");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (step === "questions") {
      setStep("email");
      setAnswers(["", "", ""]);
      setQuestions([]);
      setCurrentQuestionIndex(0);
    }
  };

  const handleEditEmail = () => {
    setEmail(""); // Reset email
    setStep("email"); // Go back to the email input step
    setAnswers(["", "", ""]); // Clear answers
    setQuestions([]); // Clear questions
    setCurrentQuestionIndex(0); // Reset question index
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl'>
      <h2 className='text-2xl font-semibold mb-8 text-center text-gray-800'>
        Forgot Password
      </h2>

      <div className='mb-6'>
        <div className='relative'>
          {/* Progress Bar */}
          <div className='w-full bg-gray-200 h-2 rounded-full'>
            <div
              className='bg-blue-600 h-2 rounded-full transition-all ease-in-out duration-500'
              style={{ width: `${((currentQuestionIndex + 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Progress Step Text Below Progress Bar */}
        <div className='w-full text-center text-xs font-medium text-red-600 mt-4'>
          {step === "email"
            ? "Step 1: Enter Your Email"
            : `Step 2: Answer Security Question ${currentQuestionIndex + 1}`}
        </div>
      </div>

      {step === "email" ? (
        <>
          <InputField
            label='Email'
            type='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter your email'
            disabled={loading}
            className='p-3 border-2 border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300'
          />
          <LoadingButton
            onClick={handleEmailSubmit}
            loading={loading}
            disabled={loading}
            className='w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300'
          >
            Get Security Questions
          </LoadingButton>
        </>
      ) : (
        <>
          <InputField
            label={questions[currentQuestionIndex]}
            type='text'
            value={answers[currentQuestionIndex]}
            onChange={(e) => handleAnswerChange(e, currentQuestionIndex)}
            placeholder='Your answer'
            disabled={loading}
            className='p-3 border-2 border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300'
          />
          <div className='flex justify-between items-center mt-6'>
            {/* Rewrite Previous Question Button */}
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                disabled={loading}
                className='flex items-center text-sm text-blue-600 hover:text-blue-700 focus:outline-none transition-all duration-300 ease-in-out'
              >
                <AiOutlineArrowLeft className='mr-2' /> Previous Question
              </button>
            )}
            {/* Edit Email Button */}
            {currentQuestionIndex === 0 && (
              <button
                onClick={handleEditEmail}
                className='flex items-center text-sm text-gray-600 hover:text-gray-700 focus:outline-none transition-all duration-300 ease-in-out'
              >
                <AiOutlineEdit className='mr-2' /> Edit Email
              </button>
            )}
            {/* Next or Verify Button */}
            <LoadingButton
              onClick={handleNextQuestion}
              loading={loading}
              disabled={loading}
              className='w-auto px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none transition-all duration-300 ease-in-out'
            >
              {currentQuestionIndex < 2 ? "Next Question" : "Verify Answers"}
            </LoadingButton>
          </div>
        </>
      )}
    </div>
  );
}
