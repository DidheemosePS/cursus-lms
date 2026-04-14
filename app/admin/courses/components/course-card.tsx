import Image from "next/image";
import Link from "next/link";
import Group from "@/assets/icons/group.svg";
import Module from "@/assets/icons/module.svg";
import Arrow from "@/assets/icons/left-arrow.svg";
import type { CourseListItem } from "@/dal/admin/course.dal";

const statusTheme = {
  active: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-amber-100 text-amber-800 border-amber-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
} as const;

const statusLabel = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
} as const;

const DEFAULT_IMAGE =
  "https://lms-mvp-test.s3.eu-west-1.amazonaws.com/covers/default-cover.jpg";

export function CourseCard({ course }: { course: CourseListItem }) {
  const theme =
    statusTheme[course.status as keyof typeof statusTheme] ?? statusTheme.draft;
  const label =
    statusLabel[course.status as keyof typeof statusLabel] ?? "Draft";

  return (
    <div className="group relative grid place-items-end rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Cover image */}
      <div className="relative w-full h-52 col-[1/2] row-[1/2]">
        <Image
          src={course.coverImageUrl || DEFAULT_IMAGE}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={course.title}
          className="object-cover brightness-[0.55] group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Status badge */}
      <span
        className={`absolute top-3 right-3 z-50 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme}`}
      >
        {label}
      </span>

      {/* Content overlay */}
      <div className="col-[1/2] row-[1/2] z-10 p-5 flex flex-col self-end w-full text-white backdrop-blur-[2px] rounded-b-xl">
        <span className="max-w-max px-2 py-0.5 rounded text-xs font-bold bg-white text-[#135BEC] mb-2">
          {course.code}
        </span>
        <p className="text-base font-bold leading-snug mb-1 line-clamp-1">
          {course.title}
        </p>
        <p className="text-xs text-white/70 line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Module className="size-3.5 text-white/70" />
            <span className="text-xs text-white/80">
              {course._count.modules}{" "}
              {course._count.modules === 1 ? "Module" : "Modules"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Group className="size-3.5 text-white/70" />
            <span className="text-xs text-white/80">
              {course._count.enrollments}{" "}
              {course._count.enrollments === 1 ? "Learner" : "Learners"}
            </span>
          </div>
          <Link
            href={`/admin/courses/${course.id}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/30 bg-white/10 hover:bg-white/20 transition-colors ml-auto"
          >
            <span>Edit</span>
            <Arrow className="size-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
