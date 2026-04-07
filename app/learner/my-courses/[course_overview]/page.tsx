import Link from "next/link";
import LeftArrow from "@/assets/icons/left-arrow.svg";
import { redirect } from "next/navigation";
import Completed from "./modules-theme/completed";
import Current from "./modules-theme/current";
import Locked from "./modules-theme/locked";
import { getLearnerCourseOverview } from "@/dal/learners/courses";

export interface Submission {
  id: string;
  fileName: string;
  fileUrl: string;
  status: "submitted" | "reviewed";
  isLate: boolean;
  attemptNumber: number;
  fileSize: number;
  updatedAt: Date;
}

export interface Module {
  id: string;
  submissions: Submission[];
  title: string;
  description: string;
  position: number;
  startDate: Date;
  dueDate: Date;
}

type ModuleState = "completed" | "current" | "next_locked" | "locked";

// Pre-compute all module states in a single pass before render
// Avoids mutating variables during JSX map which Next.js does not allow
function getModuleStates(modules: Module[]): Map<string, ModuleState> {
  const states = new Map<string, ModuleState>();
  let currentAssigned = false;
  let nextLockedAssigned = false;

  for (const m of modules) {
    if (m.submissions.length > 0) {
      states.set(m.id, "completed");
    } else if (!currentAssigned) {
      states.set(m.id, "current");
      currentAssigned = true;
    } else if (!nextLockedAssigned) {
      states.set(m.id, "next_locked");
      nextLockedAssigned = true;
    } else {
      states.set(m.id, "locked");
    }
  }

  return states;
}

export default async function Page({
  params,
}: {
  params: Promise<{ course_overview: string }>;
}) {
  const { course_overview } = await params;

  const course = await getLearnerCourseOverview(course_overview);
  if (!course) redirect("/learner/my-courses");

  const totalModules = course.modules.length;
  const completedModules = course.enrollments[0]?.completedModules ?? 0;
  const progressPercent =
    totalModules > 0
      ? Math.min(100, Math.round((completedModules / totalModules) * 100))
      : 0;

  const moduleStates = getModuleStates(course.modules as Module[]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12">
      <Link
        href="/learner/my-courses"
        className="flex items-center gap-2 mb-6 text-sm text-[#616f89] hover:text-[#111318] transition-colors w-fit"
      >
        <LeftArrow className="size-4" />
        <span>Back to My Courses</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-[#111318] mb-2">
            {course.title}
          </p>
          <p className="text-[#616f89] text-sm leading-relaxed max-w-2xl">
            {course.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white border border-[#f0f2f4] rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-[#617789] uppercase tracking-wider mb-2">
            Overall Progress
          </p>
          <p className="text-3xl font-black text-[#111318] mb-1">
            {progressPercent}%
          </p>
          <div className="w-full bg-[#e5e7eb] rounded-full h-1.5 mb-2">
            <div
              className="bg-[#135BEC] h-1.5 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-[#617789]">
            {completedModules} of {totalModules} modules complete
          </p>
        </div>
        {course.modules.map((m) => {
          const state = moduleStates.get(m.id);

          if (state === "completed") return <Completed key={m.id} module={m} />;
          if (state === "current") return <Current key={m.id} module={m} />;
          if (state === "next_locked")
            return <Locked key={m.id} module={m} showDisabledButton />;
          return <Locked key={m.id} module={m} />;
        })}
      </div>
    </div>
  );
}
