import Link from "next/link";
import Image from "next/image";
import { Courses } from "./course-list";
import Module from "@/assets/icons/module.svg";

export type Status = "in_progress" | "not_started" | "completed";

const statusColorTheme = {
  in_progress: "bg-blue-100 text-blue-700",
  not_started: "bg-gray-100 text-gray-700",
  completed: "bg-green-100 text-green-700",
} as const;

export default function CourseCard({ courses }: { courses: Courses }) {
  return (
    <Link
      href={`my-courses/${courses.course?.id}`}
      className="group grid place-courses-end rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
    >
      <Image
        src={courses.course?.coverImageUrl}
        width={100}
        height={100}
        alt="logo"
        className="w-full rounded-lg shadow-2xl bg-gray-200 col-[1/2] row-[1/2] filter-[brightness(.6)] object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="col-[1/2] row-[1/2] z-10 p-5 flex flex-col self-end text-white backdrop-blur-[2px] rounded-b-lg translate-y-20 transition-all duration-500 group-hover:translate-y-0 overflow-hidden">
        <span
          className={`${statusColorTheme[courses.progressStatus as Status] ?? "bg-gray-100 text-gray-700"} max-w-max px-2.5 py-0.5 rounded-full text-xs font-medium`}
        >
          {courses.progressStatus === "in_progress" && "In Progress"}
          {courses.progressStatus === "not_started" && "Not Started"}
          {courses.progressStatus === "completed" && "Completed"}
        </span>
        <p className="text-lg font-bold leading-snug mb-1 mt-3">
          {courses.course?.title}
        </p>
        <p className="text-sm line-clamp-2">{courses.course?.description}</p>
        <div className="mt-4 mb-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="flex justify-between text-xs font-medium text-[#ffffff] mb-2">
            <span>Progress</span>
            <span>{courses.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#f0f2f4] rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${courses.progressPercent ?? 0}%` }}
            ></div>
          </div>
        </div>
        <div className="flex courses-center gap-2 mt-2 mb-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Module className="size-4" />
          <span className="text-xs text-[#ffffff]">
            {courses.course._count.modules} Modules
          </span>
        </div>
      </div>
    </Link>
  );
}
