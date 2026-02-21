"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Gallery = () => {
    const [galleryData, setGalleryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

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

    const categories = ['All', ...new Set(galleryData.map(item => item.category))];

    const filteredImages = selectedCategory === 'All'
        ? galleryData
        : galleryData.filter(item => item.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 relative overflow-hidden">
            {/* Subtle Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section  */}
                <div className="relative h-[65vh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] 
                flex items-center justify-center overflow-hidden mb-20">

                    {/* Background Image */}
                    <Image
                        src="/images/gallery/github2.jpg"
                        alt="Gallery Background"
                        fill
                        priority
                        className="object-cover"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/75" />

                    {/* Content */}
                    <div className="relative z-10 text-center px-6 max-w-4xl">
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
                            Gallery
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-10">
                            Discover moments from our{" "}
                            <span className="text-blue-400 font-semibold">events</span>,{" "}
                            <span className="text-blue-400 font-semibold">workshops</span>, and{" "}
                            <span className="text-blue-400 font-semibold">community activities</span> —
                            where ideas grow, skills evolve, and connections are built.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/events">
                                <button className="px-8 py-3 rounded-full bg-blue-900 text-white font-medium
                                   hover:bg-blue-800 transition-all duration-300 shadow-lg">
                                    See Events
                                </button>
                            </Link>

                            <Link href="/contact">
                                <button className="px-8 py-3 rounded-full border border-white text-white font-medium
                                   hover:bg-white hover:text-blue-900 transition-all duration-300">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-14">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 backdrop-blur-md ${selectedCategory === category
                                    ? 'bg-blue-900 text-white shadow-[0_10px_30px_rgba(30,64,175,0.35)] scale-105'
                                    : 'bg-white/70 text-blue-900 hover:bg-blue-50 border border-blue-200 hover:scale-105'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredImages.map((item, idx) => (
                        <div
                            key={item._id || `gallery-${idx}`}
                            className="group relative bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden 
                                   border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                                   hover:shadow-[0_30px_60px_rgba(30,64,175,0.25)]
                                   transition-all duration-500 hover:-translate-y-3"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.eventName}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-900/90 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-md">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Caption Section */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:tracking-wide transition-all duration-300">
                                    {item.eventName}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-6">
                            <svg className="mx-auto h-20 w-20" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No images found
                        </h3>
                        <p className="text-gray-500">
                            No images available for the selected category.
                        </p>
                    </div>
                )}

                {/* Stats Section */}
                <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                    {[{
                        value: galleryData.length,
                        label: "Total Images"
                    }, {
                        value: categories.length - 1,
                        label: "Categories"
                    }, {
                        value: new Date().getFullYear(),
                        label: "Current Year"
                    }].map((stat, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white/70 backdrop-blur-2xl rounded-3xl p-10
                       border border-white/40 overflow-hidden
                       shadow-[0_25px_50px_rgba(0,0,0,0.1)]
                       hover:shadow-[0_30px_70px_rgba(30,64,175,0.35)]
                       transition-all duration-500 hover:-translate-y-3"
                        >
                            {/* Glow Accent */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                            bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />

                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 
                            bg-blue-900 rounded-full" />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">
                                    {stat.value}
                                </div>

                                <div className="text-gray-600 tracking-widest uppercase text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
