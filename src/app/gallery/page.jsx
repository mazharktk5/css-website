"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Filter, ChevronRight, LayoutGrid, Zap } from 'lucide-react';
import ImageLightbox from '@/components/Gallery/ImageLightbox';

const Gallery = () => {
    const [galleryData, setGalleryData] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const fetchGallery = async (pageNumber = 1, append = false, category = 'All') => {
        if (pageNumber === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await fetch(`/api/gallery?page=${pageNumber}&limit=12&category=${category}`);
            const data = await res.json();

            if (append) {
                setGalleryData(prev => {
                    const existingIds = new Set(prev.map(i => i._id));
                    const newItems = (data.items || []).filter(i => !existingIds.has(i._id));
                    return [...prev, ...newItems];
                });
            } else {
                // Also deduplicate initial items just in case the API returns duplicates
                const uniqueItems = [];
                const seen = new Set();
                (data.items || []).forEach(item => {
                    if (!seen.has(item._id)) {
                        seen.add(item._id);
                        uniqueItems.push(item);
                    }
                });
                setGalleryData(uniqueItems);
            }

            if (data.categories) {
                setCategories(data.categories);
            }
            setPagination(data.pagination || { page: 1, totalPages: 1 });
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchGallery(1, false, selectedCategory);
    }, [selectedCategory]);

    const handleLoadMore = () => {
        if (pagination.page < pagination.totalPages) {
            fetchGallery(pagination.page + 1, true, selectedCategory);
        }
    };

    const openLightbox = (index) => setLightbox({ isOpen: true, index });
    const closeLightbox = () => setLightbox({ isOpen: false, index: 0 });
    const nextImage = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % galleryData.length }));
    const prevImage = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + galleryData.length) % galleryData.length }));

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-slate-100 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-t-2 border-[#1e3a8a] rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a] overflow-x-hidden">
            {/* Soft Background Accents */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-[#1e3a8a] rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-[#93c5fd] rounded-full blur-[120px]" />
            </div>

            {/* High Contrast Branding Header */}
            <header className="relative pt-40 pb-20 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1e3a8a]/20 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#93c5fd]/10 blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto px-6 relative z-10"
                >
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-[1px] bg-[#93c5fd]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#93c5fd]">Visual Archive</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-[0.85] text-white">
                                DIGITAL <br /><span className="text-[#93c5fd] not-italic">GALLERY.</span>
                            </h1>

                            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
                                A curated visual record of our computing mastery, innovation, and community impact.
                                Exploring the moments that define our collective progress.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                            <div className="px-8 py-4">
                                <div className="text-4xl font-black text-white tracking-tighter">{galleryData.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Assets</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
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

                {/* High Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {galleryData.map((item, idx) => (
                            <motion.div
                                layout
                                key={item._id || `gal-${idx}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: (idx % 3) * 0.1 }}
                                className="group relative cursor-pointer"
                                onClick={() => openLightbox(idx)}
                            >
                                <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(30,58,138,0.15)] hover:-translate-y-3 group-hover:border-blue-200/50">
                                    {/* Image Container with Consistent Aspect Ratio */}
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.eventName}
                                            fill
                                            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Elegant Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700">
                                            <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col gap-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-4 py-1.5 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-full text-[9px] font-black uppercase tracking-[2px] text-blue-100">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter">
                                                    {item.eventName}
                                                </h3>
                                                <p className="text-blue-100/60 text-xs font-medium line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Decorative Zoom Trigger */}
                                        <div className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-10 group-hover:translate-x-0 border border-white/20">
                                            <LayoutGrid className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {!loading && galleryData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center grayscale opacity-40">
                        <div className="p-10 bg-slate-100/50 rounded-[3rem] border border-slate-200 mb-8">
                            <ImageIcon className="w-16 h-16 text-slate-400" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase italic tracking-tighter">Visual Silence</h3>
                        <p className="text-slate-500 font-medium max-w-sm">No captures found in this archival sector. Check back later.</p>
                    </div>
                )}
                {/* Load More */}
                {!loading && pagination.page < pagination.totalPages && (
                    <div className="mt-20 flex justify-center">
                        <button
                            disabled={loadingMore}
                            onClick={handleLoadMore}
                            className="group relative px-12 py-4 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-[#1e3a8a] hover:border-[#93c5fd]/30 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-900/20"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {loadingMore ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ARCHIVING MOMENTS...
                                    </>
                                ) : (
                                    "Expand Visual Records"
                                )}
                            </span>
                        </button>
                    </div>
                )}
            </main>

            {/* Premium Stats Grid */}
            <section className="bg-white border-t border-gray-100 py-32">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-[#1e3a8a] tracking-tight">{galleryData.length}</div>
                        <div className="text-xs uppercase font-bold tracking-[0.2em] text-gray-400">Total Memories</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-[#1e3a8a] tracking-tight">{categories.length > 1 ? categories.length - 1 : 0}</div>
                        <div className="text-xs uppercase font-bold tracking-[0.2em] text-gray-400">Unique Categories</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-black text-[#1e3a8a] tracking-tight">{new Date().getFullYear()}</div>
                        <div className="text-xs uppercase font-bold tracking-[0.2em] text-gray-400">Archive Started</div>
                    </div>
                </div>
            </section>

            {/* Lightbox Integration */}
            {lightbox.isOpen && (
                <ImageLightbox
                    images={galleryData}
                    currentIndex={lightbox.index}
                    onClose={closeLightbox}
                    onNext={nextImage}
                    onPrev={prevImage}
                />
            )}

            <style jsx global>{`
                @keyframes spin-reverse {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-reverse {
                    animation: spin-reverse 1.5s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ value, label, icon, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-400/5 border-blue-400/10",
        indigo: "text-indigo-400 bg-indigo-400/5 border-indigo-400/10",
        violet: "text-violet-400 bg-violet-400/5 border-violet-400/10"
    };

    return (
        <div className={`p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-start gap-4 transition-all hover:bg-white/[0.04]`}>
            <div className={`p-3 rounded-xl ${colors[color]} border font-bold`}>
                {icon}
            </div>
            <div>
                <div className="text-4xl font-black text-white tracking-tighter mb-1">{value}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{label}</div>
            </div>
        </div>
    );
};

export default Gallery;
