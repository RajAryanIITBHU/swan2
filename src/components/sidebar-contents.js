"use client"
import React from 'react'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Home, Inbox, Settings } from 'lucide-react';

const SidebarContents = () => {
    const items = [
      { title: "Test", url: "/", icon: Home },
      { title: "Results", url: "/results", icon: Inbox },
      // { title: "Leaderboard", url: "/leaderboard", icon: Calendar },
      // { title: "Settings", url: "/settings", icon: Settings },
    ];
    const path = usePathname()
  return (
    <SidebarGroup className={"h-full"}>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size='md'
                className={`${
                  path === item.url
                    ? "bg-primary/70 hover:bg-primary/70"
                    : "hover:bg-primary/10"
                }  text-base px-4`}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default SidebarContents
