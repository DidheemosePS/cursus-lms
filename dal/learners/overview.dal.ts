import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import { formatTimeAgo, timeStampStyling } from "@/utils/timestamp-formatter";
import { redirect } from "next/navigation";

export async function getProgression() {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      learnerId: userId,
      enrollmentStatus: "enrolled",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          modules: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              startDate: true,
              dueDate: true,
              submissions: {
                where: { learnerId: userId },
                orderBy: { attemptNumber: "desc" },
                take: 1,
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const now = new Date();

  return enrollments.map(({ course }) => {
    const modules = course.modules;

    // Find the current active module:
    // - First module with no submission (not yet started or in progress)
    // - If all submitted, show the last one
    const activeModule =
      modules.find((m) => m.submissions.length === 0) ??
      modules[modules.length - 1];

    const submission = activeModule?.submissions[0] ?? null;
    const isSubmitted =
      submission?.status === "submitted" || submission?.status === "reviewed";

    // Total modules vs submitted modules for progress %
    const totalModules = modules.length;
    const submittedCount = modules.filter(
      (m) => m.submissions.length > 0,
    ).length;
    const completedPercentage =
      totalModules > 0 ? Math.round((submittedCount / totalModules) * 100) : 0;

    // Derive status
    const isPastDue =
      activeModule && new Date(activeModule.dueDate) < now && !isSubmitted;

    const status: "Pending" | "Overdue" | "Submitted" = isSubmitted
      ? "Submitted"
      : isPastDue
        ? "Overdue"
        : "Pending";

    const startDate = timeStampStyling(activeModule.startDate);
    const dueDate = timeStampStyling(activeModule.dueDate);

    return {
      courseId: course.id,
      moduleId: activeModule?.id,
      title: course.title,
      moduleLabel: activeModule
        ? `Module ${activeModule.position}`
        : "No modules",
      status,
      startDate: activeModule
        ? `${startDate.datePart}, ${startDate.timePart}`
        : "—",
      dueDate: activeModule ? `${dueDate.datePart}, ${dueDate.timePart}` : "—",

      completedPercentage,
      submissionId: submission?.id ?? null,
    };
  });
}

export async function getPendingModules() {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const now = new Date();

  // Get all modules from enrolled courses that have no submission yet
  const modules = await prisma.module.findMany({
    where: {
      dueDate: { gte: now }, // due in the future (pending) — remove to include overdue too
      course: {
        enrollments: {
          some: {
            learnerId: userId,
            enrollmentStatus: "enrolled",
          },
        },
      },
      // No submission from this learner yet
      submissions: {
        none: { learnerId: userId },
      },
    },
    orderBy: { dueDate: "asc" }, // closest deadline first
    select: {
      id: true,
      title: true,
      position: true,
      dueDate: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return modules.map((m) => ({
    moduleId: m.id,
    courseId: m.course.id,
    title: m.title,
    description: `${m.course.title} • Module ${m.position}`,
    dueDate: m.dueDate,
    dueDateLabel: formatTimeAgo(m.dueDate),
    isOverdue: m.dueDate < now,
  }));
}

export async function getCompletedSubmissions() {
  const { userId } = await getSession();
  if (!userId) redirect("/login");

  const submissions = await prisma.submission.findMany({
    where: {
      learnerId: userId,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      module: {
        select: {
          id: true,
          title: true,
          position: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      feedback: {
        select: {
          content: true,
        },
      },
    },
  });

  return submissions.map((s) => {
    const { datePart, timePart } = timeStampStyling(s.createdAt);
    return {
      submissionId: s.id,
      moduleId: s.module.id,
      courseId: s.module.course.id,
      title: s.module.title,
      description: `${s.module.course.title} • Module ${s.module.position}`,
      // "reviewed" means the instructor left feedback → treat as Graded
      status: s.status === "reviewed" ? "Graded" : "Submitted",
      submittedOn: `${datePart}, ${timePart}`,
      feedback: s.feedback?.content ?? null,
    };
  });
}
