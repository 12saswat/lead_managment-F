'use client'
import { usePathname } from "next/navigation";
import WorkerNavBar from "../../../components/WorkerNavBar";

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
                    <WorkerNavBar />
                )
            }
            {children}
        </div>
    );
}
