"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Status } from "@/app/learner/my-courses/components/course-card";

export async function filterCourses(status?: Status) {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      learnerId: userId,
      enrollmentStatus: "enrolled",
      ...(status && { progressStatus: status }),
    },
    select: {
      completedModules: true,
      progressStatus: true,
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          coverImageUrl: true,
          _count: { select: { modules: true } },
          modules: {
            select: {
              submissions: {
                where: { learnerId: userId },
                select: { status: true },
              },
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return enrollments.map((enrollment) => {
    const hasPendingReview = enrollment.course.modules.some((m) =>
      m.submissions.some((s) => s.status === "submitted"),
    );

    return {
      completedModules: enrollment.completedModules,
      progressStatus: enrollment.progressStatus,
      hasPendingReview,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        coverImageUrl: enrollment.course.coverImageUrl,
        _count: enrollment.course._count,
      },
    };
  });
}

export type CourseEnrollment = Awaited<
  ReturnType<typeof filterCourses>
>[number];

export async function getLearnerCourseOverview(courseId: string) {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      enrollments: {
        where: { learnerId: userId },
        select: {
          completedModules: true,
        },
      },
      modules: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          dueDate: true,
          position: true,
          submissions: {
            where: { learnerId: userId },
            orderBy: { attemptNumber: "desc" },
            select: {
              id: true,
              fileName: true,
              fileUrl: true,
              status: true,
              isLate: true,
              attemptNumber: true,
              fileSize: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
}
