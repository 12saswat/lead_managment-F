'use client'
import { usePathname } from "next/navigation";
import WorkerNavBar from "../../../components/WorkerNavBar";

export default function ManagerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const hideNavBar =
    pathname.startsWith('/manager/auth') ||
    pathname.startsWith('/worker/auth')
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
