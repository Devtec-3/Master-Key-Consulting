import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/PublicLayout";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import Reviews from "@/pages/reviews";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import Booking from "@/pages/booking";
import Contact from "@/pages/contact";

import About from "@/pages/about";
import { AdminLayout } from "@/components/layout/AdminLayout";
import AdminLogin from "@/pages/admin/login";
import AdminResetPassword from "@/pages/admin/reset-password";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBookings from "@/pages/admin/bookings";
import AdminProjects from "@/pages/admin/projects";
import AdminBlog from "@/pages/admin/blog";
import AdminReviews from "@/pages/admin/reviews";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      <Route path="/admin/reset-password">
        <AdminResetPassword />
      </Route>
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/bookings">
        <AdminLayout><AdminBookings /></AdminLayout>
      </Route>
      <Route path="/admin/projects">
        <AdminLayout><AdminProjects /></AdminLayout>
      </Route>
      <Route path="/admin/blog">
        <AdminLayout><AdminBlog /></AdminLayout>
      </Route>
      <Route path="/admin/reviews">
        <AdminLayout><AdminReviews /></AdminLayout>
      </Route>
      
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout><About /></PublicLayout>
      </Route>
      <Route path="/services">
        <PublicLayout><Services /></PublicLayout>
      </Route>
      <Route path="/portfolio">
        <PublicLayout><Portfolio /></PublicLayout>
      </Route>
      <Route path="/reviews">
        <PublicLayout><Reviews /></PublicLayout>
      </Route>
      <Route path="/blog">
        <PublicLayout><Blog /></PublicLayout>
      </Route>
      <Route path="/blog/:slug">
        <PublicLayout><BlogDetail /></PublicLayout>
      </Route>
      <Route path="/booking">
        <PublicLayout><Booking /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><Contact /></PublicLayout>
      </Route>
      
      <Route>
        <PublicLayout><NotFound /></PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
