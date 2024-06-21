import { Header } from "@/components/dashboard/Header";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header />
      {children}
    </div>
  );
}
