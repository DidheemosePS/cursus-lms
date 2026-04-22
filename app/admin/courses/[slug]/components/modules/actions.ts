"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import { revalidateTag } from "next/cache";
import { ModulesProps } from "./modules";

export async function reorder(
  courseId: string,
  payload: Pick<ModulesProps, "id" | "position">[],
) {
  // Authentication, Authorization check
  const session = await getSession();

  if (!session || !session.isLoggedIn)
    return { success: false, error: "Unauthorized" };

  if (session.role !== "admin") return { success: false, error: "Forbidden" };

  // Course verification
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) return { success: false, error: "Course not found" };

  // Module verification
  const moduleIds = payload.map((m) => m.id);
  const count = await prisma.module.count({
    where: {
      id: { in: moduleIds },
      courseId,
    },
  });

  if (count === 0)
    return {
      success: false,
      error: "One or more modules not found in this course",
    };

  // Database mutation
  const res = await prisma.$transaction(
    payload.map((module) =>
      prisma.module.update({
        where: { id: module.id, courseId },
        data: { position: module.position },
        select: { id: true, position: true },
      }),
    ),
  );

  // Error handling
  if (!res.length) {
    return { success: false, error: "Failed to reorder module" };
  }

  // revalidate the cache using updateTag
  revalidateTag("getModulesById", "max");

  // Return success with message
  return { success: true, message: "Successfully reordered module" };
}
