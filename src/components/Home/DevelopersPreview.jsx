"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import developers from "../../data/developers";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function DevelopersPreview() {
    return (
        <section 
            className="py-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0B0E14 0%, #05070a 100%)' }}
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#007BFF]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A855F7]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
                {/* Heading */}
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={fadeUp}
                    className="text-3xl md:text-5xl font-bold text-[#F8FAFC]"
                >
                    Meet the <span className="text-[#3c6da1]">Developers</span>
                </motion.h2>
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    variants={fadeUp}
                    className="mt-4 text-[#F8FAFC]/60 max-w-2xl mx-auto text-lg"
                >
                    The digital architects behind the Computing Students Society platform.
                </motion.p>

                {/* Grid */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            variants={fadeUp}
                            className="group relative rounded-2xl p-8 flex flex-col items-center text-center
                            bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl
                            hover:border-[#007BFF]/50 transition-all duration-500 h-full"
                        >
                            {/* Avatar with Halo Effect */}
                            <div className="relative w-32 h-32 mb-6 flex-shrink-0">
                                {/* Animated Glow Ring */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#007BFF] to-[#A855F7] rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                                
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 p-1 bg-[#0B0E14]">
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src={dev.image}
                                            alt={dev.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-center flex-grow w-full">
                                <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#8cbff5] transition-colors duration-300">
                                    {dev.name}
                                </h3>
                                <p className="text-[#3c6da1] text-sm font-medium mt-2 tracking-wide uppercase">
                                    {dev.role}
                                </p>
                                
                                <div className="mt-8 pt-6 border-t border-white/5 w-full">
                                    <a
                                        href={dev.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[#F8FAFC]/50 hover:text-[#d5dfeb] transition-all duration-300"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                        <span className="text-sm font-semibold uppercase tracking-tighter">LinkedIn</span>
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