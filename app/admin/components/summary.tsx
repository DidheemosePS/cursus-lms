import School from "@/assets/icons/school.svg";
import ArrowOutward from "@/assets/icons/left-arrow.svg";
import Group from "@/assets/icons/group.svg";
import Active from "@/assets/icons/active.svg";
import Instructors from "@/assets/icons/instructors.svg";
import { getAdminOverviewByOrganization } from "../../../dal/admin/overview.dal";

// export interface SummaryProps {

// }

export default async function Summary({
  organizationId,
}: {
  organizationId: string;
}) {
  const adminOverviewIconTheme = {
    TOTAL_COURSES: (
      <div className="p-2 bg-blue-50 rounded-lg text-primary">
        <School className="size-5 text-[#135BEC]" />
      </div>
    ),
    TOTAL_TEACHERS: (
      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
        <Instructors className="size-5" />
      </div>
    ),
    TOTAL_STUDENTS: (
      <div className="p-2 bg-green-50 rounded-lg text-green-600">
        <Group className="size-5" />
      </div>
    ),
    ACTIVE_COURSES: (
      <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
        <Active className="size-5" />
      </div>
    ),
  };

  const { total_courses, total_instructors, total_learners, active_courses } =
    await getAdminOverviewByOrganization(organizationId);

  const adminOverview = [
    {
      id: 1,
      title: "Total Courses",
      value: total_courses,
      icon: adminOverviewIconTheme["TOTAL_COURSES"],
    },
    {
      id: 2,
      title: "Total Instructors",
      value: total_instructors,
      icon: adminOverviewIconTheme["TOTAL_TEACHERS"],
    },
    {
      id: 3,
      title: "Total Learners",
      value: total_learners,
      icon: adminOverviewIconTheme["TOTAL_STUDENTS"],
    },
    {
      id: 4,
      title: "Active Courses",
      value: active_courses,
      icon: adminOverviewIconTheme["ACTIVE_COURSES"],
    },
  ];

  return (
    <section className="space-y-8">
      <header>
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Admin Overview
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          Monitor courses, users, and platform setup. Use this dashboard to
          manage the overall system structure and health.
        </p>
      </header>
      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <!-- Overview Card --> */}
        {adminOverview?.map((item) => {
          return (
            <div
              key={item?.id}
              className="group bg-white p-5 rounded-lg border border-gray-50 hover:border-[#135BEC]/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                {item?.icon}
                <ArrowOutward className="size-5 text-gray-300 rotate-135 group-hover:text-[#135BEC] transition-colors" />
              </div>
              <p className="text-text-secondary text-sm font-medium">
                {item?.title}
              </p>
              <p className="text-3xl font-bold text-text-main mt-1">
                {item?.value}
              </p>
            </div>
          );
        })}
      </div>
      {/* Secondary Stats Row */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <NoAccounts className="size-5 text-[#647687]" />
              <p className="text-[#647687] text-sm font-medium">
                Courses without assigned instructors
              </p>
            </div>
            <p className="text-lg font-bold text-text-main">2</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <PersonOff className="size-5 text-[#647687]" />
              <p className="text-[#647687] text-sm font-medium">
                Learners Unenrolled
              </p>
            </div>
            <p className="text-lg font-bold text-text-main">5</p>
          </div>
        </div> */}
    </section>
  );
}
