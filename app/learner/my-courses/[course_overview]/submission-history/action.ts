"use server";
import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import { S3Delete } from "@/lib/s3/s3.delete";
import S3Upload from "@/lib/s3/s3.upload";
import { revalidatePath } from "next/cache";

export async function updateSubmission(
  file: File,
  submissionId: string,
  previousUrl: string,
  courseId: string,
) {
  if (!file) return { success: false, message: "No file found" };
  if (!submissionId)
    return { success: false, message: "Submission ID missing" };
  if (!previousUrl) return { success: false, message: "File url missing" };

  const { userId } = await getSession();
  if (!userId) return { success: false, message: "User ID is missing" };

  // Fetch existing submission to get moduleId and dueDate in one query
  const existingSubmission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      moduleId: true,
      learnerId: true,
      module: {
        select: { dueDate: true },
      },
    },
  });

  if (!existingSubmission)
    return { success: false, message: "Submission not found" };

  // Guard — learner can only update their own submission
  if (existingSubmission.learnerId !== userId)
    return { success: false, message: "Unauthorized" };

  // Get highest attempt number for this module + learner
  const lastAttempt = await prisma.submission.aggregate({
    where: { moduleId: existingSubmission.moduleId, learnerId: userId },
    _max: { attemptNumber: true },
  });

  const nextAttemptNumber = (lastAttempt._max.attemptNumber ?? 0) + 1;
  const isLate = Date.now() > existingSubmission.module.dueDate.getTime();

  // Upload new file to S3
  const s3UploadRes = await S3Upload(file, "submission");
  if (!s3UploadRes.success)
    return { success: false, message: s3UploadRes.error };

  try {
    // Create a new attempt — never overwrite the existing submission record
    await prisma.submission.create({
      data: {
        moduleId: existingSubmission.moduleId,
        learnerId: userId,
        attemptNumber: nextAttemptNumber,
        fileUrl: s3UploadRes.url,
        fileName: s3UploadRes.key,
        fileSize: s3UploadRes.size,
        isLate,
      },
    });
  } catch (error) {
    console.error("Update submission failed:", error);
    return {
      success: false,
      message: "Failed to create new submission attempt",
    };
  }

  // Delete old S3 file after successful DB write
  const s3DeleteRes = await S3Delete(previousUrl);
  if (!s3DeleteRes.success) {
    console.error("Failed to delete previous S3 file:", s3DeleteRes.message);
  }

  revalidatePath("/learner/my-courses");
  revalidatePath(`/learner/my-courses/${courseId}`);

  return { success: true, message: "Submission updated successfully" };
}
