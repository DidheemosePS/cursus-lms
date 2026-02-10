import Notice from "@/assets/icons/notice.svg";
import Search from "@/assets/icons/search.svg";
import DownArrow from "@/assets/icons/down-arrow.svg";
import Image from "next/image";
import Edit from "@/assets/icons/edit.svg";
import Badges from "./badges";

export default function Page() {
  const learners = [
    {
      id: 1,
      userId: 482012,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=6",
      name: "Sarah Connor",
      course: "Intro to Web Design",
      completedModules: 7,
      totalModules: 10,
      late: 2,
      pending: 1,
    },
    {
      id: 2,
      userId: 882103,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=4",
      name: "Michael Chen",
      course: "Advanced Physics",
      completedModules: 3,
      totalModules: 12,
      pending: 0,
      late: 0,
    },
    {
      id: 3,
      userId: 559201,
      avatar:
        "https://testingbot.com/free-online-tools/random-avatar/100?img=20",
      name: "Emma Watson",
      course: "History 101",
      completedModules: 9,
      totalModules: 10,
      pending: 4,
      late: 0,
    },
  ];

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <header className="pt-2">
        <p className="text-2xl font-black text-[#111318]">My Learners</p>
        <p className="text-sm text-gray-500 mt-1">
          View learners assigned to your courses.
        </p>
        <div className="flex items-center gap-2 mt-2 text-sm text-[#617789] bg-white w-fit px-3 py-1.5 rounded-full">
          <Notice className="size-4" />
          <span>Learners are grouped by assigned courses.</span>
        </div>
      </header>

      <section className="flex flex-col @2xl:flex-row gap-4 bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-sm font-medium text-[#111518]">Search</label>
          <div className="flex items-center rounded-lg h-10 bg-[#f0f2f4] overflow-hidden focus-within:ring-2 focus-within:ring-[#135BEC]/50 transition-shadow">
            <div className="pl-4 pr-2 text-[#617789]">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              placeholder="Search by learner name or ID"
              className="px-2 placeholder:text-[#617789] placeholder:text-sm  outline-0 focus:ring-0 text-[#111518] w-full h-full text-base"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-sm font-medium text-[#111318]">
            Filter by Course
          </label>
          <div className="relative group h-10">
            <select className="w-full px-4 pr-10 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
              <option>All Courses</option>
              <option>Intro to UX Design (UX101)</option>
              <option>Advanced CSS Layouts (FE201)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <DownArrow className="size-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-sm font-medium text-[#111318]">
            Filter by Status
          </label>
          <div className="relative group h-10">
            <select className="w-full px-4 pr-10 py-2.5 bg-white rounded-lg text-sm text-[#111518] outline-0 ring ring-[#dbe1e6] focus:ring-2 focus:ring-[#135BEC]/50 appearance-none cursor-pointer">
              <option>All Learners</option>
              <option>Late submission</option>
              <option>Pending submission</option>
              <option>All caught up</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <DownArrow className="size-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-max ml-auto flex items-center gap-2 bg-white mb-4 justify-self-end px-3 py-1 rounded-full shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
        <span className="text-xs font-medium text-[#617789]">
          Highlighted learners have late submissions
        </span>
      </section>

      <section className="w-full flex flex-col rounded-lg divide-y divide-[#f0f2f4] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="hidden @5xl:grid @5xl:grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase text-gray-500 tracking-wider bg-gray-200/50">
          <span>Learner</span>
          <span>Course</span>
          <span>Progress</span>
          <span>Submissions</span>
          <span>Action</span>
        </div>
        {/* All Learner */}
        {learners?.map((learner) => {
          // For safety if completeModules > totalModules the layout breaks.
          const progress =
            (learner?.completedModules / learner?.totalModules) * 100;
          const workProgress = Math.min(100, Math.max(0, progress));
          return (
            <div
              key={learner?.id}
              className={`group flex flex-col @5xl:grid @5xl:grid-cols-5 gap-4 p-4 md:px-6 md:py-5 items-center transition-colors ${
                learner?.late ? "bg-red-50/30" : "bg-white"
              } hover:bg-gray-50`}
            >
              {/* Learner Details */}
              <div className="flex items-center gap-3 w-full cursor-pointer hover:opacity-80">
                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 overflow-hidden">
                  <Image
                    src={learner?.avatar}
                    width={100}
                    height={100}
                    alt={`${learner?.name} avatar`}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[#111518] text-sm font-bold truncate hover:text-primary transition-colors">
                    {learner?.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    ID: {learner?.userId}
                  </p>
                </div>
              </div>
              {/* Course Details */}
              <div className="w-full flex justify-between border-b border-gray-200 @5xl:border-0 pb-2">
                <span className="@5xl:hidden text-xs font-medium text-gray-500 mb-1">
                  Course
                </span>
                <a
                  className="text-[#111518] text-sm font-medium truncate hover:text-primary transition-colors cursor-pointer"
                  href="#"
                  title="View Course Overview"
                >
                  {learner?.course}
                </a>
              </div>
              {/* Progress */}
              <div className="w-full flex flex-col justify-center gap-1.5">
                <span className="text-[10px] font-bold text-[#617789] tracking-wider uppercase">
                  Module Completed
                </span>
                <div className="flex justify-between text-xs font-medium text-[#111318]">
                  <span>
                    {learner?.completedModules} of {learner?.totalModules}{" "}
                    modules
                  </span>
                  <span>{workProgress}%</span>
                </div>
                <div className="h-2 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#135BEC] rounded-full"
                    style={{ width: `${workProgress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-2"></div>
              </div>
              {/* Submissions */}
              <div className="w-full flex flex-col justify-center gap-1">
                <span className="@5xl:hidden text-[10px] font-bold text-[#617789] tracking-wider uppercase">
                  Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {/* Late Submission */}
                  {learner?.late > 0 && (
                    <Badges
                      badgesProps={{
                        badge_variant: "LATE",
                        late: learner?.late,
                      }}
                    />
                  )}
                  {/* Pending Submission */}
                  {learner?.pending > 0 && (
                    <Badges
                      badgesProps={{
                        badge_variant: "PENDING",
                        pending: learner?.pending,
                      }}
                    />
                  )}
                  {/* All Caught Up  */}
                  {!(learner?.late > 0) && !(learner?.pending > 0) && (
                    <Badges
                      badgesProps={{
                        badge_variant: "ALL_CAUGHT_UP",
                      }}
                    />
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="w-full flex flex-col @[735px]:flex-row @5xl:flex-col gap-3">
                <button className="w-full flex items-center justify-center h-11 rounded-lg bg-[#135BEC] hover:bg-[#135BEC]/90 text-white font-bold text-sm shadow-sm transition-colors">
                  View Profile
                </button>
                <button className="w-full flex items-center justify-center gap-2 h-11 rounded-lg border border-[#dbe1e6] bg-white text-[#111318] font-medium text-sm hover:bg-gray-50 transition-colors">
                  <Edit className="size-4.5" />
                  Review Submission
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <footer className="flex items-center justify-between mt-auto px-2">
        <span className="text-sm text-[#617789]">
          Showing <span className="font-medium text-[#111318]">1-3</span> of{" "}
          <span className="font-medium text-[#111318]">12</span> learners
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
