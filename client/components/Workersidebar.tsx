import { LogOut, Plus, LayoutDashboard, Users, Copy, FileText, MessageSquare } from "lucide-react"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/Axios";
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/worker/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "All Leads",
    url: "/leads/all-leads",
    icon: Users,
  },
  {
    title: "Add Lead",
    url: "/leads/upload-leads",
    icon: Plus,
  },
  {
    title: "Bulk Lead",
    url: "/leads/upload-leads-bulk",
    icon: Copy,
  },
  {
    title: "Conversation",
    url: "/leads/conversation",
    icon: MessageSquare,
  },
]

const WorkerSidebar = () => {
  const router = useRouter();
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 2025 00:00:00 GMT";
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      if (cookie.startsWith("001")) {
        const name = cookie.split("=")[0];
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 2025 00:00:00 GMT`;
      }
    });
    router.push("/worker/auth/login");
  };

  const [user, setUser] = useState(); 
  useEffect(() => {
    axios.get("/user/current").then((res) => {
      if (res.data.data.name) setUser(res.data.data.name);
      console.log("Current user:", res.data.data.name);
    });
  }, [user]);


  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" side="left" className="backdrop-blur-sm border-1 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/90">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/Indibus.jpg" alt="logo" width={30} height={30} className="rounded-2xl" />
                <span>Lead Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="-mx-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                items.map(item => (
                  <SidebarMenuItem className={`rounded-xl ${item.url === pathname ? "bg-gray-200 text-black" : "rounded"}`} key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
      <SidebarSeparator className="-mx-0" />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="cursor-pointer">
              <LogOut size={16} />
              <span>{user}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default WorkerSidebar;