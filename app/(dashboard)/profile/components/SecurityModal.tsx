"use client";

import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import { toast } from "sonner";
import clsx from "clsx";
import { updateSecurityAnswers } from "@/app/actions/security";

export default function SecurityModal({
  isOpen,
  setIsOpen,
  initialQuestions,
  onSave,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialQuestions: string[];
  onSave: (questions: string[], answers: string[]) => void;
}) {
  const [tab, setTab] = useState<"view" | "edit">("view");
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [errors, setErrors] = useState({
    questions: ["", "", ""],
    answers: ["", "", ""],
  });
  const [loading, setLoading] = useState(false);

  // Sync updated initialQuestions from parent
  useEffect(() => {
    setQuestions(initialQuestions);
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
      setIsOpen(false); // Auto-close modal ✅
    } else {
      toast.error(result.message);
    }
  };

  const handleCancel = () => {
    // Reset the questions and answers to their initial state
    setQuestions(initialQuestions);
    setAnswers(["", "", ""]);
    setErrors({
      questions: ["", "", ""],
      answers: ["", "", ""],
    });
    setIsOpen(false); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='Security Questions'>
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
          {questions.map((q, i) => (
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
          {questions.map((q, i) => (
            <div key={i}>
              <label className='block text-sm font-medium text-gray-700'>
                Question {i + 1}
              </label>
              <input
                type='text'
                value={questions[i]}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[i] = e.target.value;
                  setQuestions(updated);
                  setErrors((prev) => {
                    const updatedQ = [...prev.questions];
                    updatedQ[i] = e.target.value.trim() ? "" : "Required";
                    return { ...prev, questions: updatedQ };
                  });
                }}
                className={clsx(
                  "w-full border rounded px-3 py-2 mt-1",
                  errors.questions[i] && "border-red-500"
                )}
              />
              {errors.questions[i] && (
                <p className='text-sm text-red-500'>{errors.questions[i]}</p>
              )}
              <input
                type='text'
                placeholder='Answer'
                value={answers[i]}
                onChange={(e) => {
                  const updated = [...answers];
                  updated[i] = e.target.value;
                  setAnswers(updated);
                  setErrors((prev) => {
                    const updatedA = [...prev.answers];
                    updatedA[i] = e.target.value.trim() ? "" : "Required";
                    return { ...prev, answers: updatedA };
                  });
                }}
                className={clsx(
                  "w-full border rounded px-3 py-2 mt-2",
                  errors.answers[i] && "border-red-500"
                )}
              />
              {errors.answers[i] && (
                <p className='text-sm text-red-500'>{errors.answers[i]}</p>
              )}
            </div>
          ))}
          <div className='flex justify-end pt-2 gap-4'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
