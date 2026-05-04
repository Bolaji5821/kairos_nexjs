import useUser from "@/hooks/useUser";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { SidebarTrigger } from "../ui/Sidebar";
import { NavMainData } from "./AppSidebar";

export default function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  const pageTitle =
    NavMainData.find((d) => {
      // Handle exact match for home page
      if (d.url === "/" && location.pathname === "/") {
        return true;
      }
      // Handle other pages - check if pathname starts with the nav url
      if (d.url !== "/" && location.pathname.startsWith(d.url)) {
        return true;
      }
      return false;
    })?.name ?? "";

  return (
    <nav className="w-full">
      <div className="mx-auto max-w-7xl ">
        <div className="px-3 md:px-6 lg:px-10 xl:px-12 2xl:px-0 pt-3 md:pt-6">
          <div className="flex items-center justify-between md:hidden">
            <Link to={"/"} className="my-2">
              <img
                src={"/icons/kairos-logo-black.png"}
                alt="kairos-logo"
                className="cursor-pointer w-28 h-11 "
              />
            </Link>

            <Avatar>
              <AvatarImage
                src={user?.data.profile.profilePicture ?? ""}
                alt={`${user?.data.profile.companyName} logo`}
              />
              <AvatarFallback>
                {user?.data.profile.companyName?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 shrink-0 items-center gap-2 md:hidden">
                <div className="flex items-center">
                  <SidebarTrigger />
                </div>
              </div>

              <h1 className="font-semibold text-xl">{pageTitle}</h1>
            </div>

            {user?.data.isKycDone ? (
              <div className=" bg-[#E1FFE6] rounded-lg px-3.5 py-1.5 text-sm font-medium text-[#178002] flex items-center gap-1">
                <img src="/icons/verified-tick.svg" alt="" />
                Verified
              </div>
            ) : (
              <Link to="/verify">
                <div className=" bg-custom-blue-50 rounded-lg px-3.5 py-1.5 text-sm font-medium text-custom-blue-500 flex items-center gap-1 cursor-pointer">
                  <img src="/icons/unverified-tick.svg" alt="" />
                  Get Verified
                  <ChevronRight className="h-3 w-3 text-custom-blue-500" />
                </div>
              </Link>
            )}

            {/* <div className=" flex gap-3.5 items-center">
              <div className="bg-accent h-7 w-7 rounded-md grid place-content-center">
                <Search className="h-4 w-4" />
              </div>
              <div className="bg-accent h-7 w-7 rounded-md grid place-content-center">
                <Bell className="h-4 w-4" />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
