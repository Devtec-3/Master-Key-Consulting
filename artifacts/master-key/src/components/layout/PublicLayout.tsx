import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "../WhatsAppButton";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 w-full pt-[80px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
