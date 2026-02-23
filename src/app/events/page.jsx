"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Users, Search, LayoutGrid, List,
    ChevronRight, ArrowUpRight, Filter, Zap,
    Clock, MapPin
} from "lucide-react";

const Events = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);

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
        ["All", ...new Set(allEvents.map(e => e.category).filter(c => c && c !== "past"))],
        [allEvents]
    );

    const filteredEvents = useMemo(() => {
        return allEvents.filter((event) => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [allEvents, searchQuery, selectedCategory]);

    const displayedEvents = filteredEvents.slice(0, visibleCount);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-2 border-[#6ea3d8]/20 border-t-[#6ea3d8] rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050d1a] text-white selection:bg-[#6ea3d8]/30 selection:text-white pb-40">
            {/* Header / Hero */}
            <header className="relative pt-32 pb-12 border-b border-white/5 bg-[#0a192f]/30 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-[#6ea3d8]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6ea3d8]">Event Catalog</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                                PREMIER <br /> <span className="text-[#6ea3d8]">COLLECTION.</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <div className="px-6 py-2">
                                <div className="text-2xl font-black text-white">{filteredEvents.length}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Matches</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="px-6 py-2">
                                <div className="text-2xl font-black text-[#6ea3d8]">{allEvents.length}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Archives</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="sticky top-20 z-40 bg-[#050d1a]/80 backdrop-blur-2xl border-b border-white/5 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Search & Categories */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#6ea3d8] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[#6ea3d8]/50 focus:bg-white/[0.08] transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                        ${selectedCategory === cat
                                            ? 'bg-[#6ea3d8] text-[#0a192f] shadow-lg shadow-[#6ea3d8]/20'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#6ea3d8] text-[#0a192f]" : "text-white/40 hover:text-white"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#6ea3d8] text-[#0a192f]" : "text-white/40 hover:text-white"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-12">
                <AnimatePresence mode="popLayout">
                    {viewMode === "grid" ? (
                        /* Systematic Grid */
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
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#6ea3d8]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#050d1a] relative"
                                >
                                    <div className="relative h-48 overflow-hidden transition-all duration-700">
                                        <Image
                                            src={event.image || "/images/gallery/placeholder.jpg"}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-[#0a192f]/80 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3 text-[#6ea3d8]">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[9px] font-black tracking-widest uppercase">{formatDate(event.date)}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-white leading-tight mb-3 group-hover:text-[#6ea3d8] transition-colors italic line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-2 mb-6">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-50">
                                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                                                <Users className="w-3 h-3" /> {event.participants || "ARCHIVED"}
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        /* Systematic List */
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-4"
                        >
                            {/* List Header */}
                            <div className="hidden lg:grid grid-cols-12 gap-6 px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                <div className="col-span-1">DATE</div>
                                <div className="col-span-5">EVENT NAME</div>
                                <div className="col-span-2">CATEGORY</div>
                                <div className="col-span-2">ACCESS</div>
                                <div className="col-span-2 text-right">ACTION</div>
                            </div>

                            {displayedEvents.map((event, idx) => (
                                <motion.div
                                    layout
                                    key={event._id || `list-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-8 py-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/20 rounded-2xl transition-all"
                                >
                                    <div className="col-span-1 flex flex-col">
                                        <span className="text-xs font-black text-[#6ea3d8]">{new Date(event.date).getDate()}</span>
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</span>
                                    </div>
                                    <div className="col-span-5">
                                        <h3 className="text-base font-black text-white italic group-hover:text-[#6ea3d8] transition-colors">{event.title}</h3>
                                        <p className="text-[10px] text-white/30 truncate max-w-sm mt-1">{event.description}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">
                                            {event.category}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase">
                                            <Users className="w-3 h-3" /> {event.participants || "ARCHIVED"}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#6ea3d8] hover:bg-[#6ea3d8] hover:text-[#0a192f] transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="p-10 bg-white/5 rounded-full border border-white/10 mb-8">
                            <Zap className="w-12 h-12 text-white/10" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">No results found</h3>
                        <p className="text-white/30 max-w-sm mt-2">No archives match your current search or category filter. Try clearing your filters.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#6ea3d8] hover:underline"
                        >
                            CLEAR FILTERS
                        </button>
                    </div>
                )}

                {/* Load More */}
                {visibleCount < filteredEvents.length && (
                    <div className="mt-20 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 12)}
                            className="group relative px-10 py-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden active:scale-95 transition-all"
                        >
                            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-[#6ea3d8] transition-colors">Load More Archives</span>
                            <div className="absolute inset-0 bg-[#6ea3d8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-5" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Events;
