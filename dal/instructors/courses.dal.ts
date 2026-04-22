import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import { redirect } from "next/navigation";

export async function getMyCourses() {
  const { userId } = await getSession();

  if (!userId) redirect("/login");

  return prisma.course.findMany({
    where: {
      instructors: {
        some: { instructorId: userId },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      coverImageUrl: true,
      _count: { select: { modules: true, enrollments: true } },
    },
  });
}
