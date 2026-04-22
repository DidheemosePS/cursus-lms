import { SignOut } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await SignOut();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Signout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
