"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const GalleryPreview = () => {
    const [previewEvents, setPreviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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
            className="py-24 relative overflow-hidden bg-white"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
                    style={{
                        background: `radial-gradient(circle, #3e76b2 0%, #93c5fd 50%, transparent 70%)`,
                    }}
                />
                <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-50/50 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Our <span className="text-[#3c6da1]">Gallery</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto"
                    >
                        Moments from our events, workshops, and student activities.
                    </motion.p>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {previewEvents.map((item, index) => (
                            <motion.div
                                key={item._id || `gallery-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-[#3c6da1]/30"
                            >
                                {/* Image */}
                                <div className="relative h-72 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.eventName}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Category */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#3c6da1] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3c6da1] transition-colors">
                                        {item.eventName}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/gallery"
                        className="inline-block px-10 py-4 bg-[#3c6da1] text-white rounded-xl font-bold hover:bg-[#3c6da1]/90 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                    >
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
