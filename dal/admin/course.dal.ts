import { FieldChanges } from "@/app/admin/courses/[slug]/components/course-info/course-info";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getCoursesByOrganization(organizationId: string) {
  return await prisma.course.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      status: true,
      _count: {
        select: {
          modules: true,
          instructors: true,
        },
      },
    },
  });
}

// Course verification
export async function VerifyCourse(courseId: string, organizationId: string) {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
      organizationId,
    },
    select: {
      id: true,
    },
  });
}

// Update Course
export async function updateCourse(
  courseId: string,
  organizationId: string,
  data: FieldChanges,
) {
  return await prisma.course.update({
    where: {
      id: courseId,
      organizationId,
    },
    data,
  });
}

export async function getCourseInfoById(courseId: string) {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
    },
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

export const getModulesById = unstable_cache(
  async (courseId: string) => {
    return await prisma.module.findMany({
      where: {
        courseId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        position: true,
        startDate: true,
        dueDate: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  },
  ["getModulesById"], // cache key
  {
    tags: ["getModulesById"], // tag used for revalidation
  },
);

export async function getInstructorsById(courseId: string) {
  return await prisma.courseInstructor.findMany({
    where: { courseId },
    select: {
      courseId: true,
      instructorId: true,
      instructor: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
}

export async function searchInstructors(courseId: string, name: string) {
  return await prisma.user.findMany({
    where: {
      role: "instructor",
      name: {
        contains: name,
        mode: "insensitive",
      },
      instructedCourses: {
        none: {
          courseId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
}
