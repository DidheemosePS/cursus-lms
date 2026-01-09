import Search from "@/assets/icons/search.svg";
import Plus from "@/assets/icons/plus.svg";
import Course from "@/assets/icons/books.svg";
import Block from "@/assets/icons/block.svg";
import Image from "next/image";

export default function Page() {
  const teachers = [
    {
      id: 1,
      avatar: "https://avatar.iran.liara.run/public/62",
      name: "Sarah Jenkins",
      email: "sarah.j@school.edu",
      assigned: 4,
      isActive: true,
    },
    {
      id: 2,
      avatar: "https://avatar.iran.liara.run/public/29",
      name: "Michael Ross",
      email: "michael.r@school.edu",
      assigned: 0,
      isActive: false,
    },
    {
      id: 3,
      avatar: "https://avatar.iran.liara.run/public/4",
      name: "Emily Chen",
      email: "emily.chen@school.edu",
      assigned: 2,
      isActive: true,
    },
    {
      id: 4,
      avatar: "https://avatar.iran.liara.run/public/65",
      name: "David Kim",
      email: "david.k@school.edu",
      assigned: 5,
      isActive: true,
    },
    {
      id: 5,
      avatar: "https://avatar.iran.liara.run/public/87",
      name: "Robert Fox",
      email: "robert.fox@school.edu",
      assigned: 1,
      isActive: false,
    },
  ];

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <header className="flex flex-col @3xl:flex-row @3xl:items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Course Details
          </p>
          <p className="mt-1 text-sm text-[#616f89]">
            Manage course structure, content, and instructors.
          </p>
        </div>
        <div className="flex flex-col @3xl:flex-row gap-3 w-full @lg:w-auto">
          <div className="flex-1 @3xl:w-80 flex items-center pl-2 rounded-lg overflow-hidden outline-0 ring ring-gray-200 focus-within:ring-1 focus-within:ring-[#135BEC]">
            <span className="text-[#617789]">
              <Search className="size-5" />
            </span>
            <input
              type="text"
              placeholder="Search to add instructor..."
              className="flex-1 px-2 py-2.5 text-sm placeholder:text-[#617789] outline-0 focus:ring-0 text-[#111518]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 h-10 rounded-lg bg-[#135BEC] text-white font-bold text-sm shadow-sm hover:bg-[#135BEC]/90 transition-colors">
            <Plus className="size-5" />
            <span>Add Teacher</span>
          </button>
        </div>
      </header>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {teachers?.map((teacher) => {
          return (
            <div
              key={teacher?.id}
              className="group flex flex-col items-start gap-4 p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-[#135BEC]/30 transition-all cursor-pointer overflow-hidden"
            >
              <Image
                src={teacher?.avatar}
                width={100}
                height={100}
                alt="avatar"
                className="size-16 bg-gray-100 rounded-full"
              />
              <div>
                <p className="text-lg font-bold text-[#111318] leading-tight group-hover:text-[#135BEC] transition-colors">
                  {teacher?.name}
                </p>
                <p className="text-sm text-[#8B969E] font-medium mt-1">
                  {teacher?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {teacher?.assigned ? (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-xs font-semibold ${
                      teacher?.isActive ? "text-[#111318]" : "text-[#8B969E]"
                    } border border-gray-100`}
                  >
                    <Course
                      className={`size-3.5 ${
                        teacher?.isActive ? "text-[#135BEC]" : "text-[#8B969E]"
                      }`}
                    />
                    <span>{teacher?.assigned} Courses</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center text-[#8B969E] gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-xs font-semibold border border-gray-100">
                    <Block className="size-3.5" />
                    <span>No courses</span>
                  </div>
                )}
                {teacher?.isActive ? (
                  <div className="inline-flex px-2.5 py-1 rounded-md bg-green-50 text-xs font-bold text-green-600 border border-green-100">
                    Active
                  </div>
                ) : (
                  <div className="inline-flex px-2.5 py-1 rounded-md bg-red-50 text-xs font-bold text-red-600 border border-red-100">
                    Inactive
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
