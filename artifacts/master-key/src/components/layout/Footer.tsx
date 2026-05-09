import { Link } from "wouter";
import { Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import logoMark from "@assets/image_1778305065478.jpeg";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-8 border-t-[8px] border-primary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent">
                <img src={logoMark} alt="Master Key Consulting Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl tracking-tight text-white">
                  MASTER KEY
                </span>
                <span className="font-label text-xs uppercase tracking-[0.2em] text-accent">
                  Consulting
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional geophysical and engineering services firm based in Ilorin, Nigeria. We find what's underground and make it profitable.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-6 text-white border-b border-white/10 pb-2">Our Services</h3>
            <ul className="space-y-3">
              {[
                "Geophysical Survey",
                "Mineral Resources Exploration",
                "Mining & Extraction",
                "Borehole Drilling",
                "Geotechnical Investigation",
                "Geological Consultation"
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-muted-foreground hover:text-accent flex items-center gap-2 text-sm transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-6 text-white border-b border-white/10 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/#about" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Client Reviews", href: "/reviews" },
                { label: "Our Blog", href: "/blog" },
                { label: "Book a Service", href: "/booking" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-accent flex items-center gap-2 text-sm transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-6 text-white border-b border-white/10 pb-2">Contact Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Alfurqan Compound, Gbagba, Ilorin, Kwara State, Nigeria</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span>0906 531 4977</span>
                  <span>0915 344 8154</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>Muhammadabdulrahmanalata@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Master Key Consulting. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
