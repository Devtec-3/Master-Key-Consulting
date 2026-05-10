import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAdminLogin, useAdminForgotPassword, useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import logoMark from "@assets/image_1778305065478.jpeg";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { data: me } = useGetAdminMe();
  const adminLogin = useAdminLogin();
  const forgotPassword = useAdminForgotPassword();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (me?.authenticated) setLocation("/admin");
  }, [me]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  function onSubmit(data: LoginFormData) {
    adminLogin.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
        setLocation("/admin");
      },
      onError: () => {
        toast({ title: "Invalid password", description: "Please check your credentials and try again.", variant: "destructive" });
      },
    });
  }

  function handleForgotPassword() {
    forgotPassword.mutate(undefined, {
      onSuccess: () => {
        setResetSent(true);
      },
      onError: () => {
        toast({ title: "Could not send reset email", description: "Email may not be configured. Contact support.", variant: "destructive" });
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-md p-10 border-t-4 border-primary"
        data-testid="admin-login-form"
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

        {!showForgot ? (
          <>
            <h1 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-2">Admin Login</h1>
            <p className="text-muted-foreground text-sm mb-8">Enter the admin password to continue.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="font-label text-xs uppercase tracking-wider">Password</FormLabel>
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-xs text-primary hover:text-accent transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-admin-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={adminLogin.isPending}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6"
                  data-testid="btn-admin-login"
                >
                  {adminLogin.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </>
        ) : resetSent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-3">Check Your Email</h2>
            <p className="text-muted-foreground text-sm mb-6">
              A password reset link has been sent to the admin email address. The link expires in <strong>1 hour</strong>.
            </p>
            <button
              onClick={() => { setShowForgot(false); setResetSent(false); }}
              className="text-primary text-sm hover:text-accent transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-heading font-bold text-2xl text-[#0A0A0A] mb-2">Forgot Password</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Click below and we'll send a reset link to the admin email address on file.
            </p>
            <Button
              onClick={handleForgotPassword}
              disabled={forgotPassword.isPending}
              className="w-full bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none py-6 mb-4"
            >
              {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
            <button
              onClick={() => setShowForgot(false)}
              className="w-full text-center text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              ← Back to Login
            </button>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-border text-center">
          <Link href="/" className="text-primary text-sm hover:text-accent transition-colors">
            ← Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
