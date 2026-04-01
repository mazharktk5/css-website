"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, LayoutGrid, List, Zap } from "lucide-react";

const Events = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/events`);
                const data = await res.json();
                setAllEvents(data || []);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const categories = useMemo(
        () => ["All", ...new Set(allEvents.map((e) => e.category).filter((c) => c && c !== "past"))],
        [allEvents]
    );

    const filteredEvents = useMemo(
        () => allEvents.filter((event) => selectedCategory === "All" || event.category === selectedCategory),
        [allEvents, selectedCategory]
    );

    const displayedEvents = filteredEvents;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-2 border-slate-100 border-t-[#1e3a8a] rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a] pb-40">

            {/* Hero Section */}
            <header className="relative pt-32 pb-16 bg-[#1e3a8a]/10">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm text-[#1e3a8a] font-medium tracking-wide"
                    >
                        Computing Students Society
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight"
                    >
                        Explore, Learn & Build
                        <span className="block text-[#1e3a8a]">Events & Workshops</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        A student-led community hosting workshops, hackathons, and collaborative projects. Browse past and upcoming events.
                    </motion.p>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 flex justify-center gap-8 flex-wrap"
                    >
                        <div className="px-6 py-4 text-center bg-white/20 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <p className="text-3xl font-black text-[#1e3a8a]">{filteredEvents.length}</p>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Filtered</span>
                        </div>
                        <div className="px-6 py-4 text-center bg-white/20 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <p className="text-3xl font-black text-[#1e3a8a]">{allEvents.length}</p>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Total</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Filters */}
            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all
                ${selectedCategory === cat ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-blue-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid/List */}
            <main className="max-w-7xl mx-auto px-6 mt-10">
                <AnimatePresence mode="popLayout">
                    {displayedEvents.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {displayedEvents.map((event, idx) => (
                                <motion.div
                                    key={event._id || idx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={event.image || "/images/gallery/placeholder.jpg"}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
                                        />
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-[10px] font-bold uppercase text-[#1e3a8a] border border-slate-200">
                                            {event.category}
                                        </span>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-2 text-[#1e3a8a] text-[10px] font-bold uppercase">
                                            <Calendar className="w-3.5 h-3.5" /> {formatDate(event.date)}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                                        <p className="text-slate-500 text-[11px] font-medium line-clamp-3 flex-grow">{event.description}</p>
                                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                                                <Users className="w-4 h-4 text-[#1e3a8a]" /> {event.participants || "ARCHIVED"}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 text-center">
                            <div className="p-12 bg-slate-50 rounded-full border border-slate-200 mb-10">
                                <Zap className="w-16 h-16 text-slate-300" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">No Events Found</h3>
                            <p className="text-slate-500 max-w-md mt-4 font-medium leading-relaxed">
                                No events match your selected category.
                            </p>
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className="mt-8 px-6 py-3 bg-[#1e3a8a] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-md"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Events;