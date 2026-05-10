import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import logoMark from "@assets/image_1778305065478.jpeg";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/reviews", label: "Reviews" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="hidden lg:flex bg-primary/90 text-white text-sm py-1 px-8 justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-accent" />
            <span>09065314977 / 09153448154</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent" />
            <span>Muhammadabdulrahmanalata@gmail.com</span>
          </div>
        </div>
        <div className="text-accent font-medium uppercase tracking-wider text-xs">
          Professional Geophysical & Engineering Services
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-accent">
              <img src={logoMark} alt="Master Key Consulting Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl md:text-2xl tracking-tight text-white group-hover:text-accent transition-colors">
                MASTER KEY
              </span>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-gray-400">
                Consulting
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-accent ${
                  location === link.href ? "text-accent" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-accent hover:bg-accent/90 text-black font-bold uppercase tracking-wider rounded-none">
              <Link href="/booking">Book Now</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white hover:text-accent"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 shadow-2xl">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`p-4 text-center font-medium uppercase tracking-wider border-b border-white/5 ${
                  location === link.href ? "text-accent" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="p-4">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-black font-bold uppercase tracking-wider rounded-none">
                <Link href="/booking" onClick={() => setIsOpen(false)}>Book Now</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
