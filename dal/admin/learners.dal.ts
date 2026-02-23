import { Status } from "@/app/learner/my-courses/components/course-card";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function filterCourses(learnerId: string, status?: Status) {
  return await prisma.enrollment.findMany({
    where: {
      learnerId,
      enrollmentStatus: "enrolled",
      ...(status && { progressStatus: status }),
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          coverImageUrl: true,
          _count: {
            select: {
              modules: true,
            },
          },
        },
      },
      progressStatus: true,
      progressPercent: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getLearnerCourseOverview(
  courseId: string,
  organizationId: string,
  userId: string,
) {
  return unstable_cache(
    async () => {
      return await prisma.course.findUnique({
        where: { id: courseId, organizationId },
        select: {
          id: true,
          title: true,
          description: true,
          enrollments: {
            where: { learnerId: userId, courseId },
            select: { progressPercent: true },
          },
          modules: {
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
                  fileUrl: true,
                  status: true,
                  isLate: true,
                  attemptNumber: true,
                  fileSize: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
        },
      });
    },
    [`course-${courseId}-${userId}`],
    {
      tags: [`course-${courseId}-${userId}`],
      revalidate: 3600,
    },
  )();
}
