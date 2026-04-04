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
    <ClientWrapper session={JSON.parse(JSON.stringify(session))}>
      {children}
    </ClientWrapper>
  );
}
