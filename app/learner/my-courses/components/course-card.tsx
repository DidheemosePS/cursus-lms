import Link from "next/link";
import Image from "next/image";
import Module from "@/assets/icons/module.svg";
import { CourseEnrollment } from "@/dal/learners/courses";

export type Status = "in_progress" | "not_started" | "completed";

// Base theme per progressStatus
const statusTheme = {
  in_progress: {
    badge: "bg-blue-100 text-blue-700",
    label: "In Progress",
    button: "bg-blue-500 hover:bg-blue-600 text-white",
    buttonLabel: "Continue",
  },
  not_started: {
    badge: "bg-gray-100 text-gray-700",
    label: "Not Started",
    button: "bg-white/20 hover:bg-white/30 text-white",
    buttonLabel: "Start Course",
  },
  completed: {
    badge: "bg-green-100 text-green-700",
    label: "Completed",
    button: "bg-green-500 hover:bg-green-600 text-white",
    buttonLabel: "Review",
  },
} as const;

// Override theme when completed but pending instructor review
const awaitingReviewTheme = {
  badge: "bg-amber-100 text-amber-700",
  label: "Awaiting Review",
  button: "bg-amber-500 hover:bg-amber-600 text-white",
  buttonLabel: "View Course",
};

export default function CourseCard({
  enrollment,
}: {
  enrollment: CourseEnrollment;
}) {
  const { course, progressStatus, completedModules, hasPendingReview } =
    enrollment;
  const totalModules = course._count.modules;

  const progressPercent =
    totalModules > 0
      ? Math.min(100, Math.round((completedModules / totalModules) * 100))
      : 0;

  // Use awaiting review theme when completed but instructor hasn't reviewed all
  const isAwaitingReview = progressStatus === "completed" && hasPendingReview;

  const theme = isAwaitingReview
    ? awaitingReviewTheme
    : (statusTheme[progressStatus as Status] ?? statusTheme.not_started);

  return (
    <Link
      href={`/learner/my-courses/${course.id}`}
      className="group grid place-items-end rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative w-full h-52 col-[1/2] row-[1/2]">
        <Image
          src={course.coverImageUrl}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={course.title}
          className="object-cover brightness-[0.55] group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content overlay */}
      <div className="col-[1/2] row-[1/2] z-10 p-5 flex flex-col self-end w-full text-white backdrop-blur-[2px] rounded-b-xl">
        {/* Status badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`${theme.badge} max-w-max px-2.5 py-0.5 rounded-full text-xs font-semibold`}
          >
            {theme.label}
          </span>
          {/* Extra pill when awaiting review */}
          {isAwaitingReview && (
            <span className="text-[10px] font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
              Submitted · Pending instructor review
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-base font-bold leading-snug mt-3 mb-1 line-clamp-2">
          {course.title}
        </p>

        {/* Description */}
        <p className="text-xs text-white/70 line-clamp-2">
          {course.description}
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
            <span>
              {completedModules} of {totalModules}{" "}
              {totalModules === 1 ? "module" : "modules"}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isAwaitingReview ? "bg-amber-400" : "bg-white"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 mb-1">
          <div className="flex items-center gap-1.5 text-white/70">
            <Module className="size-3.5" />
            <span className="text-xs">
              {totalModules} {totalModules === 1 ? "Module" : "Modules"}
            </span>
          </div>
          <span
            className={`${theme.button} text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors`}
          >
            {theme.buttonLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
