import prisma from "@/lib/prisma";

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
        enrollments: { some: { status: "enrolled" } },
      },
    }),
    prisma.user.count({
      where: {
        organizationId,
        role: "learner",
        status: "active",
        enrollments: { some: { status: "unenrolled" } },
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
