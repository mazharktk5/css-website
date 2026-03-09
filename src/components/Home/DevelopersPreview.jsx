"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import developers from "../../data/developers";

export default function DevelopersPreview() {
    const sectionRef = useRef(null);

    return (
        <section
            id="developers"
            ref={sectionRef}
            className="py-24 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="max-w-2xl mb-16">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-4 text-blue-700"
                    >
                        <span className="w-8 h-px bg-blue-700" />
                        <span className="text-xs text-[#1e3a8a] font-semibold uppercase tracking-[0.3em]">
                            Development Team
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-slate-900"
                    >
                        Meet The
                        <span className="text-[#1e3a8a]"> Developers</span>
                    </motion.h2>

                    <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-lg">
                        The team responsible for designing, building, and maintaining the
                        digital platforms that power our society.
                    </p>

                </div>

                {/* Developers Grid */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >

                            {/* Image */}
                            <div className="relative w-36 h-36 mx-auto mb-6 overflow-hidden rounded-2xl shadow-sm">

                                <Image
                                    src={dev.image}
                                    alt={dev.name}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />

                            </div>

                            {/* Name */}
                            <h3 className="text-lg font-semibold text-slate-900">
                                {dev.name}
                            </h3>

                            {/* Role */}
                            <p className="text-sm text-blue-700 mt-1">
                                {dev.role}
                            </p>

                            {/* LinkedIn */}
                            <div className="mt-4 flex justify-center">

                                <a
                                    href={dev.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 transition"
                                >
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn
                                </a>

                            </div>

                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
}