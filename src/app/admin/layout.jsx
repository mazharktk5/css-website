"use client";

import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6 flex flex-col">
                <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
                <nav className="flex flex-col gap-3">
                    <Link href="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
                    <Link href="/admin/events" className="hover:text-blue-400">Events</Link>
                    <Link href="/admin/gallery" className="hover:text-blue-400">Gallery</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
