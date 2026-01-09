import Group from "@/assets/icons/group.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import Warning from "@/assets/icons/warning.svg";
import Search from "@/assets/icons/search.svg";
import Filter from "@/assets/icons/platform-settings.svg";
import DownArrow from "@/assets/icons/down-arrow.svg";
import Image from "next/image";

interface EnrollmentData {
  id: number;
  userId: number;
  avatar: string;
  name: string;
  email: string;
  isActive: boolean;
  isEnrolled: "ENROLLED" | "NOT_ENROLLED" | "PENDING";
  activityOn: string;
  courses: number;
}

export default function Page() {
  const summary_icons = {
    GROUP: (
      <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
        <Group className="size-5" />
      </div>
    ),
    CIRCLE_TICK: (
      <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
        <CircleTick className="size-5" />
      </div>
    ),
    WARNING: (
      <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
        <Warning className="size-5" />
      </div>
    ),
  };
  const summary = [
    {
      id: 1,
      title: "Total Students",
      total_students: 2543,
      icon: summary_icons["GROUP"],
    },
    {
      id: 2,

      title: "Enrolled",
      total_students: 1890,
      icon: summary_icons["CIRCLE_TICK"],
    },
    {
      id: 3,
      title: "Unenrolled",
      total_students: 653,
      icon: summary_icons["WARNING"],
    },
  ];

  const enrollment_data: EnrollmentData[] = [
    {
      id: 1,
      userId: 892345,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=2",
      name: "Alice Johnson",
      email: "alice.j@university.edu",
      isActive: true,
      isEnrolled: "ENROLLED",
      activityOn: "Mar 12, 2026",
      courses: 3,
    },
    {
      id: 2,
      userId: 892346,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=1",
      name: "Michael Chen",
      email: "m.chen@university.edu",
      isActive: false,
      isEnrolled: "NOT_ENROLLED",
      activityOn: "Jan 15, 2026",
      courses: 0,
    },
    {
      id: 3,
      userId: 892347,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=3",
      name: "Sarah Smith",
      email: "sarah.s@university.edu",
      isActive: true,
      isEnrolled: "ENROLLED",
      activityOn: "Mar 10, 2026",
      courses: 5,
    },
    {
      id: 4,
      userId: 892348,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=4",
      name: "James Wilson",
      email: "j.wilson@university.edu",
      isActive: true,
      isEnrolled: "PENDING",
      activityOn: "Mar 10, 2026",
      courses: 0,
    },
  ];

  const enrollment_badge = {
    ENROLLED: (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
        Active
      </span>
    ),
    NOT_ENROLLED: (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-700 border border-slate-100">
        Not Enrolled
      </span>
    ),
    PENDING: (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
        Pending Invite
      </span>
    ),
  };

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 flex flex-col gap-8">
      <header className="space-y-1">
        <p className="text-2xl font-bold tracking-tight text-[#111318]">
          Admin Students
        </p>
        <p className="mt-1 text-sm text-[#616f89]">
          Manage all registered students and their course enrollments.
        </p>
      </header>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {summary?.map((item) => {
          return (
            <div
              key={item?.id}
              className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#135BEC]/30 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  {item?.title}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {item?.total_students}
                </p>
              </div>
              <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                {item?.icon}
              </div>
            </div>
          );
        })}
      </section>
      <section className="flex flex-col @lg:flex-row gap-3 w-full @lg:w-auto">
        <div className="flex-1 @lg:w-80 flex items-center pl-2 rounded-lg overflow-hidden outline-0 ring ring-gray-200 focus-within:ring-1 focus-within:ring-[#135BEC] shadow-sm bg-white">
          <span className="text-[#617789]">
            <Search className="size-5" />
          </span>
          <input
            type="text"
            placeholder="Search by student name, email, or ID"
            className="flex-1 px-2 py-3 text-sm placeholder:text-[#617789] outline-0 focus:ring-0 text-[#111518]"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm shadow-sm">
          <Filter className="size-5" />
          <span>Filter & Sort</span>
          <DownArrow className="size-5" />
        </button>
      </section>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {enrollment_data?.map((item) => {
          return (
            <div
              key={item?.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col p-5 gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Image
                    src={item?.avatar}
                    width={100}
                    height={100}
                    alt="avatar"
                    className="size-12 rounded-full bg-slate-200 overflow-hidden"
                  />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{item?.name}</p>
                    <p className="text-xs text-slate-500">{item?.email}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: #{item?.userId}
                    </p>
                  </div>
                </div>
                {item?.isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-700 border border-slate-100">
                    Inactive
                  </span>
                )}
              </div>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-slate-500">Enrollment</span>
                  {enrollment_badge[item?.isEnrolled]}
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-slate-500">Activity</span>
                  {item?.isEnrolled === "ENROLLED" && (
                    <span className="text-slate-700 font-medium text-xs">
                      Enrolled on {item?.activityOn}
                    </span>
                  )}
                  {item?.isEnrolled === "PENDING" && (
                    <span className="text-slate-700 font-medium text-xs">
                      Invited on {item?.activityOn}
                    </span>
                  )}
                  {item?.isEnrolled === "NOT_ENROLLED" && (
                    <span className="text-slate-700 font-medium text-xs">
                      Account created on {item?.activityOn}
                    </span>
                  )}
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-slate-500">Course</span>
                  <span className="text-slate-700 font-bold">
                    {item?.courses} Courses
                  </span>
                </div>
              </div>
              <button className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition-colors">
                Manage Enrollment
              </button>
            </div>
          );
        })}
      </section>
      <footer className="flex items-center justify-between mt-auto px-2">
        <span className="text-sm text-[#617789]">
          Showing <span className="font-medium text-[#111318]">1-3</span> of{" "}
          <span className="font-medium text-[#111318]">12</span> students
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-[#111318] disabled:text-[#617789] bg-white border border-[#dbe1e6] rounded-lg hover:bg-[#f0f2f4] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#111318] bg-white border border-[#dbe1e6] rounded-lg hover:bg-[#f0f2f4] disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </footer>
    </main>
  );
}
