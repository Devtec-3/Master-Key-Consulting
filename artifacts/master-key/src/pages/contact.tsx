import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(10, "Please write a message"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Contact() {
  useSEO({
    title: "Contact Us — Ilorin, Kwara State, Nigeria",
    description: "Get in touch with Master Key Consulting. Call, WhatsApp, or email our team in Ilorin, Kwara State, Nigeria, or use the contact form and we'll respond within 24 hours.",
  });

  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  function onSubmit(_data: ContactFormData) {
    setSent(true);
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
    form.reset();
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-label text-accent text-sm uppercase tracking-[0.3em]">Reach Us</span>
            <h1 className="font-heading font-black text-5xl md:text-7xl text-white mt-2">Contact Us</h1>
            <p className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
              We are based in Ilorin but serve clients across Nigeria. Get in touch today.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info + Map */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-3xl text-[#0A0A0A] mb-8">
                Get in Touch
              </motion.h2>
              <div className="space-y-6 mb-10">
                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-1">Address</div>
                    <p className="text-[#1A1A1A]">Alfurqan Compound, Gbagba, Ilorin, Kwara State, Nigeria</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-1">Phone</div>
                    <a href="tel:09065314977" className="block text-[#1A1A1A] hover:text-primary transition-colors" data-testid="link-contact-phone-1">09065314977</a>
                    <a href="tel:09153448154" className="block text-[#1A1A1A] hover:text-primary transition-colors" data-testid="link-contact-phone-2">09153448154</a>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</div>
                    <a href="mailto:Muhammadabdulrahmanalata@gmail.com" className="text-[#1A1A1A] hover:text-primary transition-colors break-all text-sm" data-testid="link-contact-email">
                      Muhammadabdulrahmanalata@gmail.com
                    </a>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <a
                    href="https://wa.me/2349065314977"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 hover:bg-[#20b358] transition-colors font-bold uppercase tracking-wider text-sm"
                    data-testid="btn-contact-whatsapp"
                  >
                    <SiWhatsapp className="w-5 h-5" /> Chat on WhatsApp
                  </a>
                </motion.div>
              </div>

              {/* Map */}
              <motion.div variants={fadeUp} className="h-72 w-full overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62826.13756063!2d4.5180!3d8.4966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10364d7b8c44e259%3A0x6b3e4c95d0e7f3a1!2sIlorin%2C%20Kwara%20State%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Master Key Consulting Location"
                  data-testid="map-embed"
                />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading font-bold text-3xl text-[#0A0A0A] mb-8">Send a Message</h2>
              {sent ? (
                <div className="bg-[#F5F5F5] p-8 text-center border-t-4 border-primary">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
                  <Button onClick={() => setSent(false)} variant="outline" className="mt-6 rounded-none font-bold uppercase tracking-wider">
                    Send Another
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-label text-xs uppercase tracking-wider">Your Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Muhammad Abubakar" {...field} data-testid="input-contact-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-label text-xs uppercase tracking-wider">Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} data-testid="input-contact-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-label text-xs uppercase tracking-wider">Subject *</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help?" {...field} data-testid="input-contact-subject" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-label text-xs uppercase tracking-wider">Message *</FormLabel>
                          <FormControl>
                            <Textarea rows={6} placeholder="Your message..." {...field} data-testid="textarea-contact-message" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6"
                      data-testid="btn-send-message"
                    >
                      Send Message
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
