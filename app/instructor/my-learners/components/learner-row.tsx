import Image from "next/image";
import Badges from "./badges";
import LearnerDrawer from "./learner-drawer/learner-drawer";
import type { LearnerRow } from "@/dal/instructors/learners.dal";

export function LearnerRow({ learner }: { learner: LearnerRow }) {
  const progress = Math.min(
    100,
    Math.max(
      0,
      learner.totalModules > 0
        ? Math.round((learner.completedModules / learner.totalModules) * 100)
        : 0,
    ),
  );

  return (
    <div
      className={`group flex flex-col @5xl:grid @5xl:grid-cols-5 gap-4 p-4 md:px-6 md:py-5 items-center transition-colors ${
        learner.lateCount > 0 ? "bg-red-50/30" : "bg-white"
      } hover:bg-gray-50`}
    >
      {/* Learner */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
          <Image
            src={learner.avatar}
            alt={`${learner.name}'s avatar`}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[#111518] text-sm font-bold truncate">
            {learner.name}
          </p>
        </div>
      </div>

      {/* Course */}
      <div className="w-full flex justify-between border-b border-gray-200 @5xl:border-0 pb-2 @5xl:pb-0">
        <span className="@5xl:hidden text-xs font-medium text-gray-500">
          Course
        </span>
        <p
          className="text-[#111518] text-sm font-medium truncate"
          title={learner.courseTitle}
        >
          {learner.courseTitle}
        </p>
      </div>

      {/* Progress */}
      <div className="w-full flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-[#617789] tracking-wider uppercase">
          Module Completed
        </span>
        <div className="flex justify-between text-xs font-medium text-[#111318]">
          <span>
            {learner.completedModules} of {learner.totalModules} modules
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#135BEC] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status badges */}
      <div className="w-full flex flex-col gap-1">
        <span className="@5xl:hidden text-[10px] font-bold text-[#617789] tracking-wider uppercase">
          Status
        </span>
        <div className="flex flex-wrap gap-2">
          {learner.lateCount > 0 && (
            <Badges
              badgesProps={{ badge_variant: "LATE", late: learner.lateCount }}
            />
          )}
          {learner.pendingCount > 0 && (
            <Badges
              badgesProps={{
                badge_variant: "PENDING",
                pending: learner.pendingCount,
              }}
            />
          )}
          {learner.lateCount === 0 && learner.pendingCount === 0 && (
            <Badges badgesProps={{ badge_variant: "ALL_CAUGHT_UP" }} />
          )}
        </div>
      </div>

      {/* Action — single button opens drawer */}
      <div className="w-full">
        <LearnerDrawer
          learnerId={learner.learnerId}
          courseId={learner.courseId}
        >
          <button className="w-full flex items-center justify-center h-10 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white font-bold text-sm shadow-sm transition-colors">
            View Learner
          </button>
        </LearnerDrawer>
      </div>
    </div>
  );
}
