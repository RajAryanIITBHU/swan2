import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { NavUser } from "./nav-user";

const items = [
  {
    title: "Test",
    url: "/",
    icon: Home,
  },
  {
    title: "Results",
    url: "/results",
    icon: Inbox,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Calendar,
  },

  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className={"bg-white"}>
        <SidebarHeader>
            <div className="flex px-2 pt-2">
                <Image src={"/logo/logo.png"} height={52} width={52} alt="logo"/>
            </div>
        </SidebarHeader>
        <SidebarGroup className={"h-full"}>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
              <NavUser/>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
