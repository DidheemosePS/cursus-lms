"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";

export async function updateCourseStatus(
  courseId: string,
  status: "active" | "archived",
) {
  // Authentication, Authorization check
  const session = await getSession();

  if (!session || !session.isLoggedIn)
    return { success: false, error: "Unauthorized" };

  if (session.role !== "admin") return { success: false, error: "Forbidden" };

  // Database mutation
  const res = await prisma.course.update({
    where: {
      id: courseId,
      organizationId: session.organizationId,
    },
    data: {
      status,
    },
  });

  // Error handling
  if (!res) {
    return { success: false, error: "Failed to delete module" };
  }

  // Return success with message
  return { success: true, message: "Successfully module deleted" };
}
