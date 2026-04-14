"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const PAGE_SIZE = 12; // cards look better in multiples of 3/4

type StatusFilter = "active" | "pending_invite" | "inactive";

interface GetInstructorsParams {
  search?: string;
  status?: StatusFilter;
  page?: number;
}

export async function getInstructors({
  search,
  status,
  page = 1,
}: GetInstructorsParams) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const where = {
    organizationId,
    role: "instructor" as const,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [instructors, total, counts] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        _count: {
          select: { instructedCourses: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.user.count({ where }),

    Promise.all([
      prisma.user.count({ where: { organizationId, role: "instructor" } }),
      prisma.user.count({
        where: { organizationId, role: "instructor", status: "active" },
      }),
      prisma.user.count({
        where: { organizationId, role: "instructor", status: "pending_invite" },
      }),
      prisma.user.count({
        where: { organizationId, role: "instructor", status: "inactive" },
      }),
    ]),
  ]);

  return {
    instructors,
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

export async function getInstructorDetail(instructorId: string) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const instructor = await prisma.user.findUnique({
    where: { id: instructorId, organizationId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      createdAt: true,
      instructedCourses: {
        select: {
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              status: true,
              _count: { select: { enrollments: true, modules: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Courses in the org not yet assigned to this instructor
  const availableCourses = await prisma.course.findMany({
    where: {
      organizationId,
      status: "active",
      instructors: { none: { instructorId } },
    },
    select: { id: true, title: true, code: true },
    orderBy: { title: "asc" },
  });

  return { instructor, availableCourses };
}

export type InstructorListItem = Awaited<
  ReturnType<typeof getInstructors>
>["instructors"][number];

export type InstructorDetail = Awaited<
  ReturnType<typeof getInstructorDetail>
>["instructor"];

export type InstructorAvailableCourse = Awaited<
  ReturnType<typeof getInstructorDetail>
>["availableCourses"][number];

export type InstructorCounts = Awaited<
  ReturnType<typeof getInstructors>
>["counts"];
