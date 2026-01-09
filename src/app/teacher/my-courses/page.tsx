import Image from "next/image";
import Link from "next/link";
import Group from "@/assets/icons/group.svg";
import Module from "@/assets/icons/module.svg";

export default function Page() {
  const filter_buttons = [
    {
      id: 1,
      label: "All",
      isactive: true,
    },
    {
      id: 2,
      label: "Active",
      isactive: false,
    },
    {
      id: 3,
      label: "Archived",
      isactive: false,
    },
  ];

  const featured_courses_data = [
    {
      id: 1,
      status: "Active",
      title: "Web Development",
      description:
        "Learn the basics of HTML, CSS, and JavaScript to build your first responsive website.",
      no_of_modules: 18,
      no_of_students: 66,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAN8NVMBdLUCDOL-663ZGg8PCvEWeWjYgKTm4XOSWqtE9obNGX0DlxdCdi8un3TRgotmExE_LmXAN1o86uakuBzYxXwK_bqSZf7nVXgTZnSk_zXcgqz5WLmWw1BRoJHUFJOOZz0yjI6oeEFVoMflK5RE10qi0srhQ-PfwNSm5G0Hv-7qxrfi-tTqKqH0uBmTWMTFycatxVZJ6bF0efi-eCCNZkBs9VWcWBaOlXz3M7uzUD6Dnz4vgzGhfocU1_OBhpx7osCg5KMyM4",
    },
    {
      id: 2,
      status: "Archived",
      title: "UI/UX Design Principles",
      description:
        "Master the art of user interface and experience design with real-world projects.",
      no_of_modules: 12,
      no_of_students: 36,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUNDixuVYP7xdqsseSGVdSEuiCDNQ1NNQ3YXir5VNEJRq-vuzSwXgdSvNB7qtU4yv6yi0W7sXHOVqVPg01d7VEzCNcE28hmbbjNdqVBFBWmKzoTV_IeBVq_RneItpmM6ts5wE8jbdOcTr_KbuL5JhHpr9Ykmuf66mfs1pDOeeK72b4SwWsXMDeSRsuyuL3lI7uxOvWcuQUYvUXagkTQfoq8Rq0oZvdH5b4ToogWcLglFUaqQGxW_8ZHvPQeCJ0f0Y1JxdfRdMRQiw",
    },
    {
      id: 3,
      status: "Active",
      title: "Data Science for Beginners",
      description:
        "An introduction to data analysis, visualization, and machine learning using Python.",
      no_of_modules: 10,
      no_of_students: 26,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgC8aDCRzeEPd7txnwqnwGU8xLdvBA7Sooxy5PKegrDOj_GY09Osk3FeNcTumHOTc6batcN11dF7MXrpcNLklu0--hqMBpiX6rql8tinz8wgB9ph-vn2NRZ8EJHcGPKIhzzx5q1cQDYQikNKRi3m6crtso7bnA_PwPq7ZmBKnyodCYTBjCGGuvRaIOFpWV7ErMe0ejnN80sMSInE-DlmWNXXwjPt1NQoGY9u4ILxyk3nO1cd3iln5X3Ij74uidYAzRkJvKhUSBFc8",
    },
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12">
      <header className="mb-8 flex flex-col justify-baseline gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            My Courses
          </p>
          <p className="mt-1 text-sm text-[#616f89]">
            View the courses assigned to you.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filter_buttons?.map((item) => {
            return (
              <button
                key={item?.id}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  item?.isactive
                    ? "bg-[#111318] text-white transition-opacity hover:opacity-90"
                    : "bg-white text-[#111318] border border-[#e5e7eb] transition-colors hover:bg-gray-200"
                } text-sm font-medium cursor-pointer`}
              >
                {item?.label}
              </button>
            );
          })}
        </div>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
        {featured_courses_data?.map((item) => {
          return (
            <div
              key={item?.id}
              className="group grid place-items-end rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <Image
                src={item?.image_url}
                width={100}
                height={100}
                alt="logo"
                className="w-full rounded-lg shadow-2xl bg-gray-200 col-[1/2] row-[1/2] filter-[brightness(.6)] object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="col-[1/2] row-[1/2] z-10 p-5 flex flex-col text-white backdrop-blur-[2px] rounded-b-lg">
                <span className="max-w-max px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  {item?.status}
                </span>
                <p className="text-lg font-bold leading-snug mb-1 mt-5">
                  {item?.title}
                </p>
                <p className="text-sm line-clamp-2">{item?.description}</p>
                <div className="flex items-center gap-4 mt-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Module className="size-4" />
                    <span className="text-xs text-[#ffffff]">
                      {item?.no_of_modules} Modules
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Group className="size-4" />
                    <span className="text-xs text-[#ffffff]">
                      {item?.no_of_students} Students
                    </span>
                  </div>
                </div>
                <Link
                  href="#"
                  className="w-full font-medium py-2.5 px-4 rounded-lg text-sm text-center bg-[#135BEC]"
                >
                  View Course
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
