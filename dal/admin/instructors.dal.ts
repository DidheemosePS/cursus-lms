import prisma from "@/lib/prisma.init";

export async function getInstructorsByOrganization(organizationId: string) {
  return await prisma.user.findMany({
    where: {
      organizationId,
      role: "instructor",
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      _count: {
        select: {
          instructedCourses: true,
        },
      },
    },
  });
}
