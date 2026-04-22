"use server";

import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export async function submitFeedback(submissionId: string, content: string) {
  const { userId } = await getSession();
  if (!userId) return { error: "Unauthorized" };
  if (!content.trim()) return { error: "Feedback cannot be empty" };

  await prisma.$transaction(async (tx) => {
    // Create feedback
    await tx.feedback.create({
      data: {
        submissionId,
        instructorId: userId,
        content: content.trim(),
      },
    });

    // Mark submission as reviewed
    await tx.submission.update({
      where: { id: submissionId },
      data: { status: "reviewed" },
    });
  });

  revalidatePath(`/instructor/submissions/${submissionId}`);
  return { success: true };
}

export async function updateFeedback(feedbackId: string, content: string) {
  const { userId } = await getSession();
  if (!userId) return { error: "Unauthorized" };
  if (!content.trim()) return { error: "Feedback cannot be empty" };

  await prisma.feedback.update({
    where: { id: feedbackId, instructorId: userId },
    data: { content: content.trim() },
  });

  revalidatePath(`/instructor/submissions`);
  return { success: true };
}
