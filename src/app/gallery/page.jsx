"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import galleryData from '../../data/gallery.json';

const Gallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(galleryData.map(item => item.category))];
    
    const filteredImages = selectedCategory === 'All' 
        ? galleryData 
        : galleryData.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">
                        Gallery
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Explore our vibrant community through moments captured from our events, 
                        workshops, and activities.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                selectedCategory === category
                                    ? 'bg-blue-900 text-white shadow-lg'
                                    : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredImages.map((item) => (
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
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No images found
                        </h3>
                        <p className="text-gray-500">
                            No images available for the selected category.
                        </p>
                    </div>
                )}

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-900 mb-2">
                            {galleryData.length}
                        </div>
                        <div className="text-gray-600">
                            Total Events
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-900 mb-2">
                            {categories.length - 1}
                        </div>
                        <div className="text-gray-600">
                            Categories
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-900 mb-2">
                            {new Date().getFullYear()}
                        </div>
                        <div className="text-gray-600">
                            Current Year
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
