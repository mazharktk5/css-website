"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const GalleryPreview = () => {
    const [previewEvents, setPreviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const xPos = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/gallery");
                const data = await res.json();
                const galleryData = Array.isArray(data) ? data : [];

                // Group images by eventName — pick first image as cover
                const grouped = Object.values(
                    galleryData.reduce((acc, item) => {
                        if (!acc[item.eventName]) {
                            acc[item.eventName] = item;
                        }
                        return acc;
                    }, {})
                );
                setPreviewEvents(grouped.slice(0, 3));
            } catch {
                setPreviewEvents([]);
            }
            setLoading(false);
        };
        fetchGallery();
    }, []);

    return (
        <section
            id="gallery"
            ref={sectionRef}
            className="py-20 relative overflow-hidden bg-white"
        >
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] whitespace-nowrap z-0">
                <motion.h2
                    style={{ x: xPos }}
                    className="text-[25vw] font-black italic tracking-tighter uppercase text-slate-900"
                >
                    MOMENTS
                </motion.h2>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden text-center opacity-[0.02]">
                <div
                    className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
                    style={{
                        background: `radial-gradient(circle, #3b82f6 0%, transparent 70%)`,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 mb-4 text-[#1e3a8a]"
                        >
                            <span className="w-8 h-px bg-[#1e3a8a]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Visual Archive</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter leading-none"
                        >
                            Our <span className="text-[#1e3a8a]">Gallery.</span>
                        </motion.h2>
                    </div>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-2 border-slate-100 border-t-[#1e3a8a] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {previewEvents.map((item, index) => (
                            <motion.div
                                key={item._id || `gallery-${index}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-[#1e3a8a]/30 transition-all duration-700 shadow-sm hover:shadow-2xl flex flex-col h-full bg-slate-50"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.eventName}
                                    fill
                                    className="object-cover transition-all duration-[1.5s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-700 group-hover:translate-y-[-10px]">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#93c5fd] mb-3 block opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        {item.category}
                                    </span>
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-2 line-clamp-2">
                                        {item.eventName}
                                    </h3>
                                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest line-clamp-1">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="absolute top-8 right-8 w-10 h-10 bg-white shadow-2xl rounded-full flex items-center justify-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                    <ArrowUpRight className="w-5 h-5 text-slate-900" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/gallery"
                        className="group relative px-10 py-5 bg-slate-900 border border-slate-900 rounded-[1.5rem] overflow-hidden active:scale-95 transition-all text-[11px] font-black uppercase tracking-[0.4em] inline-block text-white shadow-xl shadow-slate-100"
                    >
                        <span className="relative z-10 group-hover:text-white transition-colors">Enter The Studio</span>
                        <div className="absolute inset-0 bg-[#1e3a8a] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
