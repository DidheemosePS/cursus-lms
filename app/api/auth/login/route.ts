import { getSession, signin } from "@/lib/auth/auth";
import { signInSchema } from "@/lib/validation/signin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error)?.fieldErrors;
      return NextResponse.json(
        { success: false, error: fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const result = await signin(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid credentials" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = result.user.id;
    session.name = result.user.name;
    session.email = result.user.email;
    session.role = result.user.role;
    session.organizationId = result.user.organizationId;
    session.isLoggedIn = true;

    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.log("Signin error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
