"use client";

import { useState, useTransition, useRef } from "react";
import {
  submitFeedback,
  updateFeedback,
} from "@/actions/submission-review.actions";
import Edit from "@/assets/icons/edit.svg";

interface FeedbackSectionProps {
  submissionId: string;
  feedback: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isEdited: boolean;
  } | null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function FeedbackSection({
  submissionId,
  feedback,
}: FeedbackSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const content = textareaRef.current?.value ?? "";
    setError(null);

    startTransition(async () => {
      const result = feedback
        ? await updateFeedback(feedback.id, content)
        : await submitFeedback(submissionId, content);

      if (result.error) {
        setError(result.error);
        return;
      }
      setIsEditing(false);
    });
  }

  function handleEdit() {
    setIsEditing(true);
    // Focus textarea on next tick after render
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function handleCancel() {
    setIsEditing(false);
    setError(null);
  }

  // ── No feedback yet ──────────────────────────────────────────────────────────
  if (!feedback) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-[#f0f2f4] bg-white p-6 shadow-sm">
        <div>
          <p className="text-base font-bold text-[#111318]">Feedback</p>
          <p className="text-xs text-[#617789] mt-0.5">
            Write your feedback for this submission.
          </p>
        </div>
        <textarea
          ref={textareaRef}
          placeholder="Write your feedback here…"
          rows={6}
          className="w-full rounded-lg bg-[#f0f2f4] px-4 py-3 text-sm text-[#111318] placeholder:text-[#617789] outline-none focus:ring-2 focus:ring-[#135BEC]/50 resize-none transition-shadow"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="self-end px-6 py-2.5 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-bold transition-colors disabled:opacity-60 shadow-sm"
        >
          {isPending ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    );
  }

  // ── Feedback exists — show or edit ──────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#f0f2f4] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-[#111318]">Feedback</p>
            {feedback.isEdited && (
              <span className="text-[10px] font-medium text-[#617789] bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                Edited
              </span>
            )}
          </div>
          <p className="text-xs text-[#617789] mt-0.5">
            Given on {formatDate(feedback.createdAt)}
            {feedback.isEdited &&
              ` · Last edited ${formatDate(feedback.updatedAt)}`}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#dbe1e6] text-xs font-semibold text-[#111318] hover:bg-gray-50 transition-colors shrink-0"
          >
            <Edit className="size-3.5" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <textarea
            ref={textareaRef}
            defaultValue={feedback.content}
            rows={6}
            className="w-full rounded-lg bg-[#f0f2f4] px-4 py-3 text-sm text-[#111318] placeholder:text-[#617789] outline-none focus:ring-2 focus:ring-[#135BEC]/50 resize-none transition-shadow"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-4 py-2 rounded-lg border border-[#dbe1e6] text-sm font-medium text-[#111318] hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="px-6 py-2 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-bold transition-colors disabled:opacity-60 shadow-sm"
            >
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
          <p className="text-sm text-[#111318] leading-relaxed whitespace-pre-wrap">
            {feedback.content}
          </p>
        </div>
      )}
    </div>
  );
}
