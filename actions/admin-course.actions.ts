"use server";
import prisma from "@/lib/prisma.init";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import S3Upload from "@/lib/s3/s3.upload";

export async function createCourse(formData: FormData) {
  const { organizationId } = await getSession();
  if (!organizationId) redirect("/login");

  const title = formData.get("title") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const status = (formData.get("status") as string) || "draft";
  const coverImageFile = formData.get("coverImage") as File | null;

  if (!title?.trim()) return { success: false, message: "Title is required" };
  if (!code?.trim())
    return { success: false, message: "Course code is required" };
  if (!description?.trim())
    return { success: false, message: "Description is required" };

  // Check code is unique within org
  const existing = await prisma.course.findFirst({
    where: { organizationId, code: code.trim() },
    select: { id: true },
  });

  if (existing)
    return {
      success: false,
      message: "A course with this code already exists",
    };

  let coverImageUrl = "";

  if (coverImageFile && coverImageFile.size > 0) {
    const upload = await S3Upload(coverImageFile, "coverImage");
    if (!upload.success) return { success: false, message: upload.error };
    coverImageUrl = upload.url;
  }

  const course = await prisma.course.create({
    data: {
      organizationId,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      status: status as "draft" | "active",
      coverImageUrl,
    },
    select: { id: true },
  });

  return { success: true, courseId: course.id };
}
