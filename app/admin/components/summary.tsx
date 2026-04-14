import School from "@/assets/icons/school.svg";
import ArrowOutward from "@/assets/icons/left-arrow.svg";
import Group from "@/assets/icons/group.svg";
import Active from "@/assets/icons/active.svg";
import Instructors from "@/assets/icons/instructors.svg";
import Link from "next/link";
import type { AdminOverview } from "@/dal/admin/overview.dal";

const STAT_CARDS = (overview: AdminOverview) => [
  {
    id: 1,
    title: "Total Courses",
    value: overview.total_courses,
    href: "/admin/courses",
    icon: (
      <div className="p-2 bg-blue-50 rounded-lg">
        <School className="size-5 text-[#135BEC]" />
      </div>
    ),
  },
  {
    id: 2,
    title: "Total Instructors",
    value: overview.total_instructors,
    href: "/admin/instructors",
    icon: (
      <div className="p-2 bg-purple-50 rounded-lg">
        <Instructors className="size-5 text-purple-600" />
      </div>
    ),
  },
  {
    id: 3,
    title: "Total Learners",
    value: overview.total_learners,
    href: "/admin/learners",
    icon: (
      <div className="p-2 bg-green-50 rounded-lg">
        <Group className="size-5 text-green-600" />
      </div>
    ),
  },
  {
    id: 4,
    title: "Active Courses",
    value: overview.active_courses,
    href: "/admin/courses?status=active",
    icon: (
      <div className="p-2 bg-orange-50 rounded-lg">
        <Active className="size-5 text-orange-600" />
      </div>
    ),
  },
];

export default function Summary({ overview }: { overview: AdminOverview }) {
  const cards = STAT_CARDS(overview);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Admin Overview
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          Monitor courses, users, and platform setup.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group bg-white p-5 rounded-lg border border-gray-50 hover:border-[#135BEC]/20 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              {card.icon}
              <ArrowOutward className="size-5 text-gray-300 rotate-135 group-hover:text-[#135BEC] transition-colors" />
            </div>
            <p className="text-sm font-medium text-[#616f89]">{card.title}</p>
            <p className="text-3xl font-bold text-[#111318] mt-1">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
