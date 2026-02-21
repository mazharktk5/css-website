"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    CalendarDays,
    Image,
    Users,
    Bell,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronRight,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Events", href: "/admin/events", icon: CalendarDays },
    { name: "Registrations", href: "/admin/registrations", icon: Bell },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Team", href: "/admin/team", icon: Users },
];

export default function AdminLayout({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("admin_token");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            try {
                const res = await fetch("/api/auth/verify", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    setAuthenticated(true);
                } else {
                    localStorage.removeItem("admin_token");
                    router.push("/admin/login");
                }
            } catch {
                router.push("/admin/login");
            }
            setChecking(false);
        };

        verifyToken();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!authenticated) return null;

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex">
            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0d1220]/95 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Sidebar Header */}
                <div className="px-6 h-20 flex items-center justify-between border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-sm tracking-tight">CSS Admin</h2>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                                {item.name}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400/50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 pb-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-20 bg-[#0d1220]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white mr-4"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-white">
                            {navItems.find((item) => item.href === pathname)?.name || "Admin"}
                        </h1>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="text-xs font-semibold text-gray-400 hover:text-blue-400 border border-white/[0.08] hover:border-blue-500/30 px-4 py-2 rounded-lg transition-all"
                    >
                        View Site →
                    </Link>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
