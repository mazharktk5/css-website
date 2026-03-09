"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const GalleryPreview = () => {
    const [previewEvents, setPreviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/gallery");
                const data = await res.json();
                const galleryData = Array.isArray(data) ? data : [];

                const grouped = Object.values(
                    galleryData.reduce((acc, item) => {
                        if (!acc[item.eventName]) {
                            acc[item.eventName] = item;
                        }
                        return acc;
                    }, {})
                );

                setPreviewEvents(grouped.slice(0, 3));
            } catch (error) {
                console.error("Gallery fetch failed:", error);
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
            className="py-24 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="max-w-2xl mb-16">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-4 text-blue-700"
                    >
                        <span className="w-8 h-px bg-[#1e3a8a]" />
                        <span className="text-xs text-[#1e3a8a] font-semibold uppercase tracking-[0.3em]">
                            Highlights
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
                    >
                        Moments From Our
                        <span className="text-[#1e3a8a]"> Journey</span>
                    </motion.h2>

                    <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-lg">
                        A glimpse into our workshops, collaborations, and community
                        activities that shape the experience of our society.
                    </p>

                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-700 rounded-full animate-spin" />
                    </div>
                ) : previewEvents.length === 0 ? (
                    <p className="text-center text-slate-500 py-20">
                        No gallery events available yet.
                    </p>
                ) : (

                    /* Gallery Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {previewEvents.map((item, index) => (
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition duration-500"
                            >

                                {/* Image */}
                                <div className="relative aspect-[4/3]">

                                    <Image
                                        src={item.image || "/images/placeholder.jpg"}
                                        alt={item.eventName || "Gallery event"}
                                        fill
                                        className="object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 p-6 text-white">

                                    <span className="text-[10px] uppercase tracking-widest text-blue-300 font-semibold">
                                        {item.category || "Activity"}
                                    </span>

                                    <h3 className="text-lg font-semibold mt-1">
                                        {item.eventName || "Untitled Event"}
                                    </h3>

                                    <p className="text-xs text-white/70 mt-1 line-clamp-2">
                                        {item.description || "Highlights from our recent event"}
                                    </p>

                                </div>

                            </motion.div>
                        ))}

                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-16 text-center">

                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#1e3a8a] text-white rounded-xl text-sm font-semibold hover:bg-[#1e3a8a] transition"
                    >
                        Explore All Moments
                        <ArrowUpRight className="w-4 h-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </Link>

                </div>

            </div>
        </section>
    );
};

export default GalleryPreview;