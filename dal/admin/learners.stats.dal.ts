import prisma from "@/lib/prisma.init";

export async function getLearnerStatsByOrganization(organizationId: string) {
  const [
    totalLearners,
    pendingInviteLearners,
    enrolledLearners,
    unenrolledLearners,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        organizationId,
        role: "learner",
      },
    }),
    prisma.user.count({
      where: {
        organizationId,
        role: "learner",
        status: "pending_invite",
      },
    }),
    prisma.user.count({
      where: {
        organizationId,
        role: "learner",
        status: "active",
        enrollments: { some: { enrollmentStatus: "enrolled" } },
      },
    }),
    prisma.user.count({
      where: {
        organizationId,
        role: "learner",
        status: "active",
        enrollments: { some: { enrollmentStatus: "unenrolled" } },
      },
    }),
  ]);

  return {
    totalLearners,
    pendingInviteLearners,
    enrolledLearners,
    unenrolledLearners,
  };
}
