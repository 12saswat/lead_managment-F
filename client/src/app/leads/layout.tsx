"use client";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import Appsidebar from "../../../components/Appsidebar";
import Navbar2 from "../../../components/Navbar2";
import Navbar from "../../../components/Navbar";
import Workersidebar from "../../../components/Workersidebar";
export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const allCookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const found001 = allCookies.some((cookie) => cookie.startsWith("001"));
  console.log("found001", found001);
  //NOTE: Un-comment below logic to remove navbar from auth pages.
  const hideNavBar = pathname.startsWith('/manager/auth');
  // const hideNavBar = false;
  return (
    <div className="">
         <SidebarProvider>
        {!hideNavBar && (
          found001 ? <Workersidebar /> : <Appsidebar />
        )}
        <main className="w-full">
          {!hideNavBar && <Navbar />}
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
