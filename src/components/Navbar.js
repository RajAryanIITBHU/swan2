"use client"

import React from 'react'
import { Separator } from './ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Calendar, Home, Inbox, Menu, Settings } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

 const items = [
   { title: "Test", url: "/", icon: Home },
   { title: "Results", url: "/results", icon: Inbox },
   { title: "Leaderboard", url: "/leaderboard", icon: Calendar },
   { title: "Settings", url: "/settings", icon: Settings },
 ];
 
const Navbar =() => {
    const path = usePathname()
    const currentItem = items.find((item) => item.url === path);
    const { toggleSidebar } = useSidebar();
  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 py-4 sticky top-0 bg-sidebar z-20">
      <div className="flex gap-2 items-center">
        <div className="cursor-pointer mr-1" onClick={toggleSidebar}>
          <Menu size={20} />
        </div>
        <Separator orientation="vertical" className="mr-2 h-3" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>{currentItem?.title || ""}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default Navbar
