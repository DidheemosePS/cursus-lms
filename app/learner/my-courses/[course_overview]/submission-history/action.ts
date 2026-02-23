"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { S3Delete } from "@/lib/s3/s3.delete";
import S3Upload from "@/lib/s3/s3.upload";
import { updateTag } from "next/cache";

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

  const s3UploadRes = await S3Upload(file, "submission");

  if (!s3UploadRes.success)
    return { success: false, message: s3UploadRes.error };

  const dbRes = await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      fileUrl: s3UploadRes.url,
      fileName: s3UploadRes.type,
      fileSize: s3UploadRes.size,
    },
  });

  if (!dbRes) return { success: false, message: "Failed to create submission" };

  const s3DeleteRes = await S3Delete(previousUrl);

  if (!s3DeleteRes.success)
    throw new Error(s3DeleteRes.message || "Failed to delete previous file");

  const { userId } = await getSession();

  if (!userId)
    return {
      success: true,
      message:
        "Submission updated successfully, but cache revalidation failed due to missing user ID.",
    };

  updateTag(`course-${courseId}-${userId}`);

  return {
    success: true,
    message: "Submission updated successfully",
  };
}
