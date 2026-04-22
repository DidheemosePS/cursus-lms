"use server";
import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function searchInstructors(courseId: string, query: string) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  if (!query.trim()) return [];

  return await prisma.user.findMany({
    where: {
      organizationId,
      role: "instructor",
      name: { contains: query, mode: "insensitive" },
      instructedCourses: { none: { courseId } },
    },
    select: {
      id: true,
      name: true,
      role: true,
      avatar: true,
    },
    take: 10,
  });
}

export async function addInstructorToCourse(
  courseId: string,
  instructorId: string,
) {
  if (!courseId || !instructorId)
    throw new Error("Invalid courseId or instructorId");

  const exists = await prisma.courseInstructor.findUnique({
    where: { courseId_instructorId: { courseId, instructorId } },
  });

  if (exists) throw new Error("User already exists");

  await prisma.courseInstructor.create({
    data: { courseId, instructorId },
  });
}

export async function removeInstructorFromCourse(
  courseId: string,
  instructorId: string,
) {
  if (!courseId || !instructorId)
    throw new Error("Invalid courseId or instructorId");

  await prisma.courseInstructor.deleteMany({
    where: { courseId, instructorId },
  });
}
