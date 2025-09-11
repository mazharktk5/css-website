"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import galleryData from "../../data/gallery.json";

const GalleryPreview = () => {
    return (
        <section id="gallery" className="bg-gray-100 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                        Our Gallery
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A glimpse into our events, meetups, and the vibrant student
                        community of CSS.
                    </p>
                </div>

                {/* Gallery Grid (6 items only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryData.slice(0, 3).map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.eventName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Caption Section */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-blue-900 mb-2">
                                    {item.eventName}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/gallery"
                        className="inline-block px-8 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                    >
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
