import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import flyer from "@/assets/images/flyer.jpeg";
import businessCard from "@/assets/images/business-card.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const credentials = [
  "Certified Geologist with a degree in Geology",
  "Field experience spanning multiple states across Nigeria",
  "Specialised in geophysical survey methods (resistivity, seismics, magnetics)",
  "Hands-on borehole drilling, casing, and pump installation experience",
  "Proven track record in mineral resource delineation for investors",
  "Geotechnical investigation for residential and commercial construction",
  "Expert in aquifer mapping before borehole siting to minimise dry holes",
  "Strong client communication — transparent reporting at every project stage",
];

const specialisations = [
  { icon: "🌍", title: "Geophysical Surveys", desc: "Resistivity, seismic, and magnetic surveys for subsurface characterisation." },
  { icon: "💎", title: "Mineral Exploration", desc: "Delineating viable mineral deposits — gemstones, metallic and industrial ores." },
  { icon: "💧", title: "Groundwater & Boreholes", desc: "Aquifer mapping, borehole siting, drilling, casing, and pump installation." },
  { icon: "🏗️", title: "Geotechnical Investigation", desc: "Soil and foundation analysis for buildings, roads, and overhead tanks." },
  { icon: "⛏️", title: "Mining Consultancy", desc: "Technical guidance for small-to-mid-scale mining operations in Nigeria." },
  { icon: "📋", title: "Expert Consultation", desc: "One-on-one advisory for geological challenges, investments, and planning." },
];

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-28 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.span variants={fadeUp} className="font-label text-accent text-sm uppercase tracking-[0.3em]">
              About Master Key Consulting
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-heading font-black text-5xl md:text-7xl text-white mt-3 leading-tight">
              The Geologist Behind the Name
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-300 text-xl mt-6 leading-relaxed max-w-2xl">
              Expert geological services rooted in science, field experience, and a genuine commitment to client success.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founder Bio */}
      <section className="py-0 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Image */}
          <motion.div
            className="relative overflow-hidden min-h-[400px] lg:min-h-0"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={flyer}
              alt="Master Key Consulting — Field Operations"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="bg-primary/90 backdrop-blur-sm px-6 py-4 inline-block">
                <div className="font-heading font-bold text-white text-lg">Muhammad Abdulrahman Alata</div>
                <div className="font-label text-accent text-xs uppercase tracking-[0.2em] mt-1">Geologist & Founder</div>
              </div>
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div
            className="flex flex-col justify-center px-8 py-16 lg:px-16 bg-white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="font-label text-primary text-xs uppercase tracking-[0.35em] mb-3">
              Our Story
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl text-[#0A0A0A] leading-tight mb-6">
              Experience You Can Trust
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#333] leading-relaxed mb-4">
              Master Key Consulting was founded by <strong>Muhammad Abdulrahman Alata</strong>, a certified geologist based in Ilorin, Kwara State, Nigeria. With a solid academic grounding in geology and years of hands-on field work, Muhammad set out to build a firm that combines rigorous scientific methodology with straightforward, honest client service.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#555] leading-relaxed mb-4">
              The firm was born from a single conviction: that accurate subsurface data, delivered on time, saves clients money and prevents costly mistakes — whether they are drilling a borehole for a community, extracting minerals for an investor, or preparing a foundation for a commercial development.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#555] leading-relaxed mb-8">
              Today, Master Key Consulting operates across Nigeria, serving private clients, corporate investors, real estate developers, and community projects alike. Every engagement is handled personally by Muhammad, ensuring that the quality and attention to detail never waver regardless of project size.
            </motion.p>

            {/* Pull quote */}
            <motion.blockquote variants={fadeUp} className="border-l-4 border-accent pl-5 mb-8">
              <p className="text-accent italic text-lg leading-relaxed font-medium">
                "The earth holds answers. Our job is to ask the right questions and interpret the results with honesty."
              </p>
              <footer className="text-muted-foreground text-sm mt-2 font-label uppercase tracking-wider">
                — Muhammad Abdulrahman Alata
              </footer>
            </motion.blockquote>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button asChild className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none px-6">
                <Link href="/booking">Book a Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white font-bold uppercase tracking-wider px-6">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-24 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="font-label text-primary text-sm uppercase tracking-[0.3em]">
              Qualifications
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl mt-2 text-[#0A0A0A]">
              Credentials & Approach
            </motion.h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {credentials.map((c) => (
              <motion.div key={c} variants={fadeUp} className="flex items-start gap-4 bg-white p-5 border-l-4 border-primary">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-[#1A1A1A] text-sm leading-relaxed">{c}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Specialisations */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="font-label text-accent text-sm uppercase tracking-[0.3em]">
              What We Do
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl mt-2 text-white">
              Areas of Specialisation
            </motion.h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {specialisations.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -4, borderColor: "#CC0000" }}
                className="bg-[#111] border border-white/10 p-8 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-label font-bold text-sm uppercase tracking-wider text-white mb-3 group-hover:text-accent transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/services" className="text-accent font-bold uppercase tracking-wider hover:text-white flex items-center gap-2 justify-center transition-colors">
              View Full Services <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Business card + contact info */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Business card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <img
                src={businessCard}
                alt="Master Key Consulting Business Card"
                className="w-full rounded-sm shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary opacity-15" />
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-accent opacity-20" />
            </motion.div>

            {/* Contact details */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="font-label text-primary text-xs uppercase tracking-[0.35em]">
                Get in Touch
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl text-[#0A0A0A] mt-2 mb-8">
                Reach Muhammad Directly
              </motion.h2>

              <motion.div variants={stagger} className="space-y-6">
                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-1">Phone</div>
                    <a href="tel:09065314977" className="text-[#0A0A0A] font-medium hover:text-primary transition-colors">09065314977</a>
                    <span className="text-muted-foreground mx-2">/</span>
                    <a href="tel:09153448154" className="text-[#0A0A0A] font-medium hover:text-primary transition-colors">09153448154</a>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</div>
                    <a href="mailto:Muhammadabdulrahmanalata@gmail.com" className="text-[#0A0A0A] font-medium hover:text-primary transition-colors break-all">
                      Muhammadabdulrahmanalata@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-1">Address</div>
                    <p className="text-[#0A0A0A] font-medium">Alfurqan Compound, Gbagba</p>
                    <p className="text-muted-foreground text-sm">Ilorin, Kwara State, Nigeria</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
                <Button asChild className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none px-6">
                  <Link href="/booking">Book a Service</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wider px-6 transition-colors">
                  <Link href="/contact">Send a Message</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
