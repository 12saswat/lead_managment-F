'use client'

import ManagerNavBar from "../../../components/ManagerNavBar";
import { usePathname } from "next/navigation";
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
        <div className="manager-layout-wrapper">
            {
                !hideNavBar && (
                    <ManagerNavBar />
                )
            }
            {children}
        </div>
    );
}
