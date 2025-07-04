import { Calendar,LogOut, ChevronUp, Home, Inbox, Search, Settings, User, User2, User2Icon, Plus, Projector, ChevronDown, LayoutDashboard, Users, Copy, Layers, Briefcase, Mail, FileText } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"



import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "All Leads",
    url: "#",
    icon: Users,
  },
  {
    title: "Add Lead",
    url: "#",
    icon: Plus,
  },
  {
    title: "Bulk Lead",
    url: "#ff",
    icon: Copy,
  },
  {
    title: "Categories",
    url: "#",
    icon: Layers,
  },
  {
    title: "Assignments",
    url: "#",
    icon: Briefcase,
  },
  {
    title: "Campaigns",
    url: "#",
    icon: Mail,
  },
  {
    title: "Documents",
    url: "#",
    icon: FileText,
  },
]

const Appsidebar = () => {
  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/vercel.svg" alt="logo" width={20} height={20} />
                <span>Rahul Kumar</span>
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
                items.map(item=>(
                  <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                    {/* {item.title==="Add Lead" && <SidebarMenuBadge >
                      <Plus size={15} /><span className="sr-only">Add Project</span>
                    </SidebarMenuBadge>} */}
                </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
             

      </SidebarContent>
<SidebarSeparator className="-mx-0" />
      <SidebarFooter>
        <SidebarMenu >
          <SidebarMenuItem className="flex">
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/window.svg" alt="logo" width={20} height={20} />
                <span>Rahul Kumar</span>
              </Link>
            </SidebarMenuButton>
            <LogOut />
              {/* <Button variant="destructive" size={"smm"}>LogOut</Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default Appsidebar;