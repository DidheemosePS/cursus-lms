"use server";

import prisma from "@/lib/prisma.init";

export async function addInstructorToCourse(
  courseId: string,
  instructorId: string,
) {
  if (!courseId || !instructorId) {
    throw new Error("Invalid courseId or instructorId");
  }

  const exists = await prisma.courseInstructor.findUnique({
    where: {
      courseId_instructorId: {
        courseId,
        instructorId,
      },
    },
  });

  if (exists) throw new Error("User already exist");

  await prisma.courseInstructor.create({
    data: {
      courseId,
      instructorId,
    },
  });
}

export async function removeInstructorFromCourse(
  courseId: string,
  instructorId: string,
) {
  if (!courseId || !instructorId) {
    throw new Error("Invalid courseId or instructorId");
  }
  await prisma.courseInstructor.deleteMany({
    where: { courseId, instructorId },
  });
}
