import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useListReviews, useCreateReview, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSEO } from "@/hooks/useSEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SERVICES = [
  "Geophysical Survey",
  "Mineral Resources Exploration",
  "Mining of Industrial Minerals, Gemstones & Metallic Ores",
  "Borehole Drilling, Installation & Maintenance",
  "Geotechnical Investigation & Overhead Tank Erection",
  "Consultation",
];

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(3, "Please enter your city and state"),
  service: z.string().min(1, "Please select a service"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(20, "Please write at least 20 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Reviews() {
  useSEO({
    title: "Client Reviews & Testimonials",
    description: "Read what clients across Nigeria say about Master Key Consulting's geophysical surveys, borehole drilling, and engineering services — and leave your own review.",
  });

  const { data: reviews, isLoading } = useListReviews();
  const createReview = useCreateReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const avgRating = reviews && reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { name: "", location: "", service: "", rating: 5, comment: "" },
  });

  const [hoverRating, setHoverRating] = useState<number>(0);
  const selectedRating = form.watch("rating");

  function onSubmit(data: ReviewFormData) {
    createReview.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        toast({ title: "Thank you for your review!", description: "Your review is pending approval and will appear shortly." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
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
            <span className="font-label text-accent text-sm uppercase tracking-[0.3em]">Client Feedback</span>
            <h1 className="font-heading font-black text-5xl md:text-7xl text-white mt-2">Client Reviews</h1>
          </motion.div>
        </div>
      </section>

      {/* Average Rating */}
      {!isLoading && (reviews ?? []).length > 0 && (
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="font-heading font-black text-6xl mb-2">{avgRating}</div>
            <div className="flex gap-1 justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-8 h-8 ${i < Math.round(avgRating) ? "fill-accent text-accent" : "text-white/30"}`} />
              ))}
            </div>
            <div className="font-label uppercase tracking-wider text-white/80 text-sm">
              Average Rating from {reviews?.length} verified clients
            </div>
          </div>
        </section>
      )}

      {/* Reviews Grid */}
      <section className="py-24 bg-[#F5F5F5]" data-testid="section-reviews-list">
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-heading font-bold text-3xl text-[#0A0A0A] mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52" />)}
            </div>
          ) : (reviews ?? []).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No reviews yet. Be the first to leave one below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(reviews ?? []).map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={fadeUp.hidden}
                  whileInView={fadeUp.show}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-8 border-t-4 border-primary shadow-sm"
                  data-testid={`review-card-${review.id}`}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-5 h-5 ${j < review.rating ? "fill-accent text-accent" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-[#1A1A1A] leading-relaxed mb-6 italic text-sm">"{review.comment}"</p>
                  <div className="border-t border-border pt-4">
                    <div className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A]">{review.name}</div>
                    <div className="text-muted-foreground text-xs mt-1">{review.location}</div>
                    <div className="text-primary text-xs mt-1 font-label">{review.service}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Form */}
      <section className="py-24 bg-white" data-testid="section-review-form">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span variants={fadeUp} className="font-label text-primary text-sm uppercase tracking-[0.3em]">Share Your Experience</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-4xl mt-2 mb-10 text-[#0A0A0A]">
              Leave a Review
            </motion.h2>
          </motion.div>
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
                        <Input placeholder="Muhammad Abubakar" {...field} data-testid="input-reviewer-name" />
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
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Your Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kano, Kano State" {...field} data-testid="input-reviewer-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-label text-xs uppercase tracking-wider">Service Used *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-review-service">
                          <SelectValue placeholder="Select the service you used" />
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-label text-xs uppercase tracking-wider">Your Rating *</FormLabel>
                    <div className="flex gap-2 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseEnter={() => setHoverRating(i + 1)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => field.onChange(i + 1)}
                          data-testid={`star-${i + 1}`}
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              (hoverRating || selectedRating) > i
                                ? "fill-accent text-accent"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-label text-xs uppercase tracking-wider">Your Review *</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Tell us about your experience working with Master Key Consulting..."
                        {...field}
                        data-testid="textarea-review-comment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createReview.isPending}
                className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6"
                data-testid="btn-submit-review"
              >
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
