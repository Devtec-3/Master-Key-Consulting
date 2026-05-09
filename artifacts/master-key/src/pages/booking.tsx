import { useState } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Phone, Mail, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useCreateBooking } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SERVICES = [
  "Geophysical Survey",
  "Mineral Resources Exploration",
  "Mining of Industrial Minerals, Gemstones & Metallic Ores",
  "Borehole Drilling, Installation & Maintenance",
  "Geotechnical Investigation & Overhead Tank Erection",
  "Consultation",
];

const HOW_HEARD = [
  "Google Search",
  "Social Media",
  "Referral from a friend",
  "Previous client",
  "WhatsApp",
  "Other",
];

const bookingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(3, "Please enter the project location"),
  serviceType: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Please enter your preferred start date"),
  message: z.string().min(20, "Please provide at least 20 characters describing your project"),
  howHeard: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Booking() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const preselectedService = params.get("service") ?? "";

  const createBooking = useCreateBooking();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      serviceType: preselectedService,
      preferredDate: "",
      message: "",
      howHeard: "",
    },
  });

  function onSubmit(data: BookingFormData) {
    createBooking.mutate({ data: { ...data, howHeard: data.howHeard ?? undefined } }, {
      onSuccess: () => {
        setSubmitted(true);
        toast({ title: "Booking submitted!", description: "We'll contact you within 24 hours." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Something went wrong", description: "Please try again or contact us directly.", variant: "destructive" });
      },
    });
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-label text-accent text-sm uppercase tracking-[0.3em]">Start Your Project</span>
            <h1 className="font-heading font-black text-5xl md:text-7xl text-white mt-2">Book a Service</h1>
            <p className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
              Tell us about your project and Muhammad will be in touch within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 border-t-4 border-primary text-center"
                  data-testid="booking-success"
                >
                  <div className="text-6xl mb-6">✓</div>
                  <h2 className="font-heading font-bold text-3xl text-[#0A0A0A] mb-4">Booking Submitted!</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Thank you for reaching out. Muhammad will review your request and contact you within 24 hours to discuss the details and pricing.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none px-8"
                  >
                    Submit Another Request
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 md:p-12"
                >
                  <h2 className="font-heading font-bold text-3xl text-[#0A0A0A] mb-8">Project Details</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-label text-xs uppercase tracking-wider">Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Muhammad Abubakar" {...field} data-testid="input-full-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-label text-xs uppercase tracking-wider">Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="09065314977" {...field} data-testid="input-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-label text-xs uppercase tracking-wider">Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-label text-xs uppercase tracking-wider">Project Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Where will the work be done? e.g. Ilorin, Kwara State" {...field} data-testid="input-location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-label text-xs uppercase tracking-wider">Service Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-service-type">
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SERVICES.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="preferredDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-label text-xs uppercase tracking-wider">Preferred Start Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-preferred-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-label text-xs uppercase tracking-wider">Description of Work *</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Tell us about your project — what are you trying to achieve? What is the site like? Any previous surveys or investigations done?"
                                {...field}
                                data-testid="textarea-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="howHeard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-label text-xs uppercase tracking-wider">How Did You Hear About Us?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-how-heard">
                                  <SelectValue placeholder="Optional" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {HOW_HEARD.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={createBooking.isPending}
                        className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6 text-base"
                        data-testid="btn-submit-booking"
                      >
                        {createBooking.isPending ? "Submitting..." : "Submit Booking Request"}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={fadeUp.hidden}
                whileInView={fadeUp.show}
                viewport={{ once: true }}
                className="bg-primary text-white p-8"
              >
                <Clock className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-heading font-bold text-xl mb-3">What Happens Next?</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  After submitting, Muhammad will review your request and contact you within 24 hours to discuss the project details and provide a quotation.
                </p>
              </motion.div>

              <motion.div
                initial={fadeUp.hidden}
                whileInView={fadeUp.show}
                viewport={{ once: true }}
                className="bg-white border-l-4 border-accent p-8 space-y-5"
              >
                <h3 className="font-heading font-bold text-xl text-[#0A0A0A]">Contact Directly</h3>
                <a href="tel:09065314977" className="flex items-center gap-3 text-[#1A1A1A] hover:text-primary transition-colors" data-testid="link-phone-1">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">09065314977</span>
                </a>
                <a href="tel:09153448154" className="flex items-center gap-3 text-[#1A1A1A] hover:text-primary transition-colors" data-testid="link-phone-2">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">09153448154</span>
                </a>
                <a
                  href="https://wa.me/2349065314977"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 hover:bg-[#20b358] transition-colors w-full"
                  data-testid="btn-whatsapp-contact"
                >
                  <SiWhatsapp className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Chat on WhatsApp</span>
                </a>
                <a href="mailto:Muhammadabdulrahmanalata@gmail.com" className="flex items-center gap-3 text-[#1A1A1A] hover:text-primary transition-colors" data-testid="link-email">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-xs break-all">Muhammadabdulrahmanalata@gmail.com</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
