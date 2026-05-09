import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListFeaturedProjects, useListReviews, useListBlogPosts } from "@workspace/api-client-react";
import heroBg from "@/assets/images/hero-bg.png";
import blog1 from "@/assets/images/blog-1.png";
import blog2 from "@/assets/images/blog-2.png";
import flyer from "@/assets/images/flyer.jpeg";
import businessCard from "@/assets/images/business-card.jpeg";

const services = [
  { title: "Geophysical Survey", desc: "Accurate subsurface mapping using advanced geophysical methods", icon: "🌍" },
  { title: "Mineral Resources Exploration", desc: "Identifying and assessing viable mineral deposits across Nigeria", icon: "💎" },
  { title: "Industrial Minerals & Ore Mining", desc: "Extraction of gemstones, metallic and industrial minerals", icon: "⛏️" },
  { title: "Borehole Drilling & Maintenance", desc: "Professional drilling, casing, and pump installation", icon: "🔩" },
  { title: "Geotechnical Investigation", desc: "Soil and subsurface analysis for construction projects", icon: "🏗️" },
  { title: "Consultation", desc: "Expert geological guidance for your projects and investments", icon: "📋" },
];

const stats = [
  { label: "Services Offered", value: "6+" },
  { label: "Client Satisfaction", value: "100%" },
  { label: "Based In", value: "Ilorin, Nigeria" },
  { label: "Availability", value: "Always" },
];

const reasons = [
  "Certified Geologist with field experience across Nigeria",
  "Full service from survey to drilling and installation",
  "Serving clients across multiple states in Nigeria",
  "Fast response times and reliable, proven results",
  "Clear communication and no hidden fees",
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const { data: featuredProjects } = useListFeaturedProjects();
  const { data: reviews } = useListReviews();
  const { data: blogPosts } = useListBlogPosts();

  const topReviews = (reviews ?? []).slice(0, 3);
  const topBlog = (blogPosts ?? []).slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-[#0A0A0A]/75" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/30" />
        {/* Red diagonal accent */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-30"
          style={{ background: "linear-gradient(135deg, transparent 50%, #CC0000 50%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-20"
          style={{ background: "linear-gradient(315deg, transparent 50%, #8B0000 50%)" }} />

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-4"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="font-label text-accent text-sm uppercase tracking-[0.3em] border border-accent/50 px-4 py-1">
              Master Key Consulting
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-heading font-black text-5xl md:text-7xl text-white leading-tight mb-6"
          >
            Unlocking the{" "}
            <span className="text-primary">Earth's</span>{" "}
            Potential
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Geophysical surveys, mineral exploration, and borehole drilling across Nigeria. Professional. Proven. Reliable.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-black font-bold uppercase tracking-wider rounded-none px-8 py-6 text-base">
              <Link href="/booking" data-testid="btn-book-service">Book a Service</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none px-8 py-6 text-base font-bold uppercase tracking-wider">
              <Link href="/portfolio" data-testid="btn-view-work">View Our Work</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-12" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center text-white"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="font-heading font-black text-4xl md:text-5xl text-accent mb-2">{stat.value}</div>
                <div className="font-label text-xs uppercase tracking-[0.2em] text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-[#F5F5F5]" data-testid="section-services">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="font-label text-primary text-sm uppercase tracking-[0.3em]">What We Do</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl mt-2 text-[#0A0A0A]">Our Services</motion.h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            {services.map((svc) => (
              <motion.div
                key={svc.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(204,0,0,0.15)" }}
                className="bg-white p-8 border-l-4 border-transparent hover:border-primary transition-all duration-300 group"
                data-testid={`card-service-${svc.title.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`}
              >
                <div className="text-4xl mb-4">{svc.icon}</div>
                <h3 className="font-label text-lg font-bold uppercase tracking-wide text-[#0A0A0A] mb-3 group-hover:text-primary transition-colors">{svc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{svc.desc}</p>
                <Link href="/services" className="text-primary text-sm font-bold uppercase tracking-wider hover:text-accent flex items-center gap-1 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-0 bg-white overflow-hidden" id="about" data-testid="section-about">
        {/* Top: founder intro — dark panel */}
        <div className="bg-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
              {/* Left — flyer image */}
              <motion.div
                className="relative overflow-hidden min-h-[360px] lg:min-h-0"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={flyer}
                  alt="Master Key Consulting — Field Operations"
                  className="w-full h-full object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/60" />
                {/* Gold accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
              </motion.div>

              {/* Right — bio */}
              <motion.div
                className="flex flex-col justify-center px-8 py-16 lg:px-16"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.span variants={fadeUp} className="font-label text-accent text-xs uppercase tracking-[0.35em] mb-4">
                  About Master Key Consulting
                </motion.span>
                <motion.h2 variants={fadeUp} className="font-heading font-black text-4xl md:text-5xl text-white leading-tight mb-6">
                  Meet the Geologist Behind the Name
                </motion.h2>
                <motion.p variants={fadeUp} className="text-gray-300 leading-relaxed mb-4">
                  Master Key Consulting was founded by <span className="text-white font-semibold">Muhammad Abdulrahman Alata</span>, a certified geologist based in Ilorin, Kwara State. Muhammad brings hands-on field experience across multiple Nigerian states, combining scientific rigour with a practical, client-first approach to every engagement.
                </motion.p>
                <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-8">
                  From identifying aquifer zones before a single metre of borehole is drilled, to delineating mineral deposits for investors, to providing geotechnical data that saves construction projects from costly errors — the firm exists to unlock the economic value hidden beneath Nigeria's diverse geology.
                </motion.p>

                {/* Pull quote */}
                <motion.blockquote
                  variants={fadeUp}
                  className="border-l-4 border-accent pl-5 mb-8"
                >
                  <p className="text-accent italic text-lg leading-relaxed">
                    "We don't just run surveys — we give our clients the certainty they need to act."
                  </p>
                  <footer className="text-gray-500 text-sm mt-2 font-label uppercase tracking-wider">
                    — Muhammad Abdulrahman Alata, Geologist & Founder
                  </footer>
                </motion.blockquote>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <Button asChild className="bg-accent hover:bg-accent/90 text-black font-bold uppercase tracking-wider rounded-none px-6">
                    <Link href="/booking">Book a Consultation</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none px-6 font-bold uppercase tracking-wider">
                    <Link href="/portfolio">View Our Work</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom: credentials + business card — white panel */}
        <div className="bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
              {/* Credentials */}
              <motion.div
                className="py-16 pr-0 lg:pr-16 border-b lg:border-b-0 lg:border-r border-border"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.span variants={fadeUp} className="font-label text-primary text-xs uppercase tracking-[0.35em]">
                  Credentials & Approach
                </motion.span>
                <motion.h3 variants={fadeUp} className="font-heading font-bold text-3xl text-[#0A0A0A] mt-2 mb-10">
                  Experience You Can Trust
                </motion.h3>
                <motion.div variants={stagger} className="space-y-5">
                  {reasons.map((reason) => (
                    <motion.div key={reason} variants={fadeUp} className="flex items-start gap-4 group">
                      <div className="w-8 h-8 bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                        <CheckCircle2 className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <p className="text-[#1A1A1A] leading-relaxed pt-1">{reason}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Mini stats row */}
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border">
                  {[
                    { value: "6+", label: "Services" },
                    { value: "100%", label: "Satisfaction" },
                    { value: "24h", label: "Response" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-heading font-black text-3xl text-primary">{s.value}</div>
                      <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Business card */}
              <motion.div
                className="py-16 lg:pl-16 flex flex-col justify-center"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="font-label text-muted-foreground text-xs uppercase tracking-[0.35em] mb-6">Our Business Card</span>
                <div className="relative">
                  <img
                    src={businessCard}
                    alt="Master Key Consulting Business Card"
                    className="w-full rounded-sm shadow-2xl"
                  />
                  {/* Decorative corner accent */}
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-primary opacity-20" />
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-accent opacity-30" />
                </div>
                <p className="text-muted-foreground text-sm mt-8 leading-relaxed">
                  Based at <span className="text-[#0A0A0A] font-medium">Alfurqan Compound, Gbagba, Ilorin, Kwara State</span>. Serving clients across all geopolitical zones of Nigeria.
                </p>
                <div className="mt-6">
                  <Button asChild variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wider transition-colors">
                    <Link href="/contact">Get Our Contact Details</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      {(featuredProjects ?? []).length > 0 && (
        <section className="py-24 bg-[#0A0A0A]" data-testid="section-portfolio-preview">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="font-label text-accent text-sm uppercase tracking-[0.3em]">Our Work</motion.span>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl mt-2 text-white">Featured Projects</motion.h2>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              {(featuredProjects ?? []).slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group bg-[#111] border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300"
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/30 relative overflow-hidden">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-label text-white/20 text-6xl">MK</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white text-xs font-label uppercase tracking-wider px-3 py-1">
                        {project.serviceType}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-accent text-xs font-label uppercase tracking-wider mb-2">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white mb-1">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">{project.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio" className="text-accent font-bold uppercase tracking-wider hover:text-white flex items-center gap-2 justify-center transition-colors">
                View All Projects <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {topReviews.length > 0 && (
        <section className="py-24 bg-[#F5F5F5]" data-testid="section-reviews">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="font-label text-primary text-sm uppercase tracking-[0.3em]">Testimonials</motion.span>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl mt-2 text-[#0A0A0A]">What Clients Say</motion.h2>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              {topReviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={fadeUp}
                  className="bg-white p-8 border-t-4 border-primary shadow-sm"
                  data-testid={`card-review-${review.id}`}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? "fill-accent text-accent" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[#1A1A1A] leading-relaxed mb-6 italic">"{review.comment}"</p>
                  <div>
                    <div className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A]">{review.name}</div>
                    <div className="text-muted-foreground text-xs mt-1">{review.location} · {review.service}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/reviews" className="text-primary font-bold uppercase tracking-wider hover:text-accent flex items-center gap-2 justify-center transition-colors">
                See All Reviews <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-24 bg-secondary relative overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 2px, transparent 0, transparent 50%)", backgroundSize: "30px 30px" }} />
        <motion.div
          className="relative z-10 container mx-auto px-4 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl text-white mb-6">
            Ready to Start Your Project?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            We are always available. Muhammad will review your request and contact you within 24 hours.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-black font-bold uppercase tracking-wider rounded-none px-10 py-6 text-lg">
              <Link href="/booking" data-testid="btn-cta-book">Book a Consultation Now</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Blog Preview */}
      {topBlog.length > 0 && (
        <section className="py-24 bg-white" data-testid="section-blog-preview">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="font-label text-primary text-sm uppercase tracking-[0.3em]">Field Updates</motion.span>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl mt-2 text-[#0A0A0A]">Latest Insights</motion.h2>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              {topBlog.map((post, i) => (
                <motion.div
                  key={post.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="group"
                  data-testid={`card-blog-${post.id}`}
                >
                  <div className="h-52 bg-[#0A0A0A] overflow-hidden mb-4">
                    <img
                      src={post.coverImageUrl ?? (i === 0 ? blog1 : blog2)}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="flex gap-2 mb-3">
                    {(post.tags ?? []).slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-[#F5F5F5] text-primary text-xs font-label uppercase tracking-wider px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#0A0A0A] mb-2 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {new Date(post.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-primary font-bold text-sm uppercase tracking-wider hover:text-accent flex items-center gap-1 transition-colors">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/blog" className="text-primary font-bold uppercase tracking-wider hover:text-accent flex items-center gap-2 justify-center transition-colors">
                View All Updates <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
