"use client";

import { useState, useTransition } from "react";
import {
  getLearnerDetail,
  LearnerDetail,
  AvailableCourse,
} from "@/dal/admin/learners.dal";
import AdminLearnerDrawerContent from "./learner-drawer-content";

export default function AdminLearnerDrawer({
  learnerId,
  children,
}: {
  learnerId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{
    learner: LearnerDetail;
    availableCourses: AvailableCourse[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    if (!data) {
      startTransition(async () => {
        const result = await getLearnerDetail(learnerId);
        setData({
          learner: result.learner,
          availableCourses: result.availableCourses,
        });
      });
    }
  }

  return (
    <>
      <div onClick={handleOpen}>{children}</div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#f0f2f4] shrink-0">
          <p className="text-base font-bold text-[#111318]">Manage Learner</p>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full text-[#617789] hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg leading-none">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isPending && !data ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#617789]">
              <div className="size-8 rounded-full border-2 border-[#135BEC] border-t-transparent animate-spin" />
              <p className="text-sm">Loading learner details…</p>
            </div>
          ) : data?.learner ? (
            <AdminLearnerDrawerContent
              learner={data.learner}
              availableCourses={data.availableCourses}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
