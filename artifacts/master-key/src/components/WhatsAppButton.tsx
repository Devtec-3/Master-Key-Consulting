import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2349065314977"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp className="w-8 h-8" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
}
