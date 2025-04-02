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
import { auth } from "@/auth";
import Link from "next/link";
import SidebarContents from "./sidebar-contents";

// Menu items.
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

export async function AppSidebar() {
  const session = await auth()
  return (
    <Sidebar>
      <SidebarContent className={"bg-white"}>
        <SidebarHeader>
            <div className="flex px-2 pt-2">
                <Image src={"/logo/logo.png"} height={52} width={52} alt="logo"/>
            </div>
        </SidebarHeader>
        <SidebarContents/>
        <SidebarFooter>
              <NavUser session = {session}/>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
