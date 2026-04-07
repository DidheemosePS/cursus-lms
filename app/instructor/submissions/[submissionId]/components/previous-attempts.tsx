"use client";

import { useState } from "react";
import DownArrow from "@/assets/icons/down-arrow.svg";
import type { SubmissionDetail } from "@/dal/instructors/submission-review.dal";

type PreviousAttempt =
  NonNullable<SubmissionDetail>["previousAttempts"][number];

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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttemptItem({ attempt }: { attempt: PreviousAttempt }) {
  const [open, setOpen] = useState(false);
  const isEdited =
    attempt.feedback && attempt.feedback.updatedAt > attempt.feedback.createdAt;

  return (
    <div className="rounded-lg border border-[#f0f2f4] overflow-hidden">
      {/* Attempt header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#111318]">
            Attempt {attempt.attemptNumber}
          </span>
          {attempt.isLate && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
              Late
            </span>
          )}
          {attempt.feedback && (
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
              Reviewed
            </span>
          )}
        </div>
        <DownArrow
          className={`size-4 text-[#617789] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Attempt detail — collapsible */}
      {open && (
        <div className="flex flex-col gap-3 px-4 py-3">
          {/* File */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-medium text-[#111318] truncate">
                {attempt.fileName}
              </p>
              <p className="text-[10px] text-[#617789]">
                {formatFileSize(attempt.fileSize)} ·{" "}
                {formatDate(attempt.createdAt)}
              </p>
            </div>
            <a
              href={attempt.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-[#135BEC] hover:underline"
            >
              Open
            </a>
          </div>

          {/* Feedback */}
          {attempt.feedback ? (
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Feedback given
                </p>
                {isEdited && (
                  <span className="text-[10px] font-medium text-[#617789] bg-gray-100 px-1.5 py-0.5 rounded">
                    Edited
                  </span>
                )}
              </div>
              <p className="text-xs text-[#111318] leading-relaxed">
                {attempt.feedback.content}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#617789] italic">No feedback given</p>
          )}
        </div>
      )}
    </div>
  );
}

export function PreviousAttempts({
  attempts,
}: {
  attempts: PreviousAttempt[];
}) {
  if (attempts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#f0f2f4] bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
        Previous Attempts
      </p>
      <div className="flex flex-col gap-2">
        {attempts.map((attempt) => (
          <AttemptItem key={attempt.id} attempt={attempt} />
        ))}
      </div>
    </div>
  );
}
