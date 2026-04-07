"use client";

import Image from "next/image";
import { useTransition } from "react";
import { LearnerDetail } from "@/dal/instructors/learners.dal";
import { startDirectChat } from "@/actions/chat.actions";
import Badges from "../badges";
import { timeStampStyling } from "@/utils/timestamp-formatter";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

interface LearnerDrawerContentProps {
  learner: NonNullable<LearnerDetail>;
  courseId: string;
}

export default function LearnerDrawerContent({
  learner,
  courseId,
}: LearnerDrawerContentProps) {
  const [isPending, startTransition] = useTransition();

  function handleMessage() {
    startTransition(async () => {
      await startDirectChat(learner.id, courseId, "/instructor/chats");
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Learner profile ── */}
      <div className="flex items-center gap-4">
        <div className="relative size-16 rounded-full overflow-hidden border border-gray-100 shrink-0">
          <Image
            src={learner.avatar ?? DEFAULT_AVATAR}
            alt={learner.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-lg font-bold text-[#111318] truncate">
            {learner.name}
          </p>
          <p className="text-sm text-[#617789] truncate">{learner.email}</p>
        </div>
        <button
          onClick={handleMessage}
          disabled={isPending}
          className="ml-auto shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {isPending ? "Opening…" : "Message"}
        </button>
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* ── Enrolled courses ── */}
      <div className="flex flex-col gap-5">
        <p className="text-sm font-bold text-[#111318] uppercase tracking-wider">
          Courses
        </p>

        {learner.enrollments.map((enrollment) => {
          const course = enrollment.course;
          const totalModules = course._count.modules;
          const progress = Math.min(
            100,
            Math.round(enrollment.progressPercent),
          );

          return (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-xl border border-[#f0f2f4] p-4"
            >
              {/* Course header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#111318]">
                    {course.title}
                  </p>
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {course.code}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#135BEC]">
                    {progress}%
                  </p>
                  <p className="text-xs text-[#617789]">
                    {enrollment.completedModules} of {totalModules} modules
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#135BEC] rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* ── Modules ── */}
              <div className="flex flex-col gap-2">
                {course.modules.map((module) => {
                  const submission = module.submissions[0] ?? null;
                  const isPastDue = new Date(module.dueDate) < new Date();
                  const isSubmitted = !!submission;
                  const isLate = submission?.isLate ?? false;
                  const isReviewed = submission?.status === "reviewed";
                  const hasFeedback = !!submission?.feedback;
                  const { datePart, timePart } = timeStampStyling(
                    submission.createdAt,
                  );

                  return (
                    <div
                      key={module.id}
                      className={`rounded-lg border p-3 flex flex-col gap-2 ${
                        isLate
                          ? "border-red-100 bg-red-50/30"
                          : isSubmitted
                            ? "border-green-100 bg-green-50/20"
                            : isPastDue
                              ? "border-red-100 bg-red-50/20"
                              : "border-[#f0f2f4] bg-gray-50/50"
                      }`}
                    >
                      {/* Module row */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#111318] truncate">
                          Module {module.position} · {module.title}
                        </p>
                        <div className="shrink-0">
                          {!isSubmitted && isPastDue ? (
                            <Badges
                              badgesProps={{ badge_variant: "LATE", late: 1 }}
                            />
                          ) : !isSubmitted ? (
                            <Badges
                              badgesProps={{
                                badge_variant: "PENDING",
                                pending: 1,
                              }}
                            />
                          ) : (
                            <Badges
                              badgesProps={{ badge_variant: "ALL_CAUGHT_UP" }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Submission detail */}
                      {submission && (
                        <div className="flex flex-col gap-1.5 pt-1 border-t border-[#f0f2f4]">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[#617789] truncate max-w-[60%]">
                              {submission.fileName}
                            </p>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isLate
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {isLate ? "Late" : "On time"}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#617789]">
                            Submitted {datePart} {timePart}
                          </p>

                          {/* Feedback */}
                          {hasFeedback ? (
                            <div className="mt-1 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                                Feedback given
                              </p>
                              <p className="text-xs text-[#111318] leading-relaxed line-clamp-3">
                                {submission.feedback!.content}
                              </p>
                            </div>
                          ) : isReviewed ? null : (
                            <button className="mt-1 w-full text-xs font-semibold py-1.5 px-3 rounded-lg border border-[#dbe1e6] text-[#111318] hover:bg-gray-50 transition-colors">
                              Review submission
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
