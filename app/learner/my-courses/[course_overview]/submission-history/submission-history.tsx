"use client";

import { useState } from "react";
import History from "@/assets/icons/history.svg";
import Close from "@/assets/icons/close.svg";
import Dialog from "./modal";
import { Submission } from "../page";
import SubmissionHistoryCard from "./submission-history-card";

export default function SubmissionHistory({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function showModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setError(null);
  }

  return (
    <>
      <button
        onClick={showModal}
        className="w-full md:w-auto ml-auto px-5 py-2.5 bg-white border border-[#e5e7eb] transition-colors hover:bg-gray-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <History className="size-4" />
        View Submission History
      </button>
      <Dialog isOpen={isOpen} closeModal={closeModal}>
        <div className="w-full max-w-2xl max-h-[90dvh] m-auto flex flex-col bg-white rounded-lg overflow-hidden">
          <div className="px-6 py-5 flex justify-between items-center bg-white border-b border-gray-100">
            <div>
              <p className="text-xl font-bold">Submission History</p>
              <p className="text-xs text-[#616f89] mt-0.5">
                Final Project Portfolio
              </p>
            </div>
            <button
              onClick={closeModal}
              className="outline outline-transparent cursor-pointer"
            >
              <Close className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 p-6">
            {submissions.map((s) => {
              return (
                <SubmissionHistoryCard
                  key={s.id}
                  stage={s.status}
                  submission={s}
                  error={error}
                  setError={setError}
                />
              );
            })}
          </div>
        </div>
      </Dialog>
    </>
  );
}
