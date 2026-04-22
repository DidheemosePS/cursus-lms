"use server";
import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { FieldChanges } from "@/app/admin/courses/[slug]/components/course-info/course-info";

const PAGE_SIZE = 12;

type CourseStatus = "draft" | "active" | "archived";

interface GetCoursesParams {
  search?: string;
  status?: CourseStatus;
  page?: number;
}

export async function getCourses({
  search,
  status,
  page = 1,
}: GetCoursesParams) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const where = {
    organizationId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { code: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [courses, total, counts] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        status: true,
        coverImageUrl: true,
        _count: {
          select: {
            modules: true,
            enrollments: true,
            instructors: true,
          },
        },
      },
    }),

    prisma.course.count({ where }),

    Promise.all([
      prisma.course.count({ where: { organizationId } }),
      prisma.course.count({ where: { organizationId, status: "active" } }),
      prisma.course.count({ where: { organizationId, status: "draft" } }),
      prisma.course.count({ where: { organizationId, status: "archived" } }),
    ]),
  ]);

  return {
    courses,
    total,
    pageSize: PAGE_SIZE,
    counts: {
      all: counts[0],
      active: counts[1],
      draft: counts[2],
      archived: counts[3],
    },
  };
}

// Keep existing functions below unchanged
export async function getCoursesByOrganization(organizationId: string) {
  return await prisma.course.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      status: true,
      coverImageUrl: true,
      _count: {
        select: { modules: true, instructors: true },
      },
    },
  });
}

export async function VerifyCourse(courseId: string, organizationId: string) {
  return await prisma.course.findUnique({
    where: { id: courseId, organizationId },
    select: { id: true },
  });
}

export async function updateCourse(
  courseId: string,
  organizationId: string,
  data: FieldChanges,
) {
  return await prisma.course.update({
    where: { id: courseId, organizationId },
    data,
  });
}

export async function getCourseInfoById(courseId: string) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  return await prisma.course.findUnique({
    where: { id: courseId, organizationId },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      coverImageUrl: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function getModulesById(courseId: string) {
  return await prisma.module.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      description: true,
      position: true,
      startDate: true,
      dueDate: true,
    },
    orderBy: { position: "asc" },
  });
}

export async function getInstructorsById(courseId: string) {
  return await prisma.courseInstructor.findMany({
    where: { courseId },
    select: {
      courseId: true,
      instructorId: true,
      instructor: {
        select: { id: true, name: true, role: true, avatar: true },
      },
    },
  });
}

export async function searchInstructors(courseId: string, name: string) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  return await prisma.user.findMany({
    where: {
      organizationId,
      role: "instructor",
      name: { contains: name, mode: "insensitive" },
      instructedCourses: { none: { courseId } },
    },
    select: {
      id: true,
      name: true,
      role: true,
      avatar: true,
    },
  });
}

export async function getCourseEnrollmentSummary(courseId: string) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const [totalEnrolled, completed, withLateSubmission] = await Promise.all([
    // Total actively enrolled learners
    prisma.enrollment.count({
      where: { courseId, enrollmentStatus: "enrolled" },
    }),

    // Learners who completed the course
    prisma.enrollment.count({
      where: {
        courseId,
        enrollmentStatus: "enrolled",
        progressStatus: "completed",
      },
    }),

    // Learners with at least one late submission
    prisma.enrollment.count({
      where: {
        courseId,
        enrollmentStatus: "enrolled",
        learner: {
          submissions: {
            some: {
              isLate: true,
              module: { courseId },
            },
          },
        },
      },
    }),
  ]);

  const completionRate =
    totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0;

  return {
    totalEnrolled,
    completed,
    completionRate,
    withLateSubmission,
    inProgress: totalEnrolled - completed,
  };
}

export type EnrollmentSummary = Awaited<
  ReturnType<typeof getCourseEnrollmentSummary>
>;

export type CourseListItem = Awaited<
  ReturnType<typeof getCourses>
>["courses"][number];

export type CourseCounts = Awaited<ReturnType<typeof getCourses>>["counts"];
