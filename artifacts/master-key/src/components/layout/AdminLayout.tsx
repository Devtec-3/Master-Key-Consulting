import { Link, useLocation } from "wouter";
import { useGetAdminMe, useAdminLogout, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { LayoutDashboard, BookOpen, FolderOpen, MessageSquare, Star, LogOut, ExternalLink } from "lucide-react";
import logoMark from "@assets/image_1778305065478.jpeg";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog Posts", icon: MessageSquare },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();
  const adminLogout = useAdminLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !me?.authenticated) {
      setLocation("/admin/login");
    }
  }, [me, isLoading]);

  function handleLogout() {
    adminLogout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
        setLocation("/admin/login");
      },
    });
  }

  if (isLoading || !me?.authenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-accent">
              <img src={logoMark} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-white">MASTER KEY</div>
              <div className="font-label text-xs text-accent uppercase tracking-wider">Admin Panel</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`nav-admin-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white transition-colors w-full"
            data-testid="btn-admin-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
