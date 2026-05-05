"use client";

import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn(
      "w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-full flex flex-col",
      className
    )}>
      {children}
    </aside>
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto py-4", className)}>
      {children}
    </div>
  );
}

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("p-4 border-t border-zinc-200 dark:border-zinc-800", className)}>
      {children}
    </div>
  );
}

interface SidebarItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarItem({ children, active, onClick, className }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
        active 
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
        className
      )}
    >
      {children}
    </button>
  );
}
