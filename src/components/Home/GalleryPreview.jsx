"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import galleryData from "../../data/gallery.json";

const GalleryPreview = () => {
    return (
        <section 
            id="gallery" 
            className="py-24 relative overflow-hidden"
            style={{ background: '#0B0E14' }}
        >
            {/* Decorative Cyber Purple Glow */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#A855F7]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
                        Our <span className="text-[#3c6da1]">Gallery</span>
                    </h2>
                    <p className="text-lg text-[#F8FAFC]/60 max-w-2xl mx-auto">
                        A glimpse into our events, meetups, and the vibrant student
                        community of CSS.
                    </p>
                </div>

                {/* Gallery Grid (3 items only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {galleryData.slice(0, 3).map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-[#007BFF]/50"
                        >
                            {/* Image Container */}
                            <div className="relative h-72 overflow-hidden ">
                                <Image
                                    src={item.image}
                                    alt={item.eventName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out "
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-60" />
                                
                                {/* Category Badge - Cyber Purple */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#3c6da1] text-white  px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3 group-hover:text-[#4d7094] transition-colors">
                                    {item.eventName}
                                </h3>
                                <p className="text-[#F8FAFC]/60 text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        href="/gallery"
                        className="inline-block px-10 py-4 bg-[#3c6da1] text-white rounded-xl font-bold hover:bg-[#007BFF]/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,123,255,0.3)] hover:shadow-[0_0_30px_rgba(0,123,255,0.5)]"
                    >
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;