import Image from "next/image";
import Link from "next/link";
import Group from "@/assets/icons/group.svg";
import Module from "@/assets/icons/module.svg";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    code: string;
    coverImageUrl: string;
    _count: { modules: number; enrollments: number };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={course.coverImageUrl}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

        {/* Course code badge — sits over image bottom-left */}
        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-amber-700 border border-amber-200 backdrop-blur-sm">
          {course.code}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title + description */}
        <div className="flex-1">
          <p className="text-base font-bold text-[#111318] leading-snug line-clamp-2">
            {course.title}
          </p>
          <p className="mt-1.5 text-sm text-[#616f89] line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#616f89]">
            <Module className="size-4 shrink-0" />
            <span className="text-xs font-medium">
              {course._count.modules}{" "}
              {course._count.modules === 1 ? "Module" : "Modules"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#616f89]">
            <Group className="size-4 shrink-0" />
            <span className="text-xs font-medium">
              {course._count.enrollments}{" "}
              {course._count.enrollments === 1 ? "Learner" : "Learners"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/instructor/courses/${course.id}`}
          className="w-full text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-[#111318] text-white transition-opacity hover:opacity-80"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
