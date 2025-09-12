"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import developers from "../../data/developers";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export default function DevelopersPreview() {
    return (
        <section className="py-20 bg-gray-50">
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
                    Meet the Developers
                </motion.h2>
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    variants={fadeUp}
                    className="mt-4 text-gray-700 max-w-2xl mx-auto"
                >
                    The team behind the Computing Students Society website.
                </motion.p>

                {/* Grid */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            variants={fadeUp}
                            className="group relative rounded-2xl p-6 flex flex-col items-center text-center
                            bg-white backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-xl
                            hover:-translate-y-2 transition-all duration-300 w-full max-w-xs mx-auto
                            overflow-hidden h-full"
                        >
                            {/* Background Decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Avatar */}
                            <div className="relative w-28 h-28 mb-5 z-10 flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <Image
                                        src={dev.image}
                                        alt={dev.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-center z-10 flex-grow justify-start w-full">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors min-h-[56px] flex items-center justify-center w-full px-1">
                                    {dev.name}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1 min-h-[40px] flex items-center justify-center w-full px-1">
                                    {dev.role}
                                </p>
                                <div className="mt-auto">
                                    <a
                                        href={dev.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                                    >
                                        <Linkedin className="w-5 h-5" /> LinkedIn
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
