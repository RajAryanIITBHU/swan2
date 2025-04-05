"use client";

import { useEffect, useState, useTransition } from "react";
import { Sun, Moon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { setTheme } from "@/app/actions"; // Import server action

export function NavUser({ session }) {
  const { isMobile } = useSidebar();
  const [theme, setClientTheme] = useState("light");
  const [isPending, startTransition] = useTransition();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setClientTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleToggle = (newTheme) => {
    setClientTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Server-side update (persists across sessions)
    startTransition(() => setTheme(newTheme));
  };

  return (
    <SidebarMenu>
      {/* Theme Toggle */}
      <SidebarMenuItem className="mb-4">
        <Tabs value={theme} onValueChange={handleToggle}>
          {" "}
          {/* ✅ Controlled Tabs */}
          <TabsList className="w-full">
            <TabsTrigger value="light">
              <Sun /> Light
            </TabsTrigger>
            <TabsTrigger value="dark">
              <Moon /> Dark
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </SidebarMenuItem>

      {/* User Profile */}
      <SidebarMenuItem className="flex gap-3 items-center">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={
              session?.user?.avatar ||
              `https://ui-avatars.com/api/?name=${session?.user?.name}&background=random&bold=true`
            }
            alt={session?.user?.name}
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{session?.user?.name}</span>
          <span className="truncate text-xs">{session?.user?.email}</span>
        </div>
      </SidebarMenuItem>

      <SidebarSeparator className="my-2" />

      {/* Logout Button */}
      <SidebarMenuButton asChild size="md" className="px-4">
        <Button
          className="justify-start"
          onClick={async () => {
            try {
              await signOut();
              toast.success("Logged Out Successfully!");
            } catch (err) {
              console.error("Logout ", err);
            }
          }}
          variant="ghost"
        >
          <LogOutIcon />
          Logout
        </Button>
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
