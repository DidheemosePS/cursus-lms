import Link from "next/link";
import Plus from "@/assets/icons/plus.svg";
import Search from "@/assets/icons/search.svg";
import Image from "next/image";
import Group from "@/assets/icons/group.svg";
import Module from "@/assets/icons/module.svg";
import Arrow from "@/assets/icons/left-arrow.svg";

export default function Page() {
  const featured_courses_data = [
    {
      id: 1,
      course_code: "FE101",
      status: "Active",
      title: "Web Development",
      description:
        "Learn the basics of HTML, CSS, and JavaScript to build your first responsive website.",
      no_of_modules: 18,
      no_of_teachers: 2,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAN8NVMBdLUCDOL-663ZGg8PCvEWeWjYgKTm4XOSWqtE9obNGX0DlxdCdi8un3TRgotmExE_LmXAN1o86uakuBzYxXwK_bqSZf7nVXgTZnSk_zXcgqz5WLmWw1BRoJHUFJOOZz0yjI6oeEFVoMflK5RE10qi0srhQ-PfwNSm5G0Hv-7qxrfi-tTqKqH0uBmTWMTFycatxVZJ6bF0efi-eCCNZkBs9VWcWBaOlXz3M7uzUD6Dnz4vgzGhfocU1_OBhpx7osCg5KMyM4",
    },
    {
      id: 2,
      course_code: "BE202",
      status: "Active",
      title: "UI/UX Design Principles",
      description:
        "Master the art of user interface and experience design with real-world projects.",
      no_of_modules: 12,
      no_of_students: 1,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUNDixuVYP7xdqsseSGVdSEuiCDNQ1NNQ3YXir5VNEJRq-vuzSwXgdSvNB7qtU4yv6yi0W7sXHOVqVPg01d7VEzCNcE28hmbbjNdqVBFBWmKzoTV_IeBVq_RneItpmM6ts5wE8jbdOcTr_KbuL5JhHpr9Ykmuf66mfs1pDOeeK72b4SwWsXMDeSRsuyuL3lI7uxOvWcuQUYvUXagkTQfoq8Rq0oZvdH5b4ToogWcLglFUaqQGxW_8ZHvPQeCJ0f0Y1JxdfRdMRQiw",
    },
    {
      id: 3,
      course_code: "DS303",
      status: "Draft",
      title: "Data Science for Beginners",
      description:
        "An introduction to data analysis, visualization, and machine learning using Python.",
      no_of_modules: 10,
      no_of_students: 0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgC8aDCRzeEPd7txnwqnwGU8xLdvBA7Sooxy5PKegrDOj_GY09Osk3FeNcTumHOTc6batcN11dF7MXrpcNLklu0--hqMBpiX6rql8tinz8wgB9ph-vn2NRZ8EJHcGPKIhzzx5q1cQDYQikNKRi3m6crtso7bnA_PwPq7ZmBKnyodCYTBjCGGuvRaIOFpWV7ErMe0ejnN80sMSInE-DlmWNXXwjPt1NQoGY9u4ILxyk3nO1cd3iln5X3Ij74uidYAzRkJvKhUSBFc8",
    },
  ];

  return (
    <main className="@container min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <header className="mb-8 flex flex-col @lg:flex-row @lg:items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            Admin Courses
          </p>
          <p className="mt-1 text-sm text-[#616f89]">
            Manage course content, structure, and teacher assignments.
          </p>
        </div>
        <Link
          href="#"
          className="flex items-center justify-center gap-2 bg-[#135BEC] hover:bg-[#135BEC]/80 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus className="size-5" />
          <span className="font-bold tracking-wide">Create</span>
        </Link>
      </header>
      {/* Search bar */}
      <div className="max-w-2xl flex items-center rounded-lg h-10 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#135BEC]/50 transition-shadow shadow-sm">
        <span className="pl-4 pr-2 text-[#617789]">
          <Search className="size-5" />
        </span>
        <input
          type="text"
          placeholder="Search courses by name or code..."
          className="w-full h-full rounded-lg px-2 text-sm placeholder:text-[#617789] outline-0 focus:ring-0 text-[#111518]"
        />
      </div>
      {/* All Courses */}
      <section className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-wider text-[#617789]">
          All Courses
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
          {featured_courses_data?.map((item) => {
            return (
              <div
                key={item?.id}
                className="relative group grid place-items-end rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <Image
                  src={item?.image_url}
                  width={100}
                  height={100}
                  alt="logo"
                  className="w-full rounded-lg shadow-2xl bg-gray-200 col-[1/2] row-[1/2] filter-[brightness(.6)] object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 max-w-max px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  {item?.status}
                </span>
                <div className="col-[1/2] row-[1/2] z-10 p-5 flex flex-col text-white backdrop-blur-[2px] rounded-b-lg">
                  <span className="max-w-max px-2 py-0.5 rounded text-xs font-bold bg-white text-[#135BEC]">
                    {item?.course_code}
                  </span>
                  <p className="text-lg font-bold leading-snug mb-1 mt-2">
                    {item?.title}
                  </p>
                  <p className="text-sm line-clamp-2">{item?.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Module className="size-4" />
                      <span className="text-xs text-[#ffffff]">
                        {item?.no_of_modules}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Group className="size-4" />
                      <span className="text-xs text-[#ffffff]">
                        {item?.no_of_teachers}
                      </span>
                    </div>
                    <Link
                      href={`/admin/courses/${item?.id}`}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ml-auto"
                    >
                      <span>Edit Course</span>
                      <Arrow className="size-5 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
