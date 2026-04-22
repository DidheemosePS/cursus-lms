"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import type { LearnerDetail, AvailableCourse } from "@/dal/admin/learners.dal";
import {
  changeLearnerStatus,
  enrollLearner,
  unenrollLearner,
  resendInvite,
} from "@/actions/admin-learner.actions";

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

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function AdminLearnerDrawerContent({
  learner,
  availableCourses,
}: {
  learner: NonNullable<LearnerDetail>;
  availableCourses: AvailableCourse[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const isPendingInvite = learner.status === "pending_invite";

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
    statusTheme[learner.status as keyof typeof statusTheme] ??
    statusTheme.inactive;
  const label =
    statusLabel[learner.status as keyof typeof statusLabel] ?? "Unknown";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="relative size-14 rounded-full overflow-hidden border border-gray-100 shrink-0">
          <Image
            src={learner.avatar || DEFAULT_AVATAR}
            alt={learner.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-base font-bold text-[#111318] truncate">
            {learner.name}
          </p>
          <p className="text-sm text-[#617789] truncate">{learner.email}</p>
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
            This learner hasn&apos;t accepted their invite. They won&apos;t be able to
            access course content until they do. You can still enroll them —
            access activates when they join.
          </p>
          <button
            onClick={() => runAction(() => resendInvite(learner.id))}
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
          {learner.status !== "active" && (
            <button
              onClick={() =>
                runAction(() => changeLearnerStatus(learner.id, "active"))
              }
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-60"
            >
              Set Active
            </button>
          )}
          {learner.status !== "inactive" && (
            <button
              onClick={() =>
                runAction(() => changeLearnerStatus(learner.id, "inactive"))
              }
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              Deactivate
            </button>
          )}
        </div>
        <p className="text-xs text-[#617789]">
          Joined {formatDate(learner.createdAt)}
        </p>
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* Add to course — always visible */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
          Add to Course
        </p>
        {availableCourses.length === 0 ? (
          <p className="text-xs text-[#617789]">
            This learner is already enrolled in all available courses.
          </p>
        ) : (
          <div className="flex gap-2">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm text-[#111318] outline-0 ring ring-[#dbe1e6] focus:ring-[#135BEC] bg-white appearance-none"
            >
              <option value="">Choose a course to enroll them in…</option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.code})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!selectedCourseId) return;
                runAction(() => enrollLearner(learner.id, selectedCourseId));
                setSelectedCourseId("");
              }}
              disabled={isPending || !selectedCourseId}
              className="px-4 py-2 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              Enroll
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* Enrolled courses */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
          Enrolled Courses ({learner.enrollments.length})
        </p>
        {learner.enrollments.length === 0 ? (
          <p className="text-sm text-[#617789]">
            Not enrolled in any courses yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {learner.enrollments.map((enrollment) => {
              const totalModules = enrollment.course._count.modules;
              const progress =
                totalModules > 0
                  ? Math.round(
                      (enrollment.completedModules / totalModules) * 100,
                    )
                  : 0;
              const isEnrolled = enrollment.enrollmentStatus === "enrolled";

              return (
                <div
                  key={enrollment.course.id}
                  className="rounded-xl border border-[#f0f2f4] p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#111318] truncate">
                        {enrollment.course.title}
                      </p>
                      <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {enrollment.course.code}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isEnrolled
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {isEnrolled ? "Enrolled" : "Unenrolled"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-[#617789]">
                      <span>
                        {enrollment.completedModules} of {totalModules} modules
                      </span>
                      <span className="font-semibold text-[#135BEC]">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#135BEC] rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  {isEnrolled && (
                    <button
                      onClick={() =>
                        runAction(() =>
                          unenrollLearner(learner.id, enrollment.course.id),
                        )
                      }
                      disabled={isPending}
                      className="self-start text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
                    >
                      Unenroll from this course
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
