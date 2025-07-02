"use client";
import { LogOut, Moon, Settings, SquareArrowLeft, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from "next-themes"
import { Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
  const handleGoBack = () => {
    window.history.back();
  };
const Navbar = () => {
    // const {toggleSidebar}=useSidebar();
    const { setTheme } = useTheme();
  return (
   <nav className=' flex justify-between px-4 flex-col shadow-sm'>
    {/* LEFT */}
    {/* RIGHT */}
    <div className='flex items-center p-2 justify-between gap-4'>
    <SquareArrowLeft onClick={handleGoBack} />
    <div className='flex items-center justify-between gap-4'>

    
    <Link href="/">Dashboard</Link>
    {/* THEME MENU */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
   </div>
    </div>
   </nav>
  )
}
export default Navbar
Navbar