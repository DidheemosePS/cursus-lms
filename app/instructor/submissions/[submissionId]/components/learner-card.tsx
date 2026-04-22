import Image from "next/image";
import type { SubmissionDetail } from "@/dal/instructors/submission-review.dal";

const DEFAULT_AVATAR =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/profileImage/avataaars.png";

type Learner = NonNullable<SubmissionDetail>["learner"];

export function LearnerCard({
  learner,
  courseTitle,
  totalModules,
}: {
  learner: Learner;
  courseTitle: string;
  totalModules: number;
}) {
  const enrollment = learner.enrollments[0];
  const completedModules = enrollment?.completedModules ?? 0;
  const progress =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#f0f2f4] bg-white p-5 shadow-sm">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="relative size-12 rounded-full overflow-hidden border border-gray-100 shrink-0">
          <Image
            src={learner.avatar || DEFAULT_AVATAR}
            alt={learner.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-bold text-[#111318] truncate">
            {learner.name}
          </p>
          <p className="text-xs text-[#617789] truncate">{learner.email}</p>
        </div>
      </div>

      <div className="h-px bg-[#f0f2f4]" />

      {/* Course progress */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-[#617789] uppercase tracking-wider">
          Course Progress
        </p>
        <p className="text-sm font-medium text-[#111318] truncate">
          {courseTitle}
        </p>
        <div className="flex justify-between text-xs text-[#617789]">
          <span>
            {completedModules} of {totalModules} modules
          </span>
          <span className="font-semibold text-[#135BEC]">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#135BEC] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
