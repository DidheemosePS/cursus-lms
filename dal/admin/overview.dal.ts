import prisma from "@/lib/prisma.init";

export async function getAdminOverviewByOrganization(organizationId: string) {
  if (!organizationId) {
    throw new Error("organizationId is required");
  }

  const [total_courses, total_instructors, total_learners, active_courses] =
    await Promise.all([
      prisma.course.count({
        where: {
          organizationId,
        },
      }),

      prisma.user.count({
        where: {
          role: "instructor",
          organizationId,
        },
      }),

      prisma.user.count({
        where: {
          role: "learner",
          organizationId,
        },
      }),

      prisma.course.count({
        where: {
          organizationId,
          status: "active",
        },
      }),
    ]);

  return {
    total_courses,
    total_instructors,
    total_learners,
    active_courses,
  };
}

export async function getAdminRecentActivitiesByOrganization(
  organizationId: string,
) {
  if (!organizationId) {
    throw new Error("organizationId is required");
  }

  return await prisma.recentActivities.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      action: true,
      target: true,
      user: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
  });
}

export async function getAdminSystemAlertsByOrganization(
  organizationId: string,
) {
  return await prisma;
}
