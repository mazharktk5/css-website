"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Calendar, Bell } from "lucide-react";

export default function RegistrationPopup() {
    const [announcement, setAnnouncement] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchActiveAnnouncement = async () => {
            try {
                const res = await fetch("/api/announcements?active=true");
                const data = await res.json();
                if (data && data.length > 0) {
                    // Show the one that expires soonest
                    setAnnouncement(data[0]);

                    // Always show if active, no dismissal check per user request
                    setTimeout(() => setIsVisible(true), 1500);
                }
            } catch { /* ignore */ }
        };

        fetchActiveAnnouncement();
    }, []);

    if (!announcement || !isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] p-0 pointer-events-none animate-in slide-in-from-right-10 fade-in duration-500">
            <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-[320px] overflow-hidden shadow-2xl shadow-blue-500/20 pointer-events-auto transform hover:scale-[1.02] transition-transform duration-300">
                {/* Header Decoration - Slimmer for floating style */}
                <div className="h-16 bg-gradient-to-br from-blue-600 to-indigo-700 relative flex items-center px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                        <Bell className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    {/* Particles or abstract shapes */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                </div>

                {/* Content */}
                <div className="p-6 text-left relative">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Calendar className="w-3 h-3" />
                        Registration Active
                    </div>

                    <h3 className="text-lg font-black text-white mb-2 line-clamp-2">
                        {announcement.title}
                    </h3>

                    <p className="text-gray-400 text-xs leading-relaxed mb-5 line-clamp-3">
                        {announcement.description}
                    </p>

                    <div className="space-y-3">
                        <a
                            href={announcement.googleFormLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-black text-sm rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-white/5 group"
                        >
                            Register
                            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                    </div>
                </div>

                {/* Expiry Badge */}
                <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">
                        Ends: {new Date(announcement.expiryDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
