"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

// Shared helper

async function getInstructorCourseIds(userId: string) {
  const rows = await prisma.courseInstructor.findMany({
    where: { instructorId: userId },
    select: { courseId: true },
  });
  return rows.map((r) => r.courseId);
}

// Stat cards

export async function getDashboardStats() {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const courseIds = await getInstructorCourseIds(userId);
  if (courseIds.length === 0) {
    return {
      pending: 0,
      late: 0,
      reviewed: 0,
      totalLearners: 0,
      totalCourses: 0,
    };
  }

  const [submissions, totalLearners] = await Promise.all([
    prisma.submission.findMany({
      where: { module: { courseId: { in: courseIds } } },
      select: { status: true, isLate: true },
    }),
    prisma.enrollment.count({
      where: {
        courseId: { in: courseIds },
        enrollmentStatus: "enrolled",
      },
    }),
  ]);

  const counts = submissions.reduce(
    (acc, s) => {
      if (s.status === "reviewed") acc.reviewed++;
      else if (s.isLate) acc.late++;
      else acc.pending++;
      return acc;
    },
    { pending: 0, late: 0, reviewed: 0 },
  );

  return {
    ...counts,
    totalLearners,
    totalCourses: courseIds.length,
  };
}

// Recent unreviewed submissions

export async function getRecentSubmissions() {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const courseIds = await getInstructorCourseIds(userId);
  if (courseIds.length === 0) return [];

  const submissions = await prisma.submission.findMany({
    where: {
      module: { courseId: { in: courseIds } },
      status: "submitted", // only unreviewed
    },
    orderBy: [
      { isLate: "desc" }, // late ones first
      { createdAt: "desc" },
    ],
    take: 6,
    select: {
      id: true,
      attemptNumber: true,
      isLate: true,
      createdAt: true,
      fileName: true,
      fileUrl: true,
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
    },
  });

  return submissions.map((s) => ({
    id: s.id,
    attemptNumber: s.attemptNumber,
    isResubmission: s.attemptNumber > 1,
    isLate: s.isLate,
    submittedAt: s.createdAt,
    dueDate: s.module.dueDate,
    fileName: s.fileName,
    fileUrl: s.fileUrl,
    moduleTitle: s.module.title,
    modulePosition: s.module.position,
    moduleId: s.module.id,
    courseId: s.module.course.id,
    courseTitle: s.module.course.title,
    courseCode: s.module.course.code,
    learner: s.learner,
    lateDays: s.isLate
      ? Math.ceil(
          (s.createdAt.getTime() - new Date(s.module.dueDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null,
  }));
}

// Upcoming module deadlines

export async function getUpcomingDeadlines() {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const courseIds = await getInstructorCourseIds(userId);
  if (courseIds.length === 0) return [];

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const modules = await prisma.module.findMany({
    where: {
      courseId: { in: courseIds },
      dueDate: { gte: now, lte: in7Days },
    },
    orderBy: { dueDate: "asc" },
    select: {
      id: true,
      title: true,
      position: true,
      dueDate: true,
      course: {
        select: {
          id: true,
          title: true,
          code: true,
          enrollments: {
            where: { enrollmentStatus: "enrolled" },
            select: { learnerId: true },
          },
        },
      },
      submissions: {
        select: { learnerId: true },
      },
    },
  });

  return modules.map((m) => {
    const totalLearners = m.course.enrollments.length;
    // Unique learners who submitted this module
    const submittedLearnerIds = new Set(m.submissions.map((s) => s.learnerId));
    const submittedCount = submittedLearnerIds.size;

    const diffMs = new Date(m.dueDate).getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      moduleId: m.id,
      moduleTitle: m.title,
      modulePosition: m.position,
      dueDate: m.dueDate,
      daysLeft,
      courseId: m.course.id,
      courseTitle: m.course.title,
      courseCode: m.course.code,
      totalLearners,
      submittedCount,
      remainingCount: totalLearners - submittedCount,
    };
  });
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
export type RecentSubmission = Awaited<
  ReturnType<typeof getRecentSubmissions>
>[number];
export type UpcomingDeadline = Awaited<
  ReturnType<typeof getUpcomingDeadlines>
>[number];
