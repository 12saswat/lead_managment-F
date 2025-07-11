import {
  LogOut,
  Plus,
  LayoutDashboard,
  Users,
  Copy,
  Layers,
  Briefcase,
  Mail,
  FileText,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/manager/dashboard",
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
    url: "/leads/upload-leads-bulk/5",
    icon: Copy,
  },
  {
    title: "Categories",
    url: "/manager/category",
    icon: Layers,
  },
  {
    title: "Assignments",
    url: "/manager/assignment",
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
];

const Appsidebar = () => {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" side="left" className=" backdrop-blur-sm border-1 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/90">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/Indibus.jpg" alt="logo" width={30} height={30} className="rounded-2xl" />
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
                  <SidebarMenuItem
                    className={`rounded-xl ${item.url === pathname ? "bg-gray-200 text-black" : "rounded"}`}
                    key={item.title}
                  >
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut size={16} />
              <span>Rahul Kumar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Appsidebar;
