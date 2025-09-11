"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import galleryData from "../../data/gallery";


const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export default function GalleryPreview() {
    return (
        <section id="gallery" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                {/* Heading */}
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    variants={fadeUp}
                    className="text-3xl md:text-4xl font-bold text-blue-900"
                >
                    Our Gallery
                </motion.h2>
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    variants={fadeUp}
                    className="mt-4 text-gray-700 max-w-2xl mx-auto"
                >
                    A glimpse into our events, meetups, and the vibrant student
                    community of CSS.
                </motion.p>

                {/* Gallery Grid */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryData.slice(0, 6).map((item, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            variants={fadeUp}
                            className="relative group overflow-hidden rounded-2xl shadow-md cursor-pointer"
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={500}
                                height={350}
                                className="object-cover w-full h-64 transform group-hover:scale-110 transition duration-500"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                                <p className="text-white text-lg font-medium">
                                    {item.caption}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    variants={fadeUp}
                    className="mt-12"
                >
                    <Link
                        href="/gallery"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition shadow-md"
                    >
                        View Full Gallery
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
