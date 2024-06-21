import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </div>
  );
}
