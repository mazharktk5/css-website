"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Search, LayoutGrid, List, ArrowUpRight, Zap } from "lucide-react";

const Events = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchEvents();
    }, []);

    const categories = useMemo(
        () => ["All", ...new Set(allEvents.map((e) => e.category).filter((c) => c && c !== "past"))],
        [allEvents]
    );

    const filteredEvents = useMemo(() => {
        return allEvents.filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [allEvents, searchQuery, selectedCategory]);

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
        <div className="min-h-screen bg-white text-slate-900 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a] pb-40">

            {/* Hero */}
            <header className="relative pt-32 pb-16 bg-[#1e3a8a]/10">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-[#1e3a8a]">
                                Computing Students Society
                                <span className="block text-slate-900 mt-2 text-3xl md:text-4xl font-bold">
                                    Explore, Learn & Build
                                </span>
                            </h1>
                            <p className="mt-6 text-slate-600 max-w-lg text-lg md:text-xl leading-relaxed">
                                A student-led computing community hosting workshops, hackathons, and collaborative
                                projects. Build skills, network, and grow as a future developer or tech innovator.
                            </p>
                        </div>

                        <div className="flex gap-6 bg-white/20 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <div className="px-6 py-4 text-center">
                                <p className="text-3xl font-black text-[#1e3a8a]">{filteredEvents.length}</p>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Filtered</span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/20" />
                            <div className="px-6 py-4 text-center">
                                <p className="text-3xl font-black text-[#1e3a8a]">{allEvents.length}</p>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Total</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row items-center justify-between gap-6">

                    {/* Search + Categories */}
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-[#1e3a8a] focus:shadow-md focus:shadow-[#1e3a8a]/10 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? "bg-[#1e3a8a] text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-[#1e3a8a] shadow" : "text-slate-400 hover:text-slate-900"}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#1e3a8a] shadow" : "text-slate-400 hover:text-slate-900"}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-10">

                <AnimatePresence mode="popLayout">
                    {viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {displayedEvents.map((event, idx) => (
                                <motion.div
                                    layout
                                    key={event._id || `grid-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500 flex flex-col"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={event.image || "/images/gallery/placeholder.jpg"}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
                                        />
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-[9px] font-bold uppercase text-[#1e3a8a] border border-slate-200">
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
                                            <div className="w-8 h-8 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4"
                        >
                            {displayedEvents.map((event, idx) => (
                                <motion.div
                                    layout
                                    key={event._id || `list-${idx}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                                    className="group grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all"
                                >
                                    <div className="col-span-2 text-[#1e3a8a] font-bold text-sm">{formatDate(event.date)}</div>
                                    <div className="col-span-6">
                                        <h3 className="font-bold text-slate-900">{event.title}</h3>
                                        <p className="text-slate-500 text-xs truncate">{event.description}</p>
                                    </div>
                                    <div className="col-span-2 text-[10px] font-bold text-[#1e3a8a] uppercase">{event.category}</div>
                                    <div className="col-span-2 text-[10px] font-bold text-slate-500 flex items-center justify-end gap-2">
                                        <Users className="w-4 h-4 text-[#1e3a8a]" /> {event.participants || "ARCHIVED"}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="p-12 bg-slate-50 rounded-full border border-slate-200 mb-10">
                            <Zap className="w-16 h-16 text-slate-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">No Archives Found</h3>
                        <p className="text-slate-500 max-w-md mt-4 font-medium leading-relaxed">
                            No events match your search or category filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                            }}
                            className="mt-8 px-6 py-3 bg-[#1e3a8a] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-md"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Events;