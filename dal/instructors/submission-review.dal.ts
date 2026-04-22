"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function getSubmissionDetail(submissionId: string) {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      attemptNumber: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
      isLate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      module: {
        select: {
          id: true,
          title: true,
          position: true,
          dueDate: true,
          startDate: true,
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              _count: { select: { modules: true } },
            },
          },
          // All attempts for this module by this learner
          submissions: {
            orderBy: { attemptNumber: "asc" },
            select: {
              id: true,
              attemptNumber: true,
              fileName: true,
              fileUrl: true,
              fileSize: true,
              isLate: true,
              status: true,
              createdAt: true,
              feedback: {
                select: {
                  id: true,
                  content: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      },
      learner: {
        select: {
          id: true,
          name: true,
          avatar: true,
          email: true,
          enrollments: {
            where: {
              course: {
                instructors: { some: { instructorId: userId } },
              },
            },
            select: {
              completedModules: true,
              course: {
                select: {
                  _count: { select: { modules: true } },
                },
              },
            },
          },
        },
      },
      feedback: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!submission) return null;

  // Next pending submission for this instructor (excluding current)
  const instructedCourseIds = (
    await prisma.courseInstructor.findMany({
      where: { instructorId: userId },
      select: { courseId: true },
    })
  ).map((c) => c.courseId);

  const nextSubmission = await prisma.submission.findFirst({
    where: {
      id: { not: submissionId },
      status: "submitted",
      module: { courseId: { in: instructedCourseIds } },
    },
    orderBy: [{ isLate: "desc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  // Previous attempts = all attempts except current
  const previousAttempts = submission.module.submissions.filter(
    (s) => s.id !== submissionId,
  );

  const lateDays = submission.isLate
    ? Math.ceil(
        (submission.createdAt.getTime() -
          new Date(submission.module.dueDate).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const isEdited =
    submission.feedback &&
    submission.feedback.updatedAt > submission.feedback.createdAt;

  return {
    id: submission.id,
    attemptNumber: submission.attemptNumber,
    isResubmission: submission.attemptNumber > 1,
    fileName: submission.fileName,
    fileUrl: submission.fileUrl,
    fileSize: submission.fileSize,
    isLate: submission.isLate,
    lateDays,
    status: submission.status,
    submittedAt: submission.createdAt,
    dueDate: submission.module.dueDate,
    moduleId: submission.module.id,
    moduleTitle: submission.module.title,
    modulePosition: submission.module.position,
    courseId: submission.module.course.id,
    courseTitle: submission.module.course.title,
    courseCode: submission.module.course.code,
    totalModules: submission.module.course._count.modules,
    learner: submission.learner,
    feedback: submission.feedback
      ? { ...submission.feedback, isEdited: isEdited ?? false }
      : null,
    previousAttempts,
    nextSubmissionId: nextSubmission?.id ?? null,
  };
}

export type SubmissionDetail = Awaited<ReturnType<typeof getSubmissionDetail>>;
