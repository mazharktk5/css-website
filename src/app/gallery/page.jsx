"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LayoutGrid } from 'lucide-react';
import ImageLightbox from '@/components/Gallery/ImageLightbox';

const Gallery = () => {
    const [galleryData, setGalleryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gallery`);
            const data = await res.json();
            setGalleryData(Array.from(new Map((data || []).map(item => [item._id, item])).values()));
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchGalleryData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/gallery`);
                const data = await res.json();
                setGalleryData(Array.from(new Map((data || []).map(item => [item._id, item])).values()));
            } catch (err) {
                console.error("Failed to fetch gallery:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    const categories = useMemo(() => ['All', ...new Set(galleryData.map(i => i.category))], [galleryData]);
    const filteredImages = useMemo(() =>
        selectedCategory === 'All' ? galleryData : galleryData.filter(i => i.category === selectedCategory),
        [galleryData, selectedCategory]
    );

    const openLightbox = (idx) => setLightbox({ isOpen: true, index: idx });
    const closeLightbox = () => setLightbox({ isOpen: false, index: 0 });
    const nextImage = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % filteredImages.length }));
    const prevImage = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + filteredImages.length) % filteredImages.length }));

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-slate-100 border-t-[#1e3a8a] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a] pb-40 overflow-x-hidden">

            {/* Hero */}
            <header className="relative pt-32 pb-20 bg-[#1e3a8a]/10">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight text-[#1e3a8a]">
                        DIGITAL GALLERY
                        <span className="block text-slate-900 mt-2 text-3xl md:text-4xl font-bold">
                            Explore & Relive Our Moments
                        </span>
                    </h1>
                    <p className="mt-6 text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        A curated collection of workshops, hackathons, and community projects. Browse, filter, and enjoy our most inspiring visuals.
                    </p>

                    {/* Stats Cards */}
                    <div className="mt-10 flex justify-center gap-8 flex-wrap">
                        <div className="px-6 py-4 text-center bg-white/20 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <p className="text-3xl font-black text-[#1e3a8a]">{filteredImages.length}</p>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Filtered</span>
                        </div>
                        <div className="px-6 py-4 text-center bg-white/20 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <p className="text-3xl font-black text-[#1e3a8a]">{galleryData.length}</p>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Total</span>
                        </div>
                    </div>
                </div>
            </header>
            {/* Categories */}
            <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-2">
                    {categories.map(cat => (
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

            {/* Gallery Grid */}
            <main className="max-w-7xl mx-auto px-6 mt-10">
                <AnimatePresence mode="popLayout">
                    {filteredImages.length > 0 ? (
                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {filteredImages.map((item, idx) => (
                                <motion.div
                                    layout
                                    key={item._id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                                    onClick={() => openLightbox(idx)}
                                >
                                    <div className="relative aspect-[4/5]">
                                        <Image
                                            src={item.image}
                                            alt={item.eventName}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-3 py-1 bg-[#1e3a8a]/30 text-white text-[10px] font-bold uppercase rounded-full">{item.category}</span>
                                                <h3 className="mt-2 text-white font-black text-lg line-clamp-2">{item.eventName}</h3>
                                                <p className="text-white/70 text-xs line-clamp-2 mt-1">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <LayoutGrid className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 text-center">
                            <div className="p-12 bg-slate-50 rounded-full border border-slate-200 mb-6">
                                <Zap className="w-16 h-16 text-slate-300" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">No Images Found</h3>
                            <p className="text-slate-500 max-w-md mt-2 font-medium leading-relaxed">
                                No images match your selected category. Try another filter.
                            </p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="mt-6 px-6 py-3 bg-[#1e3a8a] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-md"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Lightbox */}
            {lightbox.isOpen && (
                <ImageLightbox
                    images={filteredImages}
                    currentIndex={lightbox.index}
                    onClose={closeLightbox}
                    onNext={nextImage}
                    onPrev={prevImage}
                />
            )}
        </div>
    );
};

export default Gallery;