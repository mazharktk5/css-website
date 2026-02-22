"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, MapPin, Sparkles, Filter, ChevronRight, Zap } from "lucide-react";

const Events = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                setAllEvents(Array.isArray(data) ? data : []);
            } catch {
                setAllEvents([]);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const categories = useMemo(() =>
        ["All", ...new Set(allEvents.map(e => e.category).filter(c => c !== "past"))],
        [allEvents]
    );

    const filteredEvents = useMemo(() =>
        selectedCategory === "All"
            ? allEvents
            : allEvents.filter((event) => event.category === selectedCategory),
        [allEvents, selectedCategory]
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-t-2 border-[#1e3a8a] rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Soft Background Accents */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[15%] right-[5%] w-[35%] h-[35%] bg-blue-400/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Premium Header */}
            <header className="relative pt-32 pb-16 px-6 bg-gradient-to-b from-[#1e3a8a] to-[#3e76b2] text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto flex flex-col items-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                        Upcoming Activities
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-center">
                        Our <span className="text-[#93c5fd]">Events</span>
                    </h1>

                    <p className="text-blue-50/80 text-lg md:text-xl max-w-2xl text-center leading-relaxed font-medium">
                        Join us for high-impact workshops, hackathons, and networking sessions designed to accelerate your growth in the world of computing.
                    </p>

                    <div className="mt-10 flex items-center gap-6">
                        <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-2xl font-black text-white">{allEvents.length}</span>
                            <span className="ml-2 text-blue-200 font-bold text-xs uppercase tracking-widest">Occasions</span>
                        </div>
                    </div>
                </motion.div>

                {/* Waves Pattern Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-40 -mt-8 relative z-20">
                {/* Clean Filter Controls */}
                <div className="sticky top-24 z-40 mb-12 flex flex-wrap items-center justify-center gap-2 p-2 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-xl shadow-blue-900/5">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                px-6 py-2.5 rounded-[2rem] text-xs font-black tracking-wider transition-all
                                ${selectedCategory === cat
                                    ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-500 hover:text-[#1e3a8a] hover:bg-blue-50'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event, idx) => (
                            <motion.div
                                layout
                                key={event._id || `event-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2"
                            >
                                {/* Image Section */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

                                    {/* Category Badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-1.5 bg-[#93c5fd]/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-900 shadow-lg">
                                            {event.category}
                                        </span>
                                    </div>

                                    {/* Date Mini Badge */}
                                    <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90">
                                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider truncate max-w-[150px]">
                                            {formatDate(event.date).split(',')[1]}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-black text-[#1e3a8a] leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                                        {event.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <Users className="w-5 h-5 text-[#3e76b2]" />
                                                <span className="text-xs font-bold uppercase tracking-widest">
                                                    {event.participants || "Open to all"}
                                                </span>
                                            </div>
                                            <Link href="/contact" className="p-3 bg-blue-50 text-[#1e3a8a] rounded-2xl hover:bg-[#1e3a8a] hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl mb-6 text-gray-200">
                            <Zap className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Upcoming Spark</h3>
                        <p className="text-gray-500 font-medium">No events found in this category. We're currently planning more amazing sessions for you!</p>
                    </div>
                )}

                {/* Consistent CTA Section */}
                <section className="mt-32 p-12 md:p-20 bg-[#1e3a8a] rounded-[3rem] text-white overflow-hidden relative">
                    {/* Decorative Background Accents */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-400 opacity-20 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600 opacity-30 blur-[80px] rounded-full" />

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Stay Powered Up</h2>
                            <p className="text-blue-100/80 text-lg md:text-xl font-medium leading-relaxed mb-10">
                                Don&apos;t miss out on the latest opportunities to learn and connect. Join our community to receive real-time updates about upcoming workshops.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-3 bg-[#93c5fd] text-[#1e3a8a] px-8 py-4 rounded-2xl font-black transition-all hover:bg-white hover:scale-105 shadow-xl shadow-blue-900/40">
                                Join our Community <Sparkles className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Events;
