import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, FolderOpen, MessageSquare, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } }),
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  const cards = [
    { label: "Total Bookings", value: stats?.totalBookings, icon: BookOpen, href: "/admin/bookings", color: "text-blue-600" },
    { label: "New Bookings", value: stats?.newBookings, icon: TrendingUp, href: "/admin/bookings", color: "text-primary" },
    { label: "Published Posts", value: stats?.publishedPosts, icon: MessageSquare, href: "/admin/blog", color: "text-green-600" },
    { label: "Pending Reviews", value: stats?.pendingReviews, icon: Star, href: "/admin/reviews", color: "text-accent" },
    { label: "Total Projects", value: stats?.totalProjects, icon: FolderOpen, href: "/admin/projects", color: "text-purple-600" },
    { label: "Total Reviews", value: stats?.totalReviews, icon: Star, href: "/admin/reviews", color: "text-orange-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-[#0A0A0A]">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Muhammad. Here's an overview of your site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              custom={i}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Link href={card.href} className="block bg-white border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label text-xs uppercase tracking-wider text-muted-foreground">{card.label}</span>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="font-heading font-black text-4xl text-[#0A0A0A]">{card.value ?? 0}</div>
                )}
                <div className="flex items-center gap-1 mt-4 text-primary text-xs font-label uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  View All <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading font-bold text-xl text-[#0A0A0A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "View & Manage Bookings", href: "/admin/bookings", desc: "See all booking requests and update their status" },
            { label: "Approve Reviews", href: "/admin/reviews", desc: `${stats?.pendingReviews ?? 0} review(s) pending approval` },
            { label: "Add a New Project", href: "/admin/projects", desc: "Add a new project to the portfolio" },
            { label: "Write a Blog Post", href: "/admin/blog", desc: "Share field updates and insights" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 group block"
              data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`}
            >
              <div className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A] group-hover:text-primary transition-colors mb-1">
                {action.label}
              </div>
              <p className="text-muted-foreground text-sm">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
