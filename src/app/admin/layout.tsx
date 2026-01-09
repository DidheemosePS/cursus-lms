import ClientWrapper from "./client-wrapper";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
