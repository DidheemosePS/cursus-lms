"use client";

import { useState, useTransition } from "react";
import {
  getInstructorDetail,
  InstructorDetail,
  InstructorAvailableCourse,
} from "@/dal/admin/instructors.dal";
import InstructorDrawerContent from "./instructor-drawer-content";

export default function InstructorDrawer({
  instructorId,
  children,
}: {
  instructorId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{
    instructor: InstructorDetail;
    availableCourses: InstructorAvailableCourse[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    if (!data) {
      startTransition(async () => {
        const result = await getInstructorDetail(instructorId);
        setData({
          instructor: result.instructor,
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
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#f0f2f4] shrink-0">
          <p className="text-base font-bold text-[#111318]">
            Manage Instructor
          </p>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full text-[#617789] hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg leading-none">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isPending && !data ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#617789]">
              <div className="size-8 rounded-full border-2 border-[#135BEC] border-t-transparent animate-spin" />
              <p className="text-sm">Loading instructor details…</p>
            </div>
          ) : data?.instructor ? (
            <InstructorDrawerContent
              instructor={data.instructor}
              availableCourses={data.availableCourses}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
