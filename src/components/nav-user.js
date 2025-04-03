"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LogOutIcon,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"


export function NavUser({
  session,
}) {
  const { isMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className={"flex gap-3 items-center"}>
        
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
            <span className="truncate font-semibold">
              {session?.user?.name}
            </span>
            <span className="truncate text-xs">{session?.user?.email}</span>
          </div>
          
        
      </SidebarMenuItem>
      <SidebarSeparator className={"my-2"}/>
              <SidebarMenuButton onClick={async ()=>
                {
                  try{
                    await signOut()
                    toast.success("Logged Out Successfully!")
                  }catch(err){
                    console.error("Logout ", err)
                  }
                }
              } variant="outline" size="md" className={"!text-red-400 hover:!bg-red-50 cursor-pointer flex items-center hover:!text-red-500 font-medium gap-2 focus:!bg-red-100 focus:!text-red-600"}><LogOutIcon/>Logout</SidebarMenuButton>
    </SidebarMenu>
  );
}
