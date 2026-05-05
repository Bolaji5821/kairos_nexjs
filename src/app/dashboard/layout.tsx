"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[var(--background)] overflow-x-hidden">
      <AppSidebar />
      <div className="flex-1 min-w-0 w-full">
        <Header intent="talent" setIntent={() => {}} />
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}