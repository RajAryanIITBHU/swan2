"use client"
import { Menu } from 'lucide-react';
import React from 'react'
import { useSidebar } from './sidebar';

const CustomSidebarTrigger = () => {
    const { toggleSidebar } = useSidebar();
  return (
    <button className='cursor-pointer mr-1' onClick={toggleSidebar}>
      <Menu size={20}/>
    </button>
  );
}

export default CustomSidebarTrigger
