import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

const services = [
  {
    id: "geophysical-survey",
    title: "Geophysical Survey",
    icon: "🌍",
    desc: "Our geophysical survey services use state-of-the-art equipment and proven methodologies to map subsurface conditions with exceptional accuracy. We employ electrical resistivity tomography, seismic refraction, and magnetic surveys tailored to your specific project requirements.",
    includes: [
      "Electrical Resistivity Tomography (ERT)",
      "Seismic refraction and reflection surveys",
      "Ground Penetrating Radar (GPR)",
      "Magnetic and gravity surveys",
      "Comprehensive data interpretation and reporting",
      "Site-specific recommendations",
    ],
  },
  {
    id: "mineral-resources-exploration",
    title: "Mineral Resources Exploration",
    icon: "💎",
    desc: "We provide comprehensive mineral exploration services from preliminary reconnaissance to detailed resource estimation. Our approach combines geological mapping, geochemical sampling, and geophysical surveys to identify and delineate mineral deposits.",
    includes: [
      "Geological mapping and structural analysis",
      "Geochemical soil and rock sampling",
      "Airborne and ground geophysical surveys",
      "Resource estimation and reserve calculation",
      "Feasibility study support",
      "Regulatory compliance assistance",
    ],
  },
  {
    id: "mining-industrial-minerals",
    title: "Mining of Industrial Minerals, Gemstones & Metallic Ores",
    icon: "⛏️",
    desc: "From gemstones to industrial minerals, we provide expert guidance and operational support for the extraction of Nigeria's diverse mineral wealth. Our team combines geological expertise with practical mining knowledge.",
    includes: [
      "Deposit assessment and characterization",
      "Mining method selection and planning",
      "Grade control and quality assurance",
      "Environmental impact assessment support",
      "Extraction supervision and quality control",
      "Market linkage and offtake advisory",
    ],
  },
  {
    id: "borehole-drilling",
    title: "Borehole Drilling, Installation & Maintenance",
    icon: "🔩",
    desc: "Our borehole drilling services combine geophysical site investigation with professional drilling operations to ensure your borehole is sited correctly, drilled efficiently, and equipped for long-term reliable water production.",
    includes: [
      "Geophysical site investigation and siting",
      "Rotary and percussion drilling to any required depth",
      "Steel and PVC casing supply and installation",
      "Submersible pump supply and installation",
      "Water quality testing and treatment",
      "Ongoing maintenance and rehabilitation services",
    ],
  },
  {
    id: "geotechnical-investigation",
    title: "Geotechnical Investigation & Overhead Tank Erection",
    icon: "🏗️",
    desc: "Safe, compliant construction requires a thorough understanding of subsurface conditions. Our geotechnical investigations provide the data engineers need for foundation design, slope stability analysis, and construction project risk assessment.",
    includes: [
      "Borehole and test pit investigations",
      "Standard Penetration Testing (SPT)",
      "Laboratory soil testing and analysis",
      "Foundation bearing capacity determination",
      "Slope stability and settlement analysis",
      "Overhead tank foundation design and erection supervision",
    ],
  },
  {
    id: "consultation",
    title: "Consultation",
    icon: "📋",
    desc: "Our consultation services provide expert geological and engineering guidance at every stage of your project — from initial concept to final execution. Whether you need a second opinion, a feasibility review, or ongoing technical support, we are here.",
    includes: [
      "Project feasibility assessment",
      "Investment and exploration risk review",
      "Regulatory and permitting guidance",
      "Technical report review and audit",
      "Expert witness services",
      "Ongoing project technical support",
    ],
  },
];

const faqs = [
  { q: "How long does a geophysical survey take?", a: "The duration depends on the area and complexity of the survey. A typical residential borehole siting survey takes 1–2 days. Larger mineral exploration surveys may take several weeks. We provide a detailed timeline during project scoping." },
  { q: "What is the minimum depth for a borehole in Ilorin?", a: "In the Ilorin metropolitan area, productive aquifers are typically encountered at 45–80 metres depth. In the broader Kwara State basement complex, depths can range from 45 to 120 metres depending on location. Our pre-drilling survey identifies the optimal depth before any drilling commences." },
  { q: "Do you work outside Kwara State?", a: "Yes, we serve clients across Nigeria. We have completed projects in Kano, Abuja (FCT), Lagos, Oyo, Enugu, Rivers State, and elsewhere. Travel costs are factored into project quotes for work outside our base in Ilorin." },
  { q: "What makes Master Key Consulting different from other geophysical firms?", a: "We combine rigorous scientific methodology with practical field experience and a commitment to communication. Our founder, Muhammad Abdulrahman Alata, is a certified geologist who is personally involved in every project. We do not delegate client communication or technical oversight." },
  { q: "How do I know if my site needs a geotechnical investigation?", a: "Any construction project involving a multi-storey building, a large foundation footprint, or sites with unknown ground conditions should have a geotechnical investigation. It is also required by most structural engineers and building regulators before foundation design." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Services() {
  useSEO({
    title: "Our Services — Geophysical Surveys, Borehole Drilling & More",
    description: "Master Key Consulting offers six core services: geophysical surveys, mineral resources exploration, mining of industrial minerals, borehole drilling, geotechnical investigations, and professional consultation.",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span variants={fadeUp} className="font-label text-accent text-sm uppercase tracking-[0.3em]">What We Offer</motion.span>
            <motion.h1 variants={fadeUp} className="font-heading font-black text-5xl md:text-7xl text-white mt-2">Our Services</motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
              Professional geophysical and engineering services delivered with precision and integrity.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white" data-testid="section-services-detail">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((svc, i) => (
              <motion.div
                key={svc.id}
                id={svc.id}
                className="border border-border p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                data-testid={`card-service-detail-${svc.id}`}
              >
                <div className="text-5xl mb-4">{svc.icon}</div>
                <h2 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-4 group-hover:text-primary transition-colors">
                  {svc.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{svc.desc}</p>
                <div className="mb-8">
                  <h4 className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-4">What's Included</h4>
                  <ul className="space-y-2">
                    {svc.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none">
                  <Link href={`/booking?service=${encodeURIComponent(svc.title)}`} data-testid={`btn-book-${svc.id}`}>
                    Book This Service <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#F5F5F5]" data-testid="section-faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="font-label text-primary text-sm uppercase tracking-[0.3em]">Common Questions</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl mt-2 text-[#0A0A0A]">Frequently Asked Questions</motion.h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-border overflow-hidden"
                data-testid={`faq-${i}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F5F5F5] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-heading font-bold text-lg text-[#0A0A0A] pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-primary shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
