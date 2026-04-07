"use client";

import { useState, useTransition } from "react";
import {
  getLearnerDetail,
  LearnerDetail,
} from "@/dal/instructors/learners.dal";
import LearnerDrawerContent from "./drawer-content";

interface LearnerDrawerProps {
  learnerId: string;
  courseId: string;
  children: React.ReactNode;
}

export default function LearnerDrawer({
  learnerId,
  courseId,
  children,
}: LearnerDrawerProps) {
  const [open, setOpen] = useState(false);
  const [learner, setLearner] = useState<LearnerDetail | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    // Only fetch once — reuse cached state on subsequent opens
    if (!learner) {
      startTransition(async () => {
        const data = await getLearnerDetail(learnerId);
        setLearner(data);
      });
    }
  }

  return (
    <>
      <div onClick={handleOpen}>{children}</div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-100 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-100 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#f0f2f4] shrink-0">
          <p className="text-base font-bold text-[#111318]">Learner Detail</p>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex justify-center items-center rounded-full text-[#617789] hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg leading-none">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isPending && !learner ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#617789]">
              <div className="size-8 rounded-full border-2 border-[#135BEC] border-t-transparent animate-spin" />
              <p className="text-sm">Loading learner details…</p>
            </div>
          ) : learner ? (
            <LearnerDrawerContent learner={learner} courseId={courseId} />
          ) : null}
        </div>
      </div>
    </>
  );
}
