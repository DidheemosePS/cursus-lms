"use server";
import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

type StatusFilter = "active" | "pending_invite" | "inactive";

interface GetLearnersParams {
  search?: string;
  status?: StatusFilter;
  page?: number;
}

export async function getLearners({
  search,
  status,
  page = 1,
}: GetLearnersParams) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const where = {
    organizationId,
    role: "learner" as const,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        {
          enrollments: {
            some: {
              course: {
                title: { contains: search, mode: "insensitive" as const },
              },
            },
          },
        },
      ],
    }),
  };

  const [learners, total, counts] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
        enrollments: {
          orderBy: { enrolledAt: "desc" },
          take: 1,
          select: {
            enrollmentStatus: true,
            enrolledAt: true,
            course: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.user.count({ where }),

    // Counts for filter tabs
    Promise.all([
      prisma.user.count({
        where: { organizationId, role: "learner" },
      }),
      prisma.user.count({
        where: { organizationId, role: "learner", status: "active" },
      }),
      prisma.user.count({
        where: { organizationId, role: "learner", status: "pending_invite" },
      }),
      prisma.user.count({
        where: { organizationId, role: "learner", status: "inactive" },
      }),
    ]),
  ]);

  return {
    learners,
    total,
    pageSize: PAGE_SIZE,
    counts: {
      all: counts[0],
      active: counts[1],
      pending_invite: counts[2],
      inactive: counts[3],
    },
  };
}

export async function getLearnerDetail(learnerId: string) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const learner = await prisma.user.findUnique({
    where: { id: learnerId, organizationId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      createdAt: true,
      enrollments: {
        select: {
          enrollmentStatus: true,
          enrolledAt: true,
          completedModules: true,
          progressStatus: true,
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              coverImageUrl: true,
              _count: { select: { modules: true } },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  // All courses in the org for the enroll dropdown
  const availableCourses = await prisma.course.findMany({
    where: {
      organizationId,
      status: "active",
      enrollments: {
        none: { learnerId },
      },
    },
    select: { id: true, title: true, code: true },
    orderBy: { title: "asc" },
  });

  return { learner, availableCourses };
}

export type LearnerListItem = Awaited<
  ReturnType<typeof getLearners>
>["learners"][number];

export type LearnerDetail = Awaited<
  ReturnType<typeof getLearnerDetail>
>["learner"];

export type AvailableCourse = Awaited<
  ReturnType<typeof getLearnerDetail>
>["availableCourses"][number];

export type LearnerCounts = Awaited<ReturnType<typeof getLearners>>["counts"];
