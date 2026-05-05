"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Medal, Settings, LogOut, User, Menu, X } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarItem } from "@/components/ui/sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { UserRole } from "@/lib/api";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "My Jobs", href: "/dashboard/talent-jobs", icon: Briefcase, roles: ["STUDENT"] },
  { name: "Competitions", href: "/dashboard/competitions", icon: Medal, roles: ["STUDENT"] },
  { name: "Talents", href: "/dashboard/talents", icon: User, roles: ["COMPANY", "ADMIN", "SUPERADMIN"] },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user) return null;

  const isCompany = user.role === "COMPANY" || user.role === "ADMIN" || user.role === "SUPERADMIN";
  const isTalent = user.role === "STUDENT";

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  const userInitials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Kairos Logo" 
            className="w-10 h-10 object-contain" 
          />
          <span className="text-xl font-bold text-zinc-900 dark:text-white">Kairos</span>
        </Link>
      </div>

      <SidebarContent className="flex-1">
        <div className="space-y-1 px-3 py-4">
          {filteredNavItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <SidebarItem active={pathname === item.href}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </SidebarItem>
            </Link>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C2185B] flex items-center justify-center text-white font-bold flex-shrink-0">
              {userInitials || "U"}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </SidebarFooter>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-lg"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {sidebarContent}
      </div>
    </>
  );
}