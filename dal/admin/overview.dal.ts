"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function getAdminOverview() {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const [total_courses, total_instructors, total_learners, active_courses] =
    await Promise.all([
      prisma.course.count({ where: { organizationId } }),
      prisma.user.count({ where: { role: "instructor", organizationId } }),
      prisma.user.count({ where: { role: "learner", organizationId } }),
      prisma.course.count({ where: { organizationId, status: "active" } }),
    ]);

  return { total_courses, total_instructors, total_learners, active_courses };
}

export async function getAdminSystemAlerts() {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    coursesWithoutInstructors,
    unenrolledLearners,
    draftCourses,
    pendingInvites,
  ] = await Promise.all([
    // Active courses with no instructors assigned
    prisma.course.count({
      where: {
        organizationId,
        status: "active",
        instructors: { none: {} },
      },
    }),

    // Learners not enrolled in any course
    prisma.user.count({
      where: {
        organizationId,
        role: "learner",
        status: "active",
        enrollments: { none: {} },
      },
    }),

    // Courses still in draft
    prisma.course.count({
      where: { organizationId, status: "draft" },
    }),

    // Pending invites older than 7 days
    prisma.user.count({
      where: {
        organizationId,
        status: "pending_invite",
        createdAt: { lt: sevenDaysAgo },
      },
    }),
  ]);

  return {
    coursesWithoutInstructors,
    unenrolledLearners,
    draftCourses,
    pendingInvites,
  };
}

export async function getRecentActivities() {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  return await prisma.recentActivities.findMany({
    where: { organizationId },
    select: {
      id: true,
      action: true,
      target: true,
      user: { select: { name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export type AdminOverview = Awaited<ReturnType<typeof getAdminOverview>>;
export type SystemAlerts = Awaited<ReturnType<typeof getAdminSystemAlerts>>;
export type RecentActivity = Awaited<
  ReturnType<typeof getRecentActivities>
>[number];
