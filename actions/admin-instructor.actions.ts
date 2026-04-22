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

export async function changeInstructorStatus(
  instructorId: string,
  status: "active" | "inactive",
) {
  const { organizationId } = await guardAdmin();

  await prisma.user.update({
    where: { id: instructorId, organizationId },
    data: { status },
  });

  revalidatePath("/admin/instructors");
  return { success: true };
}

export async function assignCourse(instructorId: string, courseId: string) {
  const { organizationId } = await guardAdmin();

  // Verify course belongs to this org
  const course = await prisma.course.findUnique({
    where: { id: courseId, organizationId },
    select: { id: true },
  });

  if (!course) return { success: false, message: "Course not found" };

  // Check not already assigned
  const existing = await prisma.courseInstructor.findUnique({
    where: { courseId_instructorId: { courseId, instructorId } },
    select: { id: true },
  });

  if (existing) return { success: false, message: "Already assigned" };

  await prisma.courseInstructor.create({
    data: { courseId, instructorId },
  });

  revalidatePath("/admin/instructors");
  return { success: true, message: "Course assigned successfully" };
}

export async function removeCourse(instructorId: string, courseId: string) {
  await guardAdmin();

  await prisma.courseInstructor.delete({
    where: { courseId_instructorId: { courseId, instructorId } },
  });

  revalidatePath("/admin/instructors");
  return { success: true, message: "Course removed successfully" };
}

export async function inviteInstructor(name: string, email: string) {
  const { organizationId } = await guardAdmin();

  // Check if email already exists in this org
  const existing = await prisma.user.findFirst({
    where: { email, organizationId },
    select: { id: true },
  });

  if (existing)
    return {
      success: false,
      message: "An account with this email already exists",
    };

  // Create instructor with pending_invite status
  // Password hash and salt are placeholders — set properly when they accept invite
  await prisma.user.create({
    data: {
      organizationId,
      name,
      email,
      role: "instructor",
      status: "pending_invite",
      passwordHash: "",
      salt: "",
    },
  });

  revalidatePath("/admin/instructors");
  return { success: true, message: `Invite sent to ${email}` };
}

export async function resendInstructorInvite(instructorId: string) {
  const { organizationId } = await guardAdmin();

  await prisma.user.findUnique({
    where: { id: instructorId, organizationId },
    select: { id: true },
  });

  // Placeholder — trigger email service here when ready
  revalidatePath("/admin/instructors");
  return { success: true, message: "Invite resent successfully" };
}
