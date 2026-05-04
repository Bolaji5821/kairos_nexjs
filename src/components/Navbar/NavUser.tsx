"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar";
import useProfileCompletion from "@/hooks/useProfileCompletion";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Progress } from "../ui/Progress";

export function NavUser({
  firstName,
  lastName,
  email,
  avatar,
}: {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { percentage } = useProfileCompletion();

  const handleLogout = async () => {
    localStorage.removeItem("kairos_acccess_token");
    queryClient.clear();
    navigate("/auth/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {percentage < 100 && (
          <div className="flex flex-col gap-6 p-4 bg-custom-blue-800 rounded-lg mb-3">
            <div>
              <p className="text-sm font-medium">Complete Account Setup</p>
              <p className="text-sm">
                {percentage === 100 ? "Setup complete!" : "Almost done!"}
              </p>
            </div>

            <Progress value={percentage} className="w-full" />

            <Link to="/settings" className="text-sm">
              {percentage === 100 ? "View profile" : "Get started"}
            </Link>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={firstName} />
                <AvatarFallback className="rounded-lg">
                  {`${firstName[0]}${lastName[0]}`}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{firstName}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
