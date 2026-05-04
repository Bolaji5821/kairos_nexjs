import { AppSidebar } from "@/components/Navbar/AppSidebar";
import Navbar from "@/components/Navbar/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar";
import useUser from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center flex-col justify-center h-screen">
        <img
          src="/icons/kairos-icon.svg"
          alt="kairos-logo"
          className="cursor-pointer w-24 mb-12"
        />

        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />

        <div className="p-3 md:p-6 lg:p-10 xl:p-12 space-y-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
