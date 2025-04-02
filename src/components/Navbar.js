"use client"

import React from 'react'
import { Separator } from './ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import CustomSidebarTrigger from './ui/custom-sidebar-trigger';
import { usePathname } from 'next/navigation';
import { Calendar, Home, Inbox, Settings } from 'lucide-react';

 const items = [
   { title: "Test", url: "/", icon: Home },
   { title: "Results", url: "/results", icon: Inbox },
   { title: "Leaderboard", url: "/leaderboard", icon: Calendar },
   { title: "Settings", url: "/settings", icon: Settings },
 ];
 
const Navbar =() => {
    const path = usePathname()
    const currentItem = items.find((item) => item.url === path);
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 py-4">
      <CustomSidebarTrigger/>
      <Separator orientation="vertical" className="mr-2 h-3" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbPage >{currentItem?.title || ""}</BreadcrumbPage>
          </BreadcrumbItem>
          
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

export default Navbar
