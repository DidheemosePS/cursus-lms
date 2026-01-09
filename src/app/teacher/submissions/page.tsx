import Submissions from "../components/submissions";
import { submission_data } from "../page";
import DownArrow from "@/assets/icons/down-arrow.svg";
import History from "@/assets/icons/history.svg";
import School from "@/assets/icons/school.svg";
import Sort from "@/assets/icons/sort.svg";

export default function Page() {
  return (
    <main className="@container min-h-[calc(100dvh-4rem)] flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      <header className="pt-2">
        <p className="text-2xl font-black text-[#111318]">Submissions</p>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all student submissions assigned to you.
        </p>
      </header>
      <section className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="flex h-9 items-center justify-center px-4 rounded-full bg-[#111518] text-white text-sm font-medium transition-transform active:scale-95 shadow-sm">
            All
          </button>
          <button className="flex h-9 items-center justify-center px-4 rounded-full bg-[#f0f2f4] hover:bg-[#e0e2e4] text-[#111518] text-sm font-medium transition-colors">
            Pending
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#135BEC]/10 text-[#135BEC] text-xs font-semibold">
              8
            </span>
          </button>
          <button className="flex h-9 items-center justify-center px-4 rounded-full bg-[#f0f2f4] hover:bg-[#e0e2e4] text-[#111518] text-sm font-medium transition-colors">
            Late
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-semibold">
              3
            </span>
          </button>
          <button className="flex h-9 items-center justify-center px-4 rounded-full bg-[#f0f2f4] hover:bg-[#e0e2e4] text-[#111518] text-sm font-medium transition-colors">
            Reviewed
          </button>
        </div>
        <hr className="border-[#f0f2f4] w-full" />
        {/* Filter */}
        <div className="flex flex-col @2xl:flex-row gap-4">
          {/* All Courses */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <School className="size-5 text-gray-400" />
            </div>
            <select className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
              <option>All Courses</option>
              <option>Intro to UX Design (UX101)</option>
              <option>Advanced CSS Layouts (FE201)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <DownArrow className="size-5 text-gray-400" />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <History className="size-5 text-gray-400" />
            </div>
            <select className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
              <option>All Attempts</option>
              <option>First Attempt</option>
              <option>Resubmissions</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <DownArrow className="size-5 text-gray-400" />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Sort className="size-5 text-gray-400" />
            </div>
            <select className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
              <option>Submission Date</option>
              <option>Due Date</option>
              <option>Late First</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <DownArrow className="size-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>
      <Submissions submission_data={submission_data} />
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
