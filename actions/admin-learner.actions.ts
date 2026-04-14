"use server";
import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function guardAdmin() {
  const { userId, organizationId } = await getSession();
  if (!userId || !organizationId) redirect("/login");
  return { userId, organizationId };
}

export async function inviteLearner(name: string, email: string) {
  const { organizationId } = await guardAdmin();

  const existing = await prisma.user.findFirst({
    where: { email, organizationId },
    select: { id: true },
  });

  if (existing)
    return {
      success: false,
      message: "An account with this email already exists",
    };

  await prisma.user.create({
    data: {
      organizationId,
      name,
      email,
      role: "learner",
      status: "pending_invite",
      passwordHash: "",
      salt: "",
    },
  });

  revalidatePath("/admin/learners");
  return { success: true, message: `Invite sent to ${email}` };
}

export async function changeLearnerStatus(
  learnerId: string,
  status: "active" | "inactive",
) {
  const { organizationId } = await guardAdmin();

  await prisma.user.update({
    where: { id: learnerId, organizationId },
    data: { status },
  });

  revalidatePath("/admin/learners");
  return { success: true };
}

export async function resendInvite(learnerId: string) {
  const { organizationId } = await guardAdmin();

  await prisma.enrollment.updateMany({
    where: {
      learnerId,
      enrollmentStatus: "enrolled",
      learner: { organizationId },
    },
    data: { inviteSentAt: new Date() },
  });

  revalidatePath("/admin/learners");
  return { success: true, message: "Invite resent successfully" };
}

export async function enrollLearner(learnerId: string, courseId: string) {
  const { organizationId } = await guardAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId, organizationId },
    select: { id: true },
  });

  if (!course) return { success: false, message: "Course not found" };

  const existing = await prisma.enrollment.findUnique({
    where: { courseId_learnerId: { courseId, learnerId } },
    select: { id: true },
  });

  if (existing) return { success: false, message: "Already enrolled" };

  await prisma.enrollment.create({
    data: {
      courseId,
      learnerId,
      enrollmentStatus: "enrolled",
      enrolledAt: new Date(),
    },
  });

  revalidatePath("/admin/learners");
  return { success: true, message: "Learner enrolled successfully" };
}

export async function unenrollLearner(learnerId: string, courseId: string) {
  await guardAdmin();

  await prisma.enrollment.update({
    where: { courseId_learnerId: { courseId, learnerId } },
    data: { enrollmentStatus: "unenrolled" },
  });

  revalidatePath("/admin/learners");
  return { success: true, message: "Learner unenrolled successfully" };
}
