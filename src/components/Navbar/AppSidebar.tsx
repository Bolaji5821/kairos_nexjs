import { NavMain } from "@/components/Navbar/NavMain";
import { NavUser } from "@/components/Navbar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/Sidebar";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import { Briefcase, Home, Medal, Setting2 } from "iconsax-react";
import * as React from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

export const NavMainData = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "Jobs",
    url: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Competitions",
    url: "/competitions",
    icon: Medal,
  },
  {
    name: "Settings",
    url: "/settings",
    icon: Setting2,
  },
  {
    name: "Verify",
    url: "/verify",
    icon: Setting2,
    hide: true, // This is hidden in the sidebar, but can be accessed via the navbar
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const isCompany = user?.data?.role === USER_ROLES.Company;

  return (
    <Sidebar variant="inset" {...props}>
      <div className="flex h-10 shrink-0 items-center justify-end gap-2 md:hidden">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" close />
        </div>
      </div>

      <Link to={"/"} className=" ml-4 my-5">
        <img
          src={"/icons/kairos-logo-white.png"}
          alt="kairos-logo"
          className="cursor-pointer w-28 h-11 "
        />
      </Link>

      {isCompany && (
        <div className="mb-10 py-3 flex items-center gap-3 pl-4 pr-4 bg-custom-blue-700 rounded-3xl mx-2">
          {user.data.profile.profilePicture && (
            <div className=" relative">
              <Avatar>
                <AvatarImage
                  src={
                    user.data.profile.profilePicture ??
                    "https://kairos-nexus.s3.us-east-2.amazonaws.com/public-default/generic-avatar.png"
                  }
                  alt={`${user.data.profile.companyName} logo`}
                />
                <AvatarFallback>
                  {user.data.profile.companyName?.[0] ?? ""}
                </AvatarFallback>
              </Avatar>
              {user.data.isKycDone && (
                <img
                  src="/icons/verified-tick.svg"
                  alt="Verified"
                  className="absolute -bottom-0 -right-0 z-30 w-3 h-3"
                />
              )}
            </div>
          )}

          {!user.data.profile.profilePicture && (
            <div className="flex items-center justify-center bg-accent rounded-full w-8 h-8">
              <Avatar>
                <AvatarImage
                  src={
                    user.data.profile.profilePicture ??
                    "https://kairos-nexus.s3.us-east-2.amazonaws.com/public-default/generic-avatar.png"
                  }
                  alt={`${user.data.profile.companyName} logo`}
                />
                <AvatarFallback>
                  {user.data.profile.companyName?.[0] ?? ""}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <div>{user.data.profile.companyName}</div>
        </div>
      )}

      <SidebarContent>
        <NavMain items={NavMainData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          firstName={user?.data?.profile.firstName ?? ""}
          lastName={user?.data?.profile.lastName ?? ""}
          email={user?.data?.email ?? ""}
          avatar={
            user?.data.profile.profilePicture ??
            "https://kairos-nexus.s3.us-east-2.amazonaws.com/public-default/generic-avatar.png"
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
