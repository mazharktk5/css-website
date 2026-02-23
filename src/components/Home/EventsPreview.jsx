"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowUpRight } from "lucide-react";

const EventsPreview = () => {
    const [previewEvents, setPreviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                const allEvents = Array.isArray(data) ? data : [];
                // Show latest 3 events on home page
                setPreviewEvents(allEvents.slice(0, 3));
            } catch {
                setPreviewEvents([]);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <section
            id="events"
            className="py-20 relative overflow-hidden bg-white"
        >
            {/* Background Decorative Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden text-center opacity-[0.02]">
                <h2 className="text-[20vw] font-black italic tracking-tighter uppercase leading-none mt-20 text-slate-900">
                    SESSIONS
                </h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 mb-4 text-[#1e3a8a]"
                        >
                            <span className="w-8 h-px bg-[#1e3a8a]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Highlights</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter leading-none"
                        >
                            What <span className="text-[#1e3a8a]">We&apos;ve Done. </span>
                        </motion.h2>
                    </div>
                </div>

                {/* Event Cards */}
                {loading ? (
                    <div className="mt-16 flex justify-center">
                        <div className="w-10 h-10 border-2 border-slate-100 border-t-[#1e3a8a] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {previewEvents.map((event, index) => (
                            <motion.div
                                key={event._id || `event-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-slate-50/50 border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-[#1e3a8a]/30 transition-all duration-500 hover:shadow-2xl relative flex flex-col h-full"
                            >
                                {/* Event Image */}
                                <div className="relative h-52 overflow-hidden flex-shrink-0">
                                    <Image
                                        src={event.image || "/images/gallery/placeholder.jpg"}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md border border-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-[#1e3a8a]">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-4 text-[#1e3a8a]">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[9px] font-black tracking-widest uppercase">{formatDate(event.date)}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 italic leading-tight mb-4 group-hover:text-[#1e3a8a] transition-colors line-clamp-2 min-h-[3.5rem]">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3 mb-8 flex-grow">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            <Users className="w-3 h-3" /> {event.participants || "ARCHIVED"}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-900 font-black text-[9px] uppercase tracking-wider group-hover:text-[#1e3a8a] transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/events"
                        className="group relative px-10 py-5 bg-slate-900 border border-slate-900 rounded-[1.5rem] overflow-hidden active:scale-95 transition-all shadow-xl shadow-slate-100"
                    >
                        <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em] text-white">See Complete Archive</span>
                        <div className="absolute inset-0 bg-[#1e3a8a] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsPreview;
