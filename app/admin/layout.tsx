import { getSession, SessionData } from "@/lib/auth/auth";
import ClientWrapper from "./client-wrapper";
import { redirect } from "next/navigation";

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
  model: React.ReactNode;
}) {
  // Auth Check
  const session: SessionData = await getSession();
  if (!session || !session.isLoggedIn || session.role !== "admin") {
    redirect("/login");
  }
  return (
    <ClientWrapper session={JSON.parse(JSON.stringify(session))}>
      {children}
    </ClientWrapper>
  );
}
