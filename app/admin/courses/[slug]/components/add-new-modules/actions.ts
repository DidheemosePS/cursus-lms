"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { modulesDbSchema } from "@/lib/validation/modules";
import { updateTag } from "next/cache";

interface DataProps {
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
}

export async function createModule(courseId: string, dataProps: DataProps[]) {
  // Authentication, Authorization check
  const session = await getSession();

  if (!session || !session.isLoggedIn)
    return { success: false, error: "Unauthorized" };

  if (session.role !== "admin") return { success: false, error: "Forbidden" };

  // Course verification
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      organizationId: session.organizationId,
    },
  });

  if (!course) return { success: false, error: "Forbidden" };

  // Finding module last position
  const lastPosition = await prisma.module.count({
    where: { courseId },
  });

  const data = dataProps.map((module, index) => ({
    ...module,
    courseId,
    position: lastPosition + index + 1,
  }));

  // Server side data validation
  const parsed = modulesDbSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Invalid module data" };
  }

  // Database mutation
  const res = await prisma.module.createManyAndReturn({
    data: parsed.data,
    select: {
      id: true,
      title: true,
      description: true,
      position: true,
      startDate: true,
      dueDate: true,
    },
  });

  // Error handling
  if (!res) {
    return { success: false, error: "Failed to add new modules" };
  }

  // revalidate the cache using updateTag
  updateTag("getModulesById");

  // Return success with message
  return {
    success: true,
    message: "Successfully added new modules",
    modules: res,
  };
}
