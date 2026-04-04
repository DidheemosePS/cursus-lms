import prisma from "@/lib/prisma.init";

export async function getLearnersEnrollmentList(organizationId: string) {
  return await prisma.user.findMany({
    where: {
      organizationId,
      role: "learner",
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      _count: {
        select: {
          enrollments: true,
        },
      },

      enrollments: {
        select: {
          enrollmentStatus: true,
          enrolledAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
