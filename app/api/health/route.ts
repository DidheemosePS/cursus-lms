import { NextResponse } from "next/server";

export async function GET() {
  // Returning a 200 OK status lets Docker know the app is alive and well
  return NextResponse.json({ status: "healthy" }, { status: 200 });
}
