import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar";
import { type Icon } from "iconsax-react";
import { type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon | Icon;
    hide?: boolean; // Optional property to hide the item in the sidebar
  }[];
}) {
  const location = useLocation();

  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items
          .filter((item) => !item.hide)
          .map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                size="lg"
                asChild
                isActive={
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url)
                }
              >
                <Link
                  to={item.url}
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                  }}
                >
                  <item.icon color="white" className=" h-6 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
