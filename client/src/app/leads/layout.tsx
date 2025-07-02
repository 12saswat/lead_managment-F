"use client";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import Appsidebar from "../../../components/Appsidebar";
import Navbar2 from "../../../components/Navbar2";
export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  //NOTE: Un-comment below logic to remove navbar from auth pages.
  // const hideNavBar = pathname.startsWith('/manager/auth');
  const hideNavBar = false;
  return (
    <div className="">
          <SidebarProvider>
            <main className="w-full">
             {!hideNavBar &&(<Navbar2 />)} 
                {children}
            </main>
          </SidebarProvider>
    </div>
  );
  //   return (
  //     <SidebarProvider>
  //       <Appsidebar />
  //       <main className="w-full">
  //         <Navbar />
  //         <div className="">{children}</div>
  //       </main>
  //     </SidebarProvider>
  //   );
}
