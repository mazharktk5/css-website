"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { CalendarDays, Image, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ events: 0, gallery: 0, team: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [eventsRes, galleryRes, teamRes] = await Promise.all([
                    fetch("/api/events"),
                    fetch("/api/gallery"),
                    fetch("/api/team"),
                ]);
                const [events, gallery, team] = await Promise.all([
                    eventsRes.json(),
                    galleryRes.json(),
                    teamRes.json(),
                ]);
                setStats({
                    events: Array.isArray(events) ? events.length : 0,
                    gallery: Array.isArray(gallery) ? gallery.length : 0,
                    team: Array.isArray(team) ? team.length : 0,
                });
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: "Total Events",
            value: stats.events,
            icon: CalendarDays,
            gradient: "from-blue-600 to-cyan-500",
            shadow: "shadow-blue-500/20",
        },
        {
            title: "Gallery Images",
            value: stats.gallery,
            icon: Image,
            gradient: "from-violet-600 to-purple-500",
            shadow: "shadow-violet-500/20",
        },
        {
            title: "Team Members",
            value: stats.team,
            icon: Users,
            gradient: "from-emerald-600 to-teal-500",
            shadow: "shadow-emerald-500/20",
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/10 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Dashboard Overview</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Welcome to CSS Admin</h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        Manage your society&apos;s events, gallery, and team members from here.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300 ${card.shadow}`}
                        >
                            {/* Gradient accent */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient}`} />

                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{card.title}</p>
                                    {loading ? (
                                        <div className="h-10 w-16 bg-white/[0.05] rounded animate-pulse" />
                                    ) : (
                                        <p className="text-4xl font-black text-white">{card.value}</p>
                                    )}
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Tip */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-300 mb-3">💡 Quick Start</h3>
                    <ul className="text-sm text-gray-500 space-y-2">
                        <li>• Use the <span className="text-gray-300">Events</span> section to add upcoming workshops and hackathons</li>
                        <li>• Upload photos from events in the <span className="text-gray-300">Gallery</span> section</li>
                        <li>• Keep your <span className="text-gray-300">Team</span> page updated with current members and roles</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
