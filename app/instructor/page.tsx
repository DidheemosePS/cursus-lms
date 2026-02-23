import Inbox from "@/assets/icons/inbox.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import Group from "@/assets/icons/group.svg";
import Warning from "@/assets/icons/warning.svg";
import DownArrow from "@/assets/icons/down-arrow.svg";
import Notice from "@/assets/icons/notice.svg";
import Submissions from "./components/submissions";
import Link from "next/link";

export interface SubmissionData {
  id: number;
  userId: number;
  avatar: string;
  name: string;
  course: string;
  module: string;
  status: "PENDING" | "LATE" | "REVIEWED";
  attempt: number;
  isResubmission: boolean;
  submitted: string;
  due: string;
  late?: string;
}

export const submission_data: SubmissionData[] = [
  {
    id: 1,
    userId: 482012,
    avatar: "https://testingbot.com/free-online-tools/random-avatar/100?img=6",
    name: "Sarah Connor",
    course: "Intro to Web Design",
    module: "CSS Grid",
    status: "PENDING",
    attempt: 1,
    isResubmission: false,
    submitted: "Oct 24, 10:30 AM",
    due: "Oct 25, 11:59 PM",
  },
  {
    id: 2,
    userId: 882103,
    avatar: "https://testingbot.com/free-online-tools/random-avatar/100?img=4",
    name: "Michael Chen",
    course: "Advanced Physics",
    module: "Kinetics",
    status: "LATE",
    attempt: 1,
    isResubmission: false,
    submitted: "Oct 26, 09:15 AM",
    due: "Oct 25, 11:59 PM",
    late: "1 day late",
  },
  {
    id: 3,
    userId: 559201,
    avatar: "https://testingbot.com/free-online-tools/random-avatar/100?img=8",
    name: "Emma Watson",
    course: "History 101",
    module: "Final Essay",
    status: "PENDING",
    attempt: 2,
    isResubmission: true,
    submitted: "Oct 24, 02:45 AM",
    due: "Oct 26, 11:59 PM",
  },
  {
    id: 4,
    userId: 221004,
    avatar: "https://testingbot.com/free-online-tools/random-avatar/100?img=2",
    name: "James Rodriguez",
    course: "Calculus II",
    module: "Homework 5",
    status: "REVIEWED",
    attempt: 1,
    isResubmission: false,
    submitted: "Oct 20, 11:15 AM",
    due: "Oct 22, 11:59 PM",
  },
];

export default function Page() {
  const dashboard_data = [
    {
      id: 1,
      title: "Pending Submissions",
      submissions: 12,
      icon: Inbox,
      theme: "text-[#135BEC]",
    },
    {
      id: 2,
      title: "Late Submissions",
      submissions: 3,
      icon: Warning,
      theme: "text-red-500",
    },
    {
      id: 3,
      title: "Reviewed Submissions",
      submissions: 45,
      icon: CircleTick,
      theme: "text-green-500",
    },
    {
      id: 4,
      title: "Pending Submissions",
      submissions: 120,
      icon: Group,
      theme: "text-gray-500",
    },
  ];

  return (
    <main className="@container p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <header className="pt-2">
        <p className="text-2xl font-black text-[#111318]">Dashboard</p>
        <p className="text-sm text-gray-500 mt-1">
          Overview of you pending tasks
        </p>
      </header>

      <section className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboard_data?.map((item) => {
          const Icon = item?.icon;
          return (
            <div
              key={item?.id}
              className="relative flex flex-col justify-between h-32 rounded-xl p-5 bg-white shadow-sm cursor-pointer text-left overflow-hidden"
            >
              <div className="absolute right-0 top-0 opacity-10 p-5">
                <Icon className={`size-15 ${item?.theme}`} />
              </div>
              <p className="text-[#617789] text-sm font-medium">
                {item?.title}
              </p>
              <div className="flex items-end justify-between">
                <p className="text-[#111318] text-4xl font-bold">
                  {item?.submissions}
                </p>
                <span className={`text-xs font-semibold ${item?.theme}`}>
                  Filter List
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Filter by Status & Course
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="relative group">
              <select className="w-full pl-3 pr-8 py-2 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
                <option>Status: All</option>
                <option>Status: Pending</option>
                <option>Status: Late</option>
                <option>Status: Reviewed</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[20px]">
                <DownArrow className="size-5" />
              </span>
            </div>
            <div className="relative group">
              <select className="w-full pl-3 pr-8 py-2 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
                <option>Courses: All Courses</option>
                <option>Intro to Web Design</option>
                <option>Advanced Physics</option>
                <option>History 101</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[20px]">
                <DownArrow className="size-5" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Sort List
          </p>
          <div className="relative group w-full md:w-auto">
            <select className="w-full pl-3 pr-8 py-2 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
              <option>Sort by: Submission Date</option>
              <option>Sort by: Due Date</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[20px]">
              <DownArrow className="size-5" />
            </span>
          </div>
        </div>
      </section>

      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Notice className="size-3" />
          <p className="text-[#617789] text-sm font-normal">
            You will receive notifications when new submissions arrive.
          </p>
        </div>
        <Link
          href="/instructor/submissions"
          className="text-[#135BEC] underline text-xs font-bold"
        >
          View All
        </Link>
      </div>

      {/* Submission Components */}
      <Submissions submission_data={submission_data} />
    </main>
  );
}
