"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

interface GetLearnersParams {
  search?: string;
  courseId?: string;
  status?: "late" | "pending" | "caught_up";
  page?: number;
}

export async function getLearners({
  search,
  courseId,
  status,
  page = 1,
}: GetLearnersParams) {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const instructedCourseIds = (
    await prisma.courseInstructor.findMany({
      where: { instructorId: userId },
      select: { courseId: true },
    })
  ).map((c) => c.courseId);

  if (instructedCourseIds.length === 0) {
    return { learners: [], total: 0, courses: [], pageSize: PAGE_SIZE };
  }

  const courses = await prisma.course.findMany({
    where: { id: { in: instructedCourseIds } },
    select: { id: true, title: true, code: true },
  });

  const targetCourseIds = courseId
    ? instructedCourseIds.filter((id) => id === courseId)
    : instructedCourseIds;

  if (targetCourseIds.length === 0) {
    return { learners: [], total: 0, courses, pageSize: PAGE_SIZE };
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: { in: targetCourseIds },
      enrollmentStatus: "enrolled",
      ...(search
        ? {
            learner: {
              name: { contains: search, mode: "insensitive" as const },
            },
          }
        : {}),
    },
    select: {
      learnerId: true,
      courseId: true,
      completedModules: true,
      course: {
        select: {
          id: true,
          title: true,
          _count: { select: { modules: true } },
          modules: {
            select: {
              id: true,
              dueDate: true,
              submissions: {
                select: { learnerId: true, isLate: true, status: true },
              },
            },
          },
        },
      },
      learner: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  const now = new Date();

  const shaped = enrollments.map((e) => {
    const modules = e.course.modules;
    const totalModules = e.course._count.modules;

    // Late = past due with no submission OR submitted with isLate flag
    const lateCount = modules.filter((m) => {
      const isPastDue = new Date(m.dueDate) < now;
      const submission = m.submissions.find((s) => s.learnerId === e.learnerId);
      if (!submission) return isPastDue;
      return submission.isLate;
    }).length;

    // Pending = due date still in the future, not yet submitted
    const pendingCount = modules.filter((m) => {
      const isDueInFuture = new Date(m.dueDate) >= now;
      const hasSubmission = m.submissions.some(
        (s) => s.learnerId === e.learnerId,
      );
      return isDueInFuture && !hasSubmission;
    }).length;

    return {
      learnerId: e.learnerId,
      courseId: e.courseId,
      name: e.learner.name,
      avatar: e.learner.avatar,
      courseTitle: e.course.title,
      completedModules: e.completedModules,
      totalModules,
      lateCount,
      pendingCount,
    };
  });

  const filtered = shaped.filter((row) => {
    if (status === "late") return row.lateCount > 0;
    if (status === "pending")
      return row.pendingCount > 0 && row.lateCount === 0;
    if (status === "caught_up")
      return row.lateCount === 0 && row.pendingCount === 0;
    return true;
  });

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { learners: paginated, total, courses, pageSize: PAGE_SIZE };
}

// Drawer detail

export async function getLearnerDetail(learnerId: string) {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const instructedCourseIds = (
    await prisma.courseInstructor.findMany({
      where: { instructorId: userId },
      select: { courseId: true },
    })
  ).map((c) => c.courseId);

  return prisma.user.findUnique({
    where: { id: learnerId },
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      enrollments: {
        where: {
          courseId: { in: instructedCourseIds },
          enrollmentStatus: "enrolled",
        },
        select: {
          completedModules: true,
          progressPercent: true,
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              _count: { select: { modules: true } },
              modules: {
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  title: true,
                  position: true,
                  dueDate: true,
                  submissions: {
                    where: { learnerId },
                    orderBy: { attemptNumber: "desc" },
                    take: 1,
                    select: {
                      id: true,
                      fileName: true,
                      fileUrl: true,
                      isLate: true,
                      status: true,
                      createdAt: true,
                      feedback: {
                        select: {
                          id: true,
                          content: true,
                          createdAt: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export type LearnerRow = Awaited<
  ReturnType<typeof getLearners>
>["learners"][number];

export type CourseOption = Awaited<
  ReturnType<typeof getLearners>
>["courses"][number];

export type LearnerDetail = Awaited<ReturnType<typeof getLearnerDetail>>;
