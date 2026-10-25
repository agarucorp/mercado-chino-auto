import { ReactNode } from "react";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { WhatsAppButton } from "./WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
