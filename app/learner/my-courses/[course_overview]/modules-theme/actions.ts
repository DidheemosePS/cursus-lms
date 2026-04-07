"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import S3Upload from "@/lib/s3/s3.upload";
import { revalidatePath } from "next/cache";

export async function handleSubmission(
  file: File,
  courseId: string,
  moduleId: string,
) {
  if (!file) return { success: false, message: "No file found" };

  const s3UploadRes = await S3Upload(file, "submission");
  if (!s3UploadRes.success)
    return { success: false, message: s3UploadRes.error };

  const { userId } = await getSession();
  if (!userId) return { success: false, message: "User ID is missing" };

  const [moduleDeadline, lastAttempt, totalModules, totalModulesCompleted] =
    await prisma.$transaction([
      prisma.module.findUnique({
        where: { id: moduleId, courseId },
        select: { dueDate: true },
      }),
      prisma.submission.aggregate({
        where: { moduleId, learnerId: userId },
        _max: { attemptNumber: true },
      }),
      prisma.module.count({ where: { courseId } }),
      prisma.module.count({
        where: {
          courseId,
          submissions: { some: { learnerId: userId } },
        },
      }),
    ]);

  if (!moduleDeadline) return { success: false, message: "Module not found" };

  const isLate = Date.now() > moduleDeadline.dueDate.getTime();
  const attemptNumber = (lastAttempt._max.attemptNumber ?? 0) + 1;
  const isFirstAttempt = attemptNumber === 1;

  // updatedCompleted accounts for this new submission
  const updatedCompleted = totalModulesCompleted + (isFirstAttempt ? 1 : 0);

  // Set to completed only when all modules have at least one submission
  const progressStatus =
    updatedCompleted >= totalModules ? "completed" : "in_progress";

  try {
    await prisma.$transaction(async (tx) => {
      await tx.submission.create({
        data: {
          moduleId,
          learnerId: userId,
          attemptNumber,
          fileUrl: s3UploadRes.url,
          fileName: s3UploadRes.key,
          fileSize: s3UploadRes.size,
          isLate,
        },
      });

      await tx.enrollment.update({
        where: {
          courseId_learnerId: { courseId, learnerId: userId },
        },
        data: {
          progressStatus,
          completedModules: updatedCompleted,
          lastProgressAt: new Date(),
        },
      });
    });
  } catch (error) {
    console.error("Submission DB transaction failed:", error);
    return { success: false, message: "Submission failed. Please try again" };
  }

  // Revalidate both pages so card updates immediately
  revalidatePath("/learner/my-courses");
  revalidatePath(`/learner/my-courses/${courseId}`);

  return { success: true, message: "New submission created successfully." };
}
