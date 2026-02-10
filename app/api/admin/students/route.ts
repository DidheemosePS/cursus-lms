// import { getSession } from "@/lib/auth/auth";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getSession();

//   if (!session || !session.isLoggedIn) {
//     return NextResponse.json(
//       { success: false, error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   if (session.role !== "admin") {
//     return NextResponse.json(
//       { success: false, error: "Forbidden" },
//       { status: 403 }
//     );
//   }

//   const learners = await getLearnersByOrganization(
//     "0aabdf08-49a9-4e5c-ac2d-43b3e0ef71aa"
//   );

//   return NextResponse.json({ success: true, learners });
// }
