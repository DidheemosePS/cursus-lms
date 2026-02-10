import { updateCourse } from "@/dal/admin/course.dal";
import { getSession } from "@/lib/auth/auth";
import { S3Delete } from "@/lib/s3/s3.delete";
import S3Upload from "@/lib/s3/s3.upload";
import { NextRequest, NextResponse } from "next/server";

interface FormDataEntries {
  title?: string;
  code?: string;
  description?: string;
  coverImageUrl?: string;
  previousImageUrl?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
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

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      {
        success: false,
        error: "Course Id is required",
      },
      { status: 400 },
    );
  }

  const formData = await req.formData();

  if (!formData)
    return NextResponse.json({ success: false, error: "Missing formdata" });

  const data: FormDataEntries = Object.fromEntries(formData.entries());

  // save image to s3 bucket and update the url
  const file = formData.get("coverImageUrl");

  if (file instanceof File) {
    const previousImageUrl = formData.get("previousImageUrl");

    const s3Upload = await S3Upload(file);

    if (!s3Upload.success)
      return NextResponse.json({
        success: false,
        error: s3Upload.error || "Failed to upload file",
      });

    data.coverImageUrl = s3Upload.url;

    if (
      typeof previousImageUrl === "string" &&
      previousImageUrl !== s3Upload.url
    ) {
      const s3Delete = await S3Delete(previousImageUrl);
      if (!s3Delete.success) {
        console.log(s3Delete.error);
      }
      delete data.previousImageUrl;
    }
  }

  // Database Mutation
  const res = await updateCourse(slug, session.organizationId, data);

  // Error handling
  if (!res) {
    return NextResponse.json({
      success: false,
      error: "Failed to update course",
    });
  }

  return NextResponse.json({
    success: true,
    message: "Successfully updated course",
    coverImageUrl: data.coverImageUrl && res.coverImageUrl,
  });
}
