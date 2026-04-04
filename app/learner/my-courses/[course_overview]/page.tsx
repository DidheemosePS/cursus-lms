import Link from "next/link";
import LeftArrow from "@/assets/icons/left-arrow.svg";
import { getSession } from "@/lib/auth/auth";
import Completed from "./modules-theme/completed";
import Current from "./modules-theme/current";
import Locked from "./modules-theme/locked";
import { getLearnerCourseOverview } from "@/dal/admin/learners.dal";
import prisma from "@/lib/prisma.init";

export interface Submission {
  id: string;
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

export default async function Page({
  params,
}: {
  params: Promise<{ course_overview: string }>;
}) {
  const { course_overview } = await params;

  const { organizationId, userId } = await getSession();

  const courseById = await getLearnerCourseOverview(
    course_overview,
    organizationId,
    userId as string,
  );

  let currentShown = false;
  let disabledShown = false;

  return (
    <div className="px-4 py-8 md:px-12">
      <Link
        href="/learner/my-courses"
        className="flex items-center gap-2 mb-6 text-sm text-[#616f89]"
      >
        <LeftArrow className="size-5" />
        <span>Back to All Courses</span>
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <p className="text-2xl font-bold text-[#111318] mb-2">
            {courseById?.title}
          </p>
          <p className="text-[#616f89] max-w-2xl">{courseById?.description}</p>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="text-blue-500 font-bold text-sm">
            Overall Progress: {courseById?.enrollments[0].progressPercent ?? 0}%
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {courseById?.modules.map((m) => {
          const completed = m.submissions?.length > 0;

          if (completed) {
            return <Completed key={m.id} module={m} />;
          }

          if (!currentShown) {
            currentShown = true;
            return <Current key={m.id} module={m} />;
          }

          if (!disabledShown) {
            disabledShown = true;
            return <Locked key={m.id} showDisabledButton module={m} />;
          }

          return <Locked key={m.id} module={m} />;
        })}
      </div>
    </div>
  );
}
