import { SiWhatsapp } from "react-icons/si";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const WHATSAPP_NUMBER = "2349065314977";

function buildMessage(path: string, search: string): { text: string; label: string } {
  const params = new URLSearchParams(search);
  const service = params.get("service");

  if (path === "/booking" && service) {
    return {
      text: `Hi Muhammad, I'd like to book a *${service}* service. Can we discuss the details?`,
      label: `Book ${service}`,
    };
  }
  if (path === "/booking") {
    return {
      text: "Hi Muhammad, I'd like to book a service with Master Key Consulting. Can we discuss?",
      label: "Book a Service",
    };
  }
  if (path === "/services") {
    return {
      text: "Hi Muhammad, I'm interested in your geophysical and engineering services. Can we talk?",
      label: "Enquire About Services",
    };
  }
  if (path === "/portfolio") {
    return {
      text: "Hi Muhammad, I came across your project portfolio and I'd like to discuss working together.",
      label: "Discuss a Project",
    };
  }
  if (path === "/reviews") {
    return {
      text: "Hi Muhammad, I read your client reviews and I'm ready to get started. Can we connect?",
      label: "Ready to Get Started",
    };
  }
  if (path === "/about") {
    return {
      text: "Hi Muhammad, I found your About page and I'd like to get in touch about your services.",
      label: "Get in Touch",
    };
  }
  if (path.startsWith("/blog")) {
    return {
      text: "Hi Muhammad, I read your blog and I'm interested in learning more about your services.",
      label: "Ask a Question",
    };
  }
  if (path === "/contact") {
    return {
      text: "Hi Muhammad, I have an enquiry for Master Key Consulting. Are you available to chat?",
      label: "Send an Enquiry",
    };
  }
  return {
    text: "Hi Muhammad, I found Master Key Consulting and I'd like to learn more about your services.",
    label: "Chat with Us",
  };
}

export function WhatsAppButton() {
  const [location] = useLocation();
  const search = useSearch();
  const [hovered, setHovered] = useState(false);

  const { text, label } = buildMessage(location, search);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white shadow-2xl hover:shadow-[0_8px_32px_rgba(37,211,102,0.45)] transition-shadow duration-300"
      style={{ borderRadius: hovered ? "40px" : "50%", transition: "border-radius 0.3s ease" }}
    >
      {/* Expanded label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, width: 0, paddingLeft: 0 }}
            animate={{ opacity: 1, width: "auto", paddingLeft: 16 }}
            exit={{ opacity: 0, width: 0, paddingLeft: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-label text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden"
          >
            💬 {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Icon bubble */}
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <SiWhatsapp className="w-7 h-7" />
        {/* Online ping dot */}
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
      </div>
    </a>
  );
}
