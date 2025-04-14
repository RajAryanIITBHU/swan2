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
      <SidebarContent className={"px-4"}>
        <SidebarHeader>
          <div className="flex px-2 pt-2">
            <Link href={"/"}>
              <Image className="hidden dark:block" src={"/logo/logo-dark.png"} height={70} width={70} alt="logo" />
              <Image className="dark:hidden block" src={"/logo/logo.png"} height={70} width={70} alt="logo" />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContents />
        <SidebarFooter>
          <NavUser session={session} />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
