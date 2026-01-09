import Link from "next/link";
import LeftArrow from "@/assets/icons/left-arrow.svg";
import CircleTick from "@/assets/icons/circle-tick.svg";
import CalendarCheck from "@/assets/icons/calendar-check.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Play from "@/assets/icons/play.svg";
import Notice from "@/assets/icons/notice.svg";
import History from "@/assets/icons/history.svg";
import File from "@/assets/icons/file.svg";
import Lock from "@/assets/icons/lock.svg";

export default function Page() {
  return (
    <div className="px-4 py-8 md:px-12">
      <Link
        href="/student/my-courses"
        className="flex items-center gap-2 mb-6 text-sm text-[#616f89]"
      >
        <LeftArrow className="size-5" />
        <span>Back to All Courses</span>
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <p className="text-2xl font-bold text-[#111318] mb-2">
            Introduction to UX Design - Course Content
          </p>
          <p className="text-[#616f89] max-w-2xl">
            Master the fundamentals of User Experience Design through hands-on
            projects and theoretical knowledge. Complete modules in order to
            unlock the next steps.
          </p>
        </div>
        <div className="bg-[#135BEC]/10 px-4 py-2 rounded-lg">
          <span className="text-[#135BEC] font-bold text-sm">
            Overall Progress: 45%
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-green-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="size-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <CircleTick className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Module 1 • Completed
              </p>
            </div>
            <p className="text-lg font-bold text-[#111318] mb-1">
              User Research Fundamentals
            </p>
            <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
              Understanding your users through qualitative and quantitative
              research methods.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="size-3.5 stroke-[1.5]" />
                Started: Sep 01
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <CalendarCheck className="size-3.5 stroke-[1.5]" />
                Submitted: Sep 10
              </span>
            </div>
          </div>
          <button className="w-full md:w-auto ml-auto px-5 py-2.5 bg-white border border-[#e5e7eb] transition-colors hover:bg-gray-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2">
            <History className="size-4" />
            View Submission History
          </button>
        </div>
        {/* card 2 */}
        <div className="bg-white rounded-lg border border-blue-200 border-l-4 border-l-blue-600 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center transform scale-[1.01]">
          <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Play className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Module 2 • Current
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                Due Soon
              </span>
            </div>
            <p className="text-lg font-bold text-[#111318] mb-1">
              Information Architecture & Wireframing
            </p>
            <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
              Creating blueprints for your design and structuring content
              effectively.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="size-3.5 stroke-[1.5]" />
                Started: Sep 15
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <CalendarCheck className="size-3.5 stroke-[1.5]" />
                Due: Oct 15
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-[#616f89]">
              <Notice className="size-3" />
              Late submissions allowed. Teacher will see timestamp.
            </div>
          </div>
          <div className="shrink-0 w-full ml-auto md:w-auto flex flex-col items-center md:items-end gap-2">
            <button className="w-full md:w-auto px-5 py-2.5 bg-blue-600 transition-colors hover:bg-blue-800 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
              <File className="size-4" />
              Submit File
            </button>
            <span className="text-[10px] text-[#616f89] text-center md:text-right">
              PDF, DOC, DOCX allowed. Max size 5 MB.
            </span>
          </div>
        </div>
        {/* card 3 */}
        <div className="bg-white rounded-lg border border-green-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center opacity-75">
          <div className="size-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
            <Lock className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Module 3 • Locked
              </p>
            </div>
            <p className="text-lg font-bold text-[#111318] mb-1">
              Prototyping & Interaction Design
            </p>
            <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
              Building interactive prototypes to simulate the final product
              experience.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="size-3.5 stroke-[1.5]" />
                Starts: Oct 16
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <CalendarCheck className="size-3.5 stroke-[1.5]" />
                Due: Oct 30
              </span>
            </div>
          </div>
          <button
            disabled
            className="w-full ml-auto md:w-auto px-5 py-2.5 bg-gray-100 text-gray-400 border border-transparent text-sm font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="size-3" />
            Locked until previous module is completed
          </button>
        </div>
        {/* card 4 */}
        <div className="bg-white rounded-lg border border-green-200 p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center opacity-50 grayscale">
          <div className="size-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
            <Lock className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Module 4 • Upcoming
              </p>
            </div>
            <p className="text-lg font-bold text-[#111318] mb-1">
              Final Capstone Project
            </p>
            <p className="text-sm text-[#616f89] mb-3 line-clamp-2">
              Apply everything you&apos;ve learned in a comprehensive final
              project.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#616f89]">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="size-3.5 stroke-[1.5]" />
                Starts: Nov 01
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <CalendarCheck className="size-3.5 stroke-[1.5]" />
                Due: Nov 20
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
