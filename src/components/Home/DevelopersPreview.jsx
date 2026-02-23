"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Linkedin, Github, Globe } from "lucide-react";
import developers from "../../data/developers";

export default function DevelopersPreview() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const xPos = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

    return (
        <section
            id="developers"
            ref={sectionRef}
            className="py-20 relative overflow-hidden bg-slate-50"
        >
            {/* Background Decorative Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] whitespace-nowrap z-0">
                <motion.h2
                    style={{ x: xPos }}
                    className="text-[18vw] font-black italic tracking-tighter uppercase text-[#1e3a8a]"
                >
                    ARCHITECTS
                </motion.h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 mb-4 text-[#1e3a8a]"
                        >
                            <span className="w-12 h-px bg-[#1e3a8a]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em]">System Engineering</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase mb-2"
                        >
                            THE <span className="text-[#1e3a8a] italic">DEVELOPERS.</span>
                        </motion.h2>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-[#1e3a8a]/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(30,58,138,0.05)] flex flex-col h-full"
                        >
                            {/* Card Header Illustration/Pattern */}
                            <div className="h-2 bg-[#1e3a8a] w-0 group-hover:w-full transition-all duration-700 ease-out" />

                            <div className="p-10 flex-grow">
                                {/* Profile Area */}
                                <div className="relative mb-10 inline-block">
                                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:rotate-3">
                                        <Image
                                            src={dev.image}
                                            alt={dev.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 border border-slate-800">
                                        <Github className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight mb-2 leading-none group-hover:text-[#1e3a8a] transition-colors">
                                    {dev.name}
                                </h3>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-4 h-[1px] bg-slate-200" />
                                    <p className="text-[#1e3a8a]/40 text-[9px] font-black uppercase tracking-[0.4em]">
                                        {dev.role}
                                    </p>
                                </div>
                            </div>

                            {/* Actions / Socials Footer */}
                            <div className="px-10 pb-10 mt-auto">
                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <a
                                        href={dev.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e3a8a] transition-colors flex items-center gap-2"
                                    >
                                        <Linkedin className="w-3 h-3" /> Connect
                                    </a>
                                    <Globe className="w-4 h-4 text-slate-200 group-hover:text-[#1e3a8a] transition-colors" />
                                </div>
                            </div>

                            {/* Blueprint Overlay Effect */}
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <span className="text-4xl font-black uppercase tracking-tighter">0{index + 1}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
