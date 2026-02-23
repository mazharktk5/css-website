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
            {/* Header / Hero - High Contrast Branding */}
            <header className="relative pt-40 pb-20 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1e3a8a]/20 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#93c5fd]/10 blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-[1px] bg-[#93c5fd]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#93c5fd]">Event Architecture</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-white">
                                PREMIER <br /> <span className="text-[#93c5fd] not-italic">CATALOG.</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-6 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                            <div className="px-8 py-4">
                                <div className="text-4xl font-black text-white tracking-tighter">{filteredEvents.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Active Matches</div>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10" />
                            <div className="px-8 py-4">
                                <div className="text-4xl font-black text-[#93c5fd] tracking-tighter">{allEvents.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Records</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Toolbar - Precision Engineering */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-100 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row items-center justify-between gap-8">
                    {/* Search & Categories */}
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                            <input
                                type="text"
                                placeholder="Query Archives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-[#1e3a8a]/30 focus:bg-white focus:shadow-xl focus:shadow-[#1e3a8a]/5 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                        ${selectedCategory === cat
                                            ? 'bg-[#1e3a8a] text-white shadow-xl shadow-[#1e3a8a]/20'
                                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-[#1e3a8a] shadow-sm" : "text-slate-400 hover:text-slate-900"}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-[#1e3a8a] shadow-sm" : "text-slate-400 hover:text-slate-900"}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-20">
                <AnimatePresence mode="popLayout">
                    {viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                        >
                            {displayedEvents.map((event, idx) => (
                                <motion.div
                                    layout
                                    key={event._id || `grid-${idx}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                                    className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-[#1e3a8a]/20 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(30,58,138,0.1)] relative flex flex-col h-full"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        <Image
                                            src={event.image || "/images/gallery/placeholder.jpg"}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-[#1e3a8a]">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 mb-4 text-[#1e3a8a]">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">{formatDate(event.date)}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-[#1e3a8a] transition-colors uppercase italic tracking-tighter">
                                            {event.title}
                                        </h3>
                                        <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-3 mb-8 flex-grow">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <Users className="w-4 h-4 text-[#1e3a8a]" /> {event.participants || "ARCHIVED"}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-500">
                                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                            className="flex flex-col gap-6"
                        >
                            {/* List Header */}
                            <div className="hidden lg:grid grid-cols-12 gap-8 px-10 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                <div className="col-span-1">DATE</div>
                                <div className="col-span-1">REF</div>
                                <div className="col-span-4">EVENT IDENTIFIER</div>
                                <div className="col-span-2">CLASSIFICATION</div>
                                <div className="col-span-2">ENGAGEMENT</div>
                                <div className="col-span-2 text-right">PROTOCOL</div>
                            </div>

                            {displayedEvents.map((event, idx) => (
                                <motion.div
                                    layout
                                    key={event._id || `list-${idx}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                                    className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-10 py-8 bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-[#1e3a8a]/20 rounded-[2rem] transition-all duration-500 active:scale-[0.99]"
                                >
                                    <div className="col-span-1 flex flex-col">
                                        <span className="text-xl font-black text-[#1e3a8a] tracking-tighter">{new Date(event.date).getDate()}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</span>
                                    </div>
                                    <div className="col-span-1">
                                        <span className="text-[10px] font-black text-slate-300">#{(idx + 1).toString().padStart(3, '0')}</span>
                                    </div>
                                    <div className="col-span-4">
                                        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-[#1e3a8a] transition-colors">{event.title}</h3>
                                        <p className="text-[10px] text-slate-500 font-medium truncate max-w-sm mt-1">{event.description}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 text-slate-600">
                                            {event.category}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Users className="w-4 h-4 text-[#1e3a8a]/50" /> {event.participants || "ARCHIVED"}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[#1e3a8a] text-[10px] font-black uppercase tracking-widest hover:bg-[#1e3a8a] hover:text-white hover:border-[#1e3a8a] transition-all duration-500 shadow-sm active:scale-95">
                                            Initialize
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
                        <div className="p-12 bg-slate-50 rounded-full border border-slate-100 mb-10">
                            <Zap className="w-16 h-16 text-slate-200" />
                        </div>
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">No Archives Found</h3>
                        <p className="text-slate-500 max-w-md mt-4 font-medium leading-relaxed">The requested engineering records are not present in the current filtration parameters.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="mt-10 px-8 py-4 bg-[#1e3a8a] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#1e3a8a]/20"
                        >
                            Clear Parameters
                        </button>
                    </div>
                )}

                {/* Load More */}
                {visibleCount < filteredEvents.length && (
                    <div className="mt-32 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 12)}
                            className="group relative px-12 py-5 bg-white border border-slate-100 rounded-2xl overflow-hidden active:scale-95 transition-all shadow-xl shadow-slate-200/50"
                        >
                            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 group-hover:text-[#1e3a8a] transition-colors">Load Extended Archives</span>
                            <div className="absolute inset-0 bg-slate-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Events;
