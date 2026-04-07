"use client";
import { useState } from "react";
import History from "@/assets/icons/history.svg";
import Close from "@/assets/icons/close.svg";
import Dialog from "./modal";
import { Submission } from "../page";
import SubmissionHistoryCard from "./submission-history-card";

export default function SubmissionHistory({
  submissions,
  moduleTitle,
}: {
  submissions: Submission[];
  moduleTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto ml-auto px-5 py-2.5 bg-white border border-[#e5e7eb] transition-colors hover:bg-gray-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <History className="size-4" />
        View Submission History
      </button>

      <Dialog isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="w-full max-w-2xl max-h-[90dvh] m-auto flex flex-col bg-white rounded-xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 shrink-0">
            <div>
              <p className="text-lg font-bold text-[#111318]">
                Submission History
              </p>
              <p className="text-xs text-[#616f89] mt-0.5">
                {moduleTitle} · {submissions.length}{" "}
                {submissions.length === 1 ? "attempt" : "attempts"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Close className="size-5 text-[#617789]" />
            </button>
          </div>

          {/* Body — each card owns its own error state */}
          <div className="flex-1 overflow-y-auto space-y-3 p-6">
            {submissions.length === 0 ? (
              <p className="text-sm text-[#617789] text-center py-8">
                No submissions yet.
              </p>
            ) : (
              submissions.map((s) => (
                <SubmissionHistoryCard key={s.id} submission={s} />
              ))
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
