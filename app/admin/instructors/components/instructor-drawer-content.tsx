"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import type {
  InstructorDetail,
  InstructorAvailableCourse,
} from "@/dal/admin/instructors.dal";
import {
  changeInstructorStatus,
  assignCourse,
  removeCourse,
  resendInstructorInvite,
} from "@/actions/admin-instructor.actions";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

const statusTheme = {
  active: "bg-green-50 text-green-700 border-green-100",
  pending_invite: "bg-amber-50 text-amber-700 border-amber-100",
  inactive: "bg-gray-50 text-gray-500 border-gray-200",
} as const;

const statusLabel = {
  active: "Active",
  pending_invite: "Pending Invite",
  inactive: "Inactive",
} as const;

const courseStatusTheme = {
  active: "bg-green-50 text-green-700 border-green-100",
  draft: "bg-gray-50 text-gray-500 border-gray-200",
  archived: "bg-red-50 text-red-600 border-red-100",
} as const;

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function InstructorDrawerContent({
  instructor,
  availableCourses,
}: {
  instructor: NonNullable<InstructorDetail>;
  availableCourses: InstructorAvailableCourse[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const isPendingInvite = instructor.status === "pending_invite";

  function runAction(
    action: () => Promise<{ success: boolean; message?: string }>,
  ) {
    setActionMessage(null);
    startTransition(async () => {
      const result = await action();
      if (result.message) setActionMessage(result.message);
    });
  }

  const theme =
    statusTheme[instructor.status as keyof typeof statusTheme] ??
    statusTheme.inactive;
  const label =
    statusLabel[instructor.status as keyof typeof statusLabel] ?? "Unknown";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="relative size-14 rounded-full overflow-hidden border border-gray-100 shrink-0">
          <Image
            src={instructor.avatar || DEFAULT_AVATAR}
            alt={instructor.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-base font-bold text-[#111318] truncate">
            {instructor.name}
          </p>
          <p className="text-sm text-[#617789] truncate">{instructor.email}</p>
          <span
            className={`mt-1 inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${theme}`}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Pending invite notice */}
      {isPendingInvite && (
        <div className="flex flex-col gap-2 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs font-bold text-amber-700">
            Invite not accepted yet
          </p>
          <p className="text-xs text-amber-600 leading-relaxed">
            This instructor hasn&apos;t accepted their invite. They won&apos;t appear in
            course chat or submissions until they do. You can still assign
            courses — they&apos;ll be available when they join.
          </p>
          <button
            onClick={() =>
              runAction(() => resendInstructorInvite(instructor.id))
            }
            disabled={isPending}
            className="self-start mt-1 px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-200 transition-colors disabled:opacity-60"
          >
            Resend Invite
          </button>
        </div>
      )}

      {/* Action message */}
      {actionMessage && (
        <p className="text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
          {actionMessage}
        </p>
      )}

      <div className="h-px bg-[#f0f2f4]" />

      {/* Account actions */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
          Account Actions
        </p>
        <div className="flex flex-wrap gap-2">
          {instructor.status !== "active" && (
            <button
              onClick={() =>
                runAction(() => changeInstructorStatus(instructor.id, "active"))
              }
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-60"
            >
              Set Active
            </button>
          )}
          {instructor.status !== "inactive" && (
            <button
              onClick={() =>
                runAction(() =>
                  changeInstructorStatus(instructor.id, "inactive"),
                )
              }
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              Deactivate
            </button>
          )}
        </div>
        <p className="text-xs text-[#617789]">
          Joined {formatDate(instructor.createdAt)}
        </p>
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* Assign course — always visible */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
          Assign to Course
        </p>
        {availableCourses.length === 0 ? (
          <p className="text-xs text-[#617789]">
            This instructor is already assigned to all available courses.
          </p>
        ) : (
          <div className="flex gap-2">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] bg-white appearance-none"
            >
              <option value="">Choose a course to assign them to…</option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.code})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!selectedCourseId) return;
                runAction(() => assignCourse(instructor.id, selectedCourseId));
                setSelectedCourseId("");
              }}
              disabled={isPending || !selectedCourseId}
              className="px-4 py-2 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              Assign
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* Assigned courses */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
          Assigned Courses ({instructor.instructedCourses.length})
        </p>
        {instructor.instructedCourses.length === 0 ? (
          <p className="text-sm text-[#617789]">No courses assigned yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {instructor.instructedCourses.map(({ course }) => {
              const courseTheme =
                courseStatusTheme[
                  course.status as keyof typeof courseStatusTheme
                ] ?? courseStatusTheme.draft;

              return (
                <div
                  key={course.id}
                  className="rounded-xl border border-[#f0f2f4] p-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#111318] truncate">
                        {course.title}
                      </p>
                      <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {course.code}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${courseTheme}`}
                    >
                      {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#617789]">
                    <span>{course._count.modules} modules</span>
                    <span>{course._count.enrollments} learners</span>
                  </div>
                  <button
                    onClick={() =>
                      runAction(() => removeCourse(instructor.id, course.id))
                    }
                    disabled={isPending}
                    className="self-start text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
                  >
                    Remove from course
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
