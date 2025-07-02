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
    pathname === '/worker/auth/login' ||
    pathname === '/worker/auth/register'
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
