// components/About/AboutHero.jsx
"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
    return (
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/40" /> {/* Overlay for contrast */}

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center px-6"
            >
                <h1 className="text-4xl md:text-6xl font-bold">
                    About the Computing Students Society
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
                    Building a vibrant tech community through workshops, hackathons, and
                    collaboration — empowering the next generation of innovators.
                </p>
            </motion.div>
        </section>
    );
}
