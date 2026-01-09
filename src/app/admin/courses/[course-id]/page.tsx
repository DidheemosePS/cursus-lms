import Link from "next/link";
import Save from "@/assets/icons/save.svg";
import File from "@/assets/icons/file.svg";
import Arrow from "@/assets/icons/down-arrow.svg";
import Module from "@/assets/icons/module.svg";
import Delete from "@/assets/icons/delete.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Plus from "@/assets/icons/plus.svg";
import Eye from "@/assets/icons/eye.svg";
import Group from "@/assets/icons/group.svg";
import Search from "@/assets/icons/search.svg";
import Close from "@/assets/icons/close.svg";
import Image from "next/image";

export default function Page() {
  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
        <Link href="/admin/courses">Courses</Link>
        <Arrow className="size-4 -rotate-90" />
        <span className="font-semibold text-gray-900">
          Introduction to Computer Science
        </span>
      </nav>
      {/* Page Header */}
      <header className="mb-8 flex flex-col @lg:flex-row @lg:items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Course Details
          </p>
          <p className="mt-1 text-sm text-[#616f89]">
            Manage course structure, content, and instructors.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 h-10 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex items-center gap-2 px-6 h-10 rounded-lg bg-[#135BEC] text-white font-bold text-sm shadow-sm hover:bg-[#135BEC]/90 transition-colors">
            <Save className="size-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </header>
      <section className="flex flex-col @4xl:flex-row items-start gap-8">
        <div className="w-full space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="text-[#135BEC] bg-[#135BEC]/10 p-2 rounded-lg">
                <File className="size-5" />
              </div>
              <p className="text-xl font-bold">Course Information</p>
            </div>
            <form className="space-y-6">
              <label className="block text-sm font-semibold text-gray-700">
                Cover Image
              </label>
              <div className="group w-full h-48 flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <File className="size-9 text-gray-400 group-hover:text-[#135BEC] transition-colors mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Course Name
                </label>
                <input
                  className="w-full h-11 p-3 rounded-lg outline-0 ring ring-gray-200 focus:ring-[#135BEC] bg-white text-sm"
                  defaultValue="Introduction to Computer Science"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Course Code
                </label>
                <input
                  className="w-full h-11 p-3 rounded-lg outline-0 ring ring-gray-200 focus:ring-[#135BEC] bg-white text-sm"
                  defaultValue="CS-101"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full min-h-30 p-3 rounded-lg outline-0 ring ring-gray-200 focus:ring-[#135BEC] bg-white text-sm resize-y"
                  defaultValue="This introductory course covers the fundamental concepts of computer science, including algorithms, data structures, and basic programming principles. Perfect for beginners starting their tech journey."
                />
              </div>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between  mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="text-[#135BEC] bg-[#135BEC]/10 p-2 rounded-lg">
                  <Module className="size-5" />
                </div>
                <p className="text-xl font-bold">Modules</p>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                3 Modules
              </span>
            </div>
            <form className="space-y-4">
              <div className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#135BEC]/30 transition-all hover:shadow-sm cursor-move">
                <Module className="size-5 rotate-90 text-gray-300" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Module 1
                      </span>
                      <input
                        className="w-full font-bold text-lg bg-transparent border-none p-0 focus:ring-0 text-gray-900"
                        type="text"
                        defaultValue="Introduction to Algorithms"
                      />
                      <input
                        className="w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0"
                        type="text"
                        defaultValue="Understanding complexity and basic sorting."
                      />
                    </div>
                    <button className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                      <Delete className="size-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar className="size-4.5 text-[#135BEC]" />
                      <span className="text font-semibold uppercase text-gray-400">
                        Start:
                      </span>
                      <input
                        className="bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-700"
                        type="date"
                        defaultValue="2025-10-01"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar className="size-4.5 text-orange-500" />
                      <span className="text font-semibold uppercase text-gray-400">
                        Due:
                      </span>
                      <input
                        className="bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-700"
                        type="date"
                        defaultValue="2026-01-30"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#135BEC]/30 transition-all hover:shadow-sm cursor-move">
                <Module className="size-5 rotate-90 text-gray-300" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Module 2
                      </span>
                      <input
                        className="w-full font-bold text-lg bg-transparent border-none p-0 focus:ring-0 text-gray-900"
                        type="text"
                        defaultValue="Data Structures Fundamentals"
                      />
                      <input
                        className="w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0"
                        type="text"
                        defaultValue="Arrays, Linked Lists, and stacks."
                      />
                    </div>
                    <button className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                      <Delete className="size-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar className="size-4.5 text-[#135BEC]" />
                      <span className="text font-semibold uppercase text-gray-400">
                        Start:
                      </span>
                      <input
                        className="bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-700"
                        type="date"
                        defaultValue="2025-11-01"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar className="size-4.5 text-orange-500" />
                      <span className="text font-semibold uppercase text-gray-400">
                        Due:
                      </span>
                      <input
                        className="bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-700"
                        type="date"
                        defaultValue="2026-02-15"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-bold hover:border-[#135BEC] hover:text-[#135BEC] hover:bg-[#135BEC]/5 transition-all">
                <div className="p-0.5 border rounded-full">
                  <Plus className="size-5" />
                </div>
                <span>Add New Module</span>
              </button>
            </form>
          </div>
        </div>
        <aside className="w-full @lg:w-136 space-y-8">
          <div className="rounded-lg shadow-sm p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#135BEC] bg-[#135BEC]/10 p-2 rounded-lg">
                <Eye className="size-5" />
              </span>
              <p className="text-lg font-bold">Visibility</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">
                  Active Status
                </span>
                <span className="text-xs text-gray-500">
                  Course is visible to students
                </span>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  defaultChecked
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-[#135BEC] transition-all duration-200"
                  id="toggle"
                  name="toggle"
                  type="checkbox"
                />
                <label
                  className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200"
                  htmlFor="toggle"
                ></label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 bg-green-100 text-green-700 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1">
                <span className="size-2 bg-green-500 rounded-full"></span>
                <span>Published</span>
              </div>
              <div className="flex-1 bg-gray-100 text-gray-500 text-xs font-bold py-2 px-3 rounded-lg text-center">
                Last updated 2h ago
              </div>
            </div>
          </div>
          <div className="rounded-lg shadow-sm p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#135BEC] bg-[#135BEC]/10 p-2 rounded-lg">
                <Group className="size-5" />
              </span>
              <p className="text-lg font-bold">Instructors</p>
            </div>
            <div className="space-y-4">
              <div className="h-8 flex items-center pl-2 rounded-lg overflow-hidden outline-0 ring ring-gray-200 focus-within:ring-1 focus-within:ring-[#135BEC]">
                <span className="text-[#617789]">
                  <Search className="size-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search to add instructor..."
                  className="w-full h-full px-2 text-sm placeholder:text-[#617789] outline-0 focus:ring-0 text-[#111518]"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Assigned (2)
                </p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://avatar.iran.liara.run/public/62"
                      width={100}
                      height={100}
                      alt="avatar"
                      className="size-8 rounded-full bg-white"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        Dr. Jane Doe
                      </p>
                      <p className="text-xs text-gray-500">Lead Instructor</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                    <Close className="size-4.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://avatar.iran.liara.run/public/29"
                      width={100}
                      height={100}
                      alt="avatar"
                      className="size-8 rounded-full bg-white"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        Prof. Alan Smith
                      </p>
                      <p className="text-xs text-gray-500">Assistant</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                    <Close className="size-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
