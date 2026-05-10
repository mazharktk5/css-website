"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <Footer />}
        </>
    );
}
