"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // Added motion for consistency
import Link from "next/link";
import galleryData from "../../data/gallery.json";

const GalleryPreview = () => {
    return (
        <section 
            id="gallery" 
            className="py-24 relative overflow-hidden bg-white"
        >
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
            
                <div 
                    className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
                    style={{
                        background: `radial-gradient(circle, #3e76b2 0%, #93c5fd 50%, transparent 70%)`
                    }}
                />
                
                
                <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-50/50 blur-[100px] rounded-full" />
            </div>
            {/* Soft Blue Ambient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3e76b2]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
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
                        A glimpse into our events, meetups, and the vibrant student
                        community of CSS.
                    </motion.p>
                </div>

                {/* Gallery Grid (3 items only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {galleryData.slice(0, 3).map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-[#3c6da1]/30"
                        >
                            {/* Image Container */}
                            <div className="relative h-72 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.eventName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                                {/* Overlay Gradient - Made lighter for light mode */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                {/* Category Badge - Using your brand blue */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#3c6da1] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3c6da1] transition-colors">
                                    {item.eventName}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

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