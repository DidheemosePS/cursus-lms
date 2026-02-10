import { searchInstructors } from "@/dal/admin/course.dal";
import { getSession } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

  const query = req.nextUrl.searchParams.get("q");
  const { slug } = await params;
  if (!slug || !query) {
    return NextResponse.json(
      {
        success: false,
        error: "Search query is required",
      },
      { status: 400 },
    );
  }

  const users = await searchInstructors(slug, query);

  return NextResponse.json({ success: true, users });
}
