"use client";

import { updateSecurityAnswers } from "@/app/actions/security";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "./components/ui/Modal";

export default function SecurityModal({
  isOpen,
  setIsOpen,
  initialQuestions,
  onSave,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  initialQuestions: string[];
  onSave: (questions: string[], answers: string[]) => void;
}) {
  const [tab, setTab] = useState<"view" | "edit">("view");
  const [questions, setQuestions] = useState<string[]>(
    initialQuestions ?? ["", "", ""]
  );
  const [answers, setAnswers] = useState(["", "", ""]);
  const [errors, setErrors] = useState({
    questions: ["", "", ""],
    answers: ["", "", ""],
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (initialQuestions?.length === 3) {
      setQuestions(initialQuestions);
    } else {
      setQuestions(["", "", ""]);
    }
  }, [initialQuestions]);

  const validate = () => {
    const qErr = questions.map((q) => (q.trim() ? "" : "Required"));
    const aErr = answers.map((a) => (a.trim() ? "" : "Required"));
    setErrors({ questions: qErr, answers: aErr });
    return [...qErr, ...aErr].every((v) => !v);
  };

  const handleSave = async () => {
    if (!validate()) return toast.error("Fix validation errors");

    setLoading(true);
    const result = await updateSecurityAnswers(questions, answers);
    setLoading(false);

    if (result.success) {
      toast.success("Security questions updated");
      onSave(questions, answers);
      setAnswers(["", "", ""]);
      setTab("view");
      setStep(0);
      setIsOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const StepIndicator = () => (
    <div className='flex justify-center gap-2 my-4'>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            "w-3 h-3 rounded-full",
            step === i ? "bg-blue-600" : "bg-gray-300"
          )}
        ></div>
      ))}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title='Security Questions'
      show={isOpen}
    >
      <div className='flex gap-4 mb-4'>
        <button
          className={clsx(
            "px-3 py-1 rounded",
            tab === "view" ? "bg-blue-600 text-white" : "bg-gray-200"
          )}
          onClick={() => setTab("view")}
        >
          View
        </button>
        <button
          className={clsx(
            "px-3 py-1 rounded",
            tab === "edit" ? "bg-blue-600 text-white" : "bg-gray-200"
          )}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
      </div>

      {tab === "view" ? (
        <ul className='list-disc pl-5 space-y-2 text-sm text-gray-700'>
          {questions?.map((q, i) => (
            <li key={i}>
              {q?.trim() ? (
                q
              ) : (
                <span className='text-gray-400 italic'>Not set</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className='space-y-4'>
          <StepIndicator />
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Question {step + 1}
            </label>
            <input
              type='text'
              value={questions[step]}
              onChange={(e) => {
                const updated = [...questions];
                updated[step] = e.target.value;
                setQuestions(updated);
                setErrors((prev) => {
                  const updatedQ = [...prev.questions];
                  updatedQ[step] = e.target.value.trim() ? "" : "Required";
                  return { ...prev, questions: updatedQ };
                });
              }}
              className={clsx(
                "w-full border rounded px-3 py-2 mt-1",
                errors.questions[step] && "border-red-500"
              )}
            />
            {errors.questions[step] && (
              <p className='text-sm text-red-500'>{errors.questions[step]}</p>
            )}
            <input
              type='text'
              placeholder='Answer'
              value={answers[step]}
              onChange={(e) => {
                const updated = [...answers];
                updated[step] = e.target.value;
                setAnswers(updated);
                setErrors((prev) => {
                  const updatedA = [...prev.answers];
                  updatedA[step] = e.target.value.trim() ? "" : "Required";
                  return { ...prev, answers: updatedA };
                });
              }}
              className={clsx(
                "w-full border rounded px-3 py-2 mt-2",
                errors.answers[step] && "border-red-500"
              )}
            />
            {errors.answers[step] && (
              <p className='text-sm text-red-500'>{errors.answers[step]}</p>
            )}
          </div>
          <div className='flex justify-between pt-2'>
            <button
              onClick={handleBack}
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded'
              disabled={step === 0}
            >
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={handleNext}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                disabled={loading}
              >
                {loading ? "Saving..." : "Save All"}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
