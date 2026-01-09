import ClientWrapper from "./client-wrapper";

export default function StudentLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <ClientWrapper>
      {children}
      {modal}
    </ClientWrapper>
  );
}
