import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import logoMark from "@assets/image_1778305065478.jpeg";

const resetSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function AdminResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetFormData) {
    if (!token) {
      toast({ title: "Invalid link", description: "No reset token found. Please request a new reset link.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Reset failed", description: json.error ?? "The link may have expired. Request a new one.", variant: "destructive" });
      } else {
        setDone(true);
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-md p-10 border-t-4 border-primary"
      >
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent">
            <img src={logoMark} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-heading font-bold text-xl text-[#0A0A0A]">MASTER KEY</div>
            <div className="font-label text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Panel</div>
          </div>
        </Link>

        {done ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-3">Password Updated</h2>
            <p className="text-muted-foreground text-sm mb-8">Your admin password has been changed successfully. You can now log in with your new password.</p>
            <Button
              onClick={() => setLocation("/admin/login")}
              className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-2">Set New Password</h1>
            <p className="text-muted-foreground text-sm mb-8">Choose a strong new password for the admin panel.</p>

            {!token && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">
                Invalid or missing reset token. Please request a new reset link from the login page.
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Min. 8 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Repeat new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={submitting || !token}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6"
                >
                  {submitting ? "Saving..." : "Set New Password"}
                </Button>
              </form>
            </Form>
          </>
        )}

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-primary text-sm hover:text-accent transition-colors">
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
