import School from "@/assets/icons/school.svg";
import ArrowOutward from "@/assets/icons/left-arrow.svg";
import Group from "@/assets/icons/group.svg";
import Active from "@/assets/icons/active.svg";
import Teachers from "@/assets/icons/teachers.svg";
import NoAccounts from "@/assets/icons/no-accounts.svg";
import PersonOff from "@/assets/icons/person-off.svg";
import Warning from "@/assets/icons/warning.svg";
import Notice from "@/assets/icons/notice.svg";
import PlatformSettings from "@/assets/icons/platform-settings.svg";
import Link from "next/link";

export default function Page() {
  const recent_activitys = [
    {
      id: 1,
      action: "Created",
      target: "Course: Advanced Web Dev",
      userId: 12331,
      name: "Sarah J.",
      time: "2 hrs ago",
    },
    {
      id: 2,
      action: "Assigned",
      target: "Teacher: Mark T. -> Intro to Python",
      userId: 54242,
      name: "System Auto",
      time: "5 hrs ago",
    },
    {
      id: 3,
      action: "Updated",
      target: "Settings: Enrollment Window",
      userId: 82323,
      name: "Sarah J.",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <header className="mb-8 flex flex-col justify-baseline gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Admin Overview
          </p>
          <p className="mt-1 text-sm text-[#616f89]">
            Monitor courses, users, and platform setup. Use this dashboard to
            manage the overall system structure and health.
          </p>
        </div>
      </header>

      {/* Summary Cards Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <!-- Card 1 --> */}
          <div className="group bg-white p-5 rounded-lg border border-gray-50 hover:border-[#135BEC]/20 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-primary">
                <School className="size-5 text-[#135BEC]" />
              </div>
              <ArrowOutward className="size-5 text-gray-300 rotate-135 group-hover:text-[#135BEC] transition-colors" />
            </div>
            <p className="text-text-secondary text-sm font-medium">
              Total Courses
            </p>
            <p className="text-3xl font-bold text-text-main mt-1">24</p>
          </div>
          {/* <!-- Card 2 --> */}
          <div className="group bg-white p-5 rounded-lg border border-gray-50 hover:border-[#135BEC]/20 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Teachers className="size-5" />
              </div>
              <ArrowOutward className="size-5 text-gray-300 rotate-135 group-hover:text-[#135BEC] transition-colors" />
            </div>
            <p className="text-text-secondary text-sm font-medium">
              Total Teachers
            </p>
            <p className="text-3xl font-bold text-text-main mt-1">8</p>
          </div>
          {/* <!-- Card 3 --> */}
          <div className="group bg-white p-5 rounded-lg border border-gray-50 hover:border-[#135BEC]/20 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Group className="size-5" />
              </div>
              <ArrowOutward className="size-5 text-gray-300 rotate-135 group-hover:text-[#135BEC] transition-colors" />
            </div>
            <p className="text-text-secondary text-sm font-medium">
              Total Students
            </p>
            <p className="text-3xl font-bold text-text-main mt-1">150</p>
          </div>
          {/* <!-- Card 4 --> */}
          <div className="group bg-white p-5 rounded-lg border border-gray-50 hover:border-[#135BEC]/20 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Active className="size-5" />
              </div>
              <ArrowOutward className="size-5 text-gray-300 rotate-135 group-hover:text-[#135BEC] transition-colors" />
            </div>
            <p className="text-text-secondary text-sm font-medium">
              Active Courses
            </p>
            <p className="text-3xl font-bold text-text-main mt-1">12</p>
          </div>
        </div>
        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <NoAccounts className="size-5 text-[#647687]" />
              <p className="text-[#647687] text-sm font-medium">
                Courses without assigned teachers
              </p>
            </div>
            <p className="text-lg font-bold text-text-main">2</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <PersonOff className="size-5 text-[#647687]" />
              <p className="text-[#647687] text-sm font-medium">
                Students Unenrolled
              </p>
            </div>
            <p className="text-lg font-bold text-text-main">5</p>
          </div>
        </div>
      </section>

      {/* System Alerts */}
      <section className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-gray-50/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
            System Alerts
          </h3>
        </div>
        <div className="divide-y divide-[#f0f2f4]">
          {/* Alert Item 1 */}
          <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
            <Warning className="size-5 text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-[#111318] text-sm font-medium">
                Missing Instructor Assignment
              </p>
              <p className="text-[#647687] text-sm">
                2 courses currently have no assigned teacher. This may prevent
                students from accessing materials.
              </p>
            </div>
            <button className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium cursor-pointer">
              Resolve
            </button>
          </div>
          {/* Alert Item 2 */}
          <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
            <Notice className="size-5 text-[#647687] mt-0.5" />
            <div className="flex-1">
              <p className="text-[#111318] text-sm font-medium">
                Unenrolled Students
              </p>
              <p className="text-[#647687] text-sm">
                5 registered students are not enrolled in any active courses.
              </p>
            </div>
            <button className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium cursor-pointer">
              View List
            </button>
          </div>
        </div>
      </section>

      {/* Management Shortcuts */}
      <section>
        <h2 className="text-xl font-bold text-text-main mb-4">
          Management Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Shortcut 1 */}
          <Link
            className="group flex flex-col h-full justify-between gap-4 bg-white p-6 rounded-lg border border-gray-50 shadow-sm hover:border-[#135BEC]/30 hover:shadow-md transition-all"
            href="#"
          >
            <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Active className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Manage Courses</h3>
              <p className="text-sm mt-1 text-[#647687]">
                Create, edit &amp; assign
              </p>
            </div>
          </Link>
          {/* Shortcut 2 */}
          <Link
            className="group flex flex-col h-full justify-between gap-4 bg-white p-6 rounded-lg border border-gray-50 shadow-sm hover:border-[#135BEC]/30 hover:shadow-md transition-all"
            href="#"
          >
            <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Group className="size-5" />
            </div>
            <div>
              <h3 className="text-text-main font-bold text-lg group-hover:text-primary transition-colors">
                Manage Teachers
              </h3>
              <p className="text-sm mt-1 text-[#647687]">
                Staff directory &amp; roles
              </p>
            </div>
          </Link>
          {/* Shortcut 3 */}
          <Link
            className="group flex flex-col h-full justify-between gap-4 bg-white p-6 rounded-lg border border-gray-50 shadow-sm hover:border-[#135BEC]/30 hover:shadow-md transition-all"
            href="#"
          >
            <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <School className="size-5" />
            </div>
            <div>
              <h3 className="text-text-main font-bold text-lg group-hover:text-primary transition-colors">
                Manage Students
              </h3>
              <p className="text-sm mt-1 text-[#647687]">
                Enrollment &amp; roster
              </p>
            </div>
          </Link>
          {/* Shortcut 4 */}
          <Link
            className="group flex flex-col h-full justify-between gap-4 bg-white p-6 rounded-lg border border-gray-50 shadow-sm hover:border-[#135BEC]/30 hover:shadow-md transition-all"
            href="#"
          >
            <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <PlatformSettings className="size-5" />
            </div>
            <div>
              <h3 className="text-text-main font-bold text-lg group-hover:text-primary transition-colors">
                Platform Settings
              </h3>
              <p className="text-sm mt-1 text-[#647687]">
                System configuration
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="@container">
        <header className="mb-4 flex justify-between">
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Recent Structural Activity
          </p>
          <button className="text-[#135BEC] hover:text-[#135BEC]/80 text-sm font-medium cursor-pointer">
            View Log
          </button>
        </header>
        <div className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-200/50">
            <span>Action</span>
            <span>Target</span>
            <span>User</span>
            <span>Time</span>
          </div>
          {recent_activitys?.map((activity) => {
            return (
              <div
                key={activity?.id}
                className="group grid grid-cols-4 items-center gap-4 p-4 @5xl:px-6 @5xl:py-5 transition-colors bg-white hover:bg-gray-50"
              >
                <div
                  className={`max-w-max inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                    activity?.action === "Created" &&
                    "bg-green-100 text-green-700"
                  } ${
                    activity?.action === "Assigned" &&
                    "bg-blue-100 text-blue-700"
                  } ${
                    activity?.action === "Updated" &&
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {activity?.action}
                </div>
                <p className="font-medium text-[#111318]">{activity?.target}</p>
                <p className="text-[#647687]">{activity?.name}</p>
                <p className="text-[#647687]">{activity?.time}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
