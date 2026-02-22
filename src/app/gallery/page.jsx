"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Filter, ChevronRight, LayoutGrid, Zap } from 'lucide-react';
import ImageLightbox from '@/components/Gallery/ImageLightbox';

const Gallery = () => {
    const [galleryData, setGalleryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                setGalleryData(Array.isArray(data) ? data : []);
            } catch {
                setGalleryData([]);
            }
            setLoading(false);
        };
        fetchGallery();
    }, []);

    const categories = useMemo(() =>
        ['All', ...new Set(galleryData.map(item => item.category))],
        [galleryData]
    );

    const filteredImages = useMemo(() =>
        selectedCategory === 'All'
            ? galleryData
            : galleryData.filter(item => item.category === selectedCategory),
        [galleryData, selectedCategory]
    );

    const openLightbox = (index) => setLightbox({ isOpen: true, index });
    const closeLightbox = () => setLightbox({ isOpen: false, index: 0 });
    const nextImage = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % filteredImages.length }));
    const prevImage = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + filteredImages.length) % filteredImages.length }));

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-t-2 border-blue-900 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Soft Background Accents */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Premium Header */}
            <header className="relative pt-32 pb-16 px-6 bg-gradient-to-b from-[#1e3a8a] to-[#3e76b2] text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto flex flex-col items-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                        Captured Moments
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-center">
                        Our <span className="text-[#93c5fd]">Captures</span>
                    </h1>

                    <p className="text-blue-50/80 text-lg md:text-xl max-w-2xl text-center leading-relaxed font-medium">
                        A visual record of our growth, innovation, and community impact. Explore the moments that define CSS Society.
                    </p>

                    <div className="mt-10 flex items-center gap-6">
                        <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-2xl font-black text-white">{galleryData.length}</span>
                            <span className="ml-2 text-blue-200 font-bold text-xs uppercase tracking-widest">Images</span>
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

                {/* Improved Masonry Grid */}
                <motion.div
                    layout
                    className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((item, idx) => (
                            <motion.div
                                layout
                                key={item._id || `gal-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                className="break-inside-avoid group relative cursor-pointer"
                                onClick={() => openLightbox(idx)}
                            >
                                <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 group-hover:border-blue-200">
                                    {/* Image with soft overlay */}
                                    <div className="relative overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.eventName}
                                            width={800}
                                            height={1000}
                                            className="w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />

                                        {/* Elegant Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500">
                                            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-[#93c5fd] rounded-full text-[10px] font-black uppercase tracking-widest text-blue-900">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black text-white leading-tight">
                                                    {item.eventName}
                                                </h3>
                                                <p className="text-blue-100/70 text-xs font-medium line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Zoom Icon */}
                                        <div className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 border border-white/20">
                                            <LayoutGrid className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl mb-6">
                            <ImageIcon className="w-12 h-12 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No captures found</h3>
                        <p className="text-gray-500 font-medium">This category is currently empty. More moments coming soon!</p>
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
                        <div className="text-5xl font-black text-[#1e3a8a] tracking-tight">{categories.length - 1}</div>
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
                    images={filteredImages}
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
