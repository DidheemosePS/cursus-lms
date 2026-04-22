import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/prisma.init";
import S3Upload from "@/lib/s3/s3.upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || !session.isLoggedIn) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const formData = await req.formData();
  if (!formData)
    return NextResponse.json(
      { success: false, error: "Missing formdata" },
      { status: 400 },
    );

  const title = formData.get("title") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const status = (formData.get("status") as string) || "draft";

  if (!title?.trim())
    return NextResponse.json(
      { success: false, error: "Title is required" },
      { status: 400 },
    );
  if (!code?.trim())
    return NextResponse.json(
      { success: false, error: "Course code is required" },
      { status: 400 },
    );
  if (!description?.trim())
    return NextResponse.json(
      { success: false, error: "Description is required" },
      { status: 400 },
    );

  // Check code uniqueness within org
  const existing = await prisma.course.findFirst({
    where: {
      organizationId: session.organizationId,
      code: code.trim().toUpperCase(),
    },
    select: { id: true },
  });

  if (existing)
    return NextResponse.json(
      { success: false, error: "A course with this code already exists" },
      { status: 409 },
    );

  // Upload cover image if provided
  let coverImageUrl = "";
  const coverImageFile = formData.get("coverImage");
  if (coverImageFile instanceof File && coverImageFile.size > 0) {
    const upload = await S3Upload(coverImageFile, "coverImage");
    if (!upload.success)
      return NextResponse.json({
        success: false,
        error: upload.error || "Failed to upload image",
      });
    coverImageUrl = upload.url;
  }

  const course = await prisma.course.create({
    data: {
      organizationId: session.organizationId,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      status: status as "draft" | "active",
      coverImageUrl,
    },
    select: { id: true },
  });

  return NextResponse.json({
    success: true,
    message: "Course created successfully",
    courseId: course.id,
  });
}
