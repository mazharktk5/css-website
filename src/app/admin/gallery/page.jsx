"use client";

import { useState, useEffect } from "react";

export default function AdminGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch("/api/gallery")
            .then(res => res.json())
            .then(data => setImages(data));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Gallery</h1>
            <button className="mb-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Upload Image</button>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map(img => (
                    <div key={img.id} className="relative group">
                        <img src={img.url} alt={img.title} className="w-full h-48 object-cover rounded" />
                        <button className="absolute top-2 right-2 bg-red-500 p-1 rounded text-sm opacity-0 group-hover:opacity-100 transition">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
