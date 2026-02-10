import { getSession } from "@/lib/auth/auth";
import ClientWrapper from "./client-wrapper";
import { redirect } from "next/navigation";

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || !session.isLoggedIn || session.role !== "learner") {
    redirect("/login");
  }
  return (
    <ClientWrapper
      session={{
        userId: session.userId,
        organizationId: session.organizationId,
        name: session.name,
        email: session.email,
        role: session.role,
        isLoggedIn: session.isLoggedIn,
      }}
    >
      {children}
    </ClientWrapper>
  );
}
