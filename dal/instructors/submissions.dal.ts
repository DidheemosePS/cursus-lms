"use server";
import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

export type SubmissionStatus = "pending" | "late" | "reviewed";
export type SortOption = "newest" | "oldest" | "due_date" | "late_first";
export type DateFilter = "all" | "today" | "yesterday";

interface GetSubmissionsParams {
  status?: SubmissionStatus;
  dateFilter?: DateFilter;
  courseId?: string;
  attempt?: "first" | "resubmission";
  sort?: SortOption;
  page?: number;
}

export async function getSubmissions({
  status,
  dateFilter = "all",
  courseId,
  attempt,
  sort = "newest",
  page = 1,
}: GetSubmissionsParams) {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  // Courses this instructor teaches
  const instructedCourseIds = (
    await prisma.courseInstructor.findMany({
      where: { instructorId: userId },
      select: { courseId: true },
    })
  ).map((c) => c.courseId);

  if (instructedCourseIds.length === 0) {
    return {
      submissions: [],
      total: 0,
      counts: {
        all: 0,
        today: 0,
        yesterday: 0,
        pending: 0,
        late: 0,
        reviewed: 0,
      },
      courses: [],
      pageSize: PAGE_SIZE,
    };
  }

  // Courses for filter dropdown
  const courses = await prisma.course.findMany({
    where: { id: { in: instructedCourseIds } },
    select: { id: true, title: true, code: true },
  });

  const targetCourseIds = courseId
    ? instructedCourseIds.filter((id) => id === courseId)
    : instructedCourseIds;

  // Date range for today/yesterday filter
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const dateWhere =
    dateFilter === "today"
      ? { createdAt: { gte: startOfToday } }
      : dateFilter === "yesterday"
        ? { createdAt: { gte: startOfYesterday, lt: startOfToday } }
        : {};

  // Status where clause
  const statusWhere =
    status === "reviewed"
      ? { status: "reviewed" as const }
      : status === "late"
        ? { status: "submitted" as const, isLate: true }
        : status === "pending"
          ? { status: "submitted" as const, isLate: false }
          : {};

  // Attempt filter
  const attemptWhere =
    attempt === "first"
      ? { attemptNumber: 1 }
      : attempt === "resubmission"
        ? { attemptNumber: { gt: 1 } }
        : {};

  const baseWhere = {
    module: { courseId: { in: targetCourseIds } },
    ...dateWhere,
    ...statusWhere,
    ...attemptWhere,
  };

  // Sort order
  const orderBy =
    sort === "oldest"
      ? [{ createdAt: "asc" as const }]
      : sort === "due_date"
        ? [{ module: { dueDate: "asc" as const } }]
        : sort === "late_first"
          ? [{ isLate: "desc" as const }, { createdAt: "desc" as const }]
          : [{ createdAt: "desc" as const }]; // newest default

  // Fetch all matching submissions for count + paginate in JS
  // (avoids a second COUNT query)
  const allSubmissions = await prisma.submission.findMany({
    where: baseWhere,
    orderBy,
    select: {
      id: true,
      attemptNumber: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
      isLate: true,
      status: true,
      createdAt: true,
      module: {
        select: {
          id: true,
          title: true,
          position: true,
          dueDate: true,
          course: {
            select: { id: true, title: true, code: true },
          },
        },
      },
      learner: {
        select: { id: true, name: true, avatar: true },
      },
      feedback: {
        select: { id: true, content: true, createdAt: true },
      },
    },
  });

  // Derive UI status per submission
  const shaped = allSubmissions.map((s) => {
    const uiStatus: SubmissionStatus =
      s.status === "reviewed" ? "reviewed" : s.isLate ? "late" : "pending";

    const lateDays =
      s.isLate && s.status !== "reviewed"
        ? Math.ceil(
            (s.createdAt.getTime() - new Date(s.module.dueDate).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null;

    return {
      id: s.id,
      attemptNumber: s.attemptNumber,
      isResubmission: s.attemptNumber > 1,
      fileName: s.fileName,
      fileUrl: s.fileUrl,
      fileSize: s.fileSize,
      isLate: s.isLate,
      uiStatus,
      lateDays,
      submittedAt: s.createdAt,
      dueDate: s.module.dueDate,
      moduleTitle: s.module.title,
      modulePosition: s.module.position,
      moduleId: s.module.id,
      courseId: s.module.course.id,
      courseTitle: s.module.course.title,
      courseCode: s.module.course.code,
      learner: s.learner,
      feedback: s.feedback,
    };
  });

  // Tab counts — computed from the full unfiltered set for this instructor
  const allForCounts = await prisma.submission.findMany({
    where: { module: { courseId: { in: targetCourseIds } } },
    select: {
      status: true,
      isLate: true,
      createdAt: true,
    },
  });

  const counts = allForCounts.reduce(
    (acc, s) => {
      acc.all++;
      const isToday = s.createdAt >= startOfToday;
      const isYesterday =
        s.createdAt >= startOfYesterday && s.createdAt < startOfToday;
      if (isToday) acc.today++;
      if (isYesterday) acc.yesterday++;
      if (s.status === "reviewed") acc.reviewed++;
      else if (s.isLate) acc.late++;
      else acc.pending++;
      return acc;
    },
    { all: 0, today: 0, yesterday: 0, pending: 0, late: 0, reviewed: 0 },
  );

  const total = shaped.length;
  const paginated = shaped.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    submissions: paginated,
    total,
    counts,
    courses,
    pageSize: PAGE_SIZE,
  };
}

export type SubmissionRow = Awaited<
  ReturnType<typeof getSubmissions>
>["submissions"][number];

export type SubmissionCourseOption = Awaited<
  ReturnType<typeof getSubmissions>
>["courses"][number];

export type SubmissionCounts = Awaited<
  ReturnType<typeof getSubmissions>
>["counts"];
