import { Status } from "./components/course-card";
import CourseList from "./components/course-list";
import FilterButton from "./components/filter-button";
import { getSession } from "@/lib/auth/auth";
import { filterCourses } from "@/dal/admin/learners.dal";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: Status | undefined }>;
}) {
  const { progress_status } = await searchParams;
  const { userId } = await getSession();

  // const featured_courses_data = [
  //   {
  //     id: 1,
  //     status: "in_progress",
  //     title: "Web Development",
  //     description:
  //       "Learn the basics of HTML, CSS, and JavaScript to build your first responsive website.",
  //     image_url:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuAN8NVMBdLUCDOL-663ZGg8PCvEWeWjYgKTm4XOSWqtE9obNGX0DlxdCdi8un3TRgotmExE_LmXAN1o86uakuBzYxXwK_bqSZf7nVXgTZnSk_zXcgqz5WLmWw1BRoJHUFJOOZz0yjI6oeEFVoMflK5RE10qi0srhQ-PfwNSm5G0Hv-7qxrfi-tTqKqH0uBmTWMTFycatxVZJ6bF0efi-eCCNZkBs9VWcWBaOlXz3M7uzUD6Dnz4vgzGhfocU1_OBhpx7osCg5KMyM4",
  //     progress: 45,
  //     moduleCount: 5,
  //   },
  //   {
  //     id: 2,
  //     status: "not_started",
  //     title: "UI/UX Design Principles",
  //     description:
  //       "Master the art of user interface and experience design with real-world projects.",
  //     image_url:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuCUNDixuVYP7xdqsseSGVdSEuiCDNQ1NNQ3YXir5VNEJRq-vuzSwXgdSvNB7qtU4yv6yi0W7sXHOVqVPg01d7VEzCNcE28hmbbjNdqVBFBWmKzoTV_IeBVq_RneItpmM6ts5wE8jbdOcTr_KbuL5JhHpr9Ykmuf66mfs1pDOeeK72b4SwWsXMDeSRsuyuL3lI7uxOvWcuQUYvUXagkTQfoq8Rq0oZvdH5b4ToogWcLglFUaqQGxW_8ZHvPQeCJ0f0Y1JxdfRdMRQiw",
  //     progress: 0,
  //     moduleCount: 8,
  //   },
  //   {
  //     id: 3,
  //     status: "completed",
  //     title: "Data Science for Beginners",
  //     description:
  //       "An introduction to data analysis, visualization, and machine learning using Python.",
  //     image_url:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuBgC8aDCRzeEPd7txnwqnwGU8xLdvBA7Sooxy5PKegrDOj_GY09Osk3FeNcTumHOTc6batcN11dF7MXrpcNLklu0--hqMBpiX6rql8tinz8wgB9ph-vn2NRZ8EJHcGPKIhzzx5q1cQDYQikNKRi3m6crtso7bnA_PwPq7ZmBKnyodCYTBjCGGuvRaIOFpWV7ErMe0ejnN80sMSInE-DlmWNXXwjPt1NQoGY9u4ILxyk3nO1cd3iln5X3Ij74uidYAzRkJvKhUSBFc8",
  //     progress: 100,
  //     moduleCount: 12,
  //   },
  // ];

  if (!userId) return;

  const courses = await filterCourses(userId, progress_status);

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-4 py-8 md:px-12 space-y-8">
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-[#111318]">
            My Courses
          </p>
          <p className="text-sm text-[#616f89]">
            Manage your enrolled courses and track progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton label="all" currentStatus={progress_status} />
          <FilterButton label="in_progress" currentStatus={progress_status} />
          <FilterButton label="not_started" currentStatus={progress_status} />
          <FilterButton label="completed" currentStatus={progress_status} />
        </div>
      </header>
      <CourseList courseList={courses} />
    </div>
  );
}
