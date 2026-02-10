"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export async function deleteModule(moduleId: string, courseId: string) {
  // Authentication, Authorization check
  const session = await getSession();

  if (!session || !session.isLoggedIn)
    return { success: false, error: "Unauthorized" };

  if (session.role !== "admin") return { success: false, error: "Forbidden" };

  // Module verification
  const hasModule = await prisma.module.findUnique({
    where: {
      id: moduleId,
      courseId,
    },
  });

  if (!hasModule) return { success: false, error: "Forbidden" };

  // Database mutation
  const res = await prisma.module.delete({
    where: {
      id: moduleId,
      courseId,
    },
  });

  // Error handling
  if (!res) {
    return { success: false, error: "Failed to delete module" };
  }

  // revalidate the cache using updateTag
  updateTag("getModulesById");

  // Return success with message
  return { success: true, message: "Successfully module deleted" };
}
