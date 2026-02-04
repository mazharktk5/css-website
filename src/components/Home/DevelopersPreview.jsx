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
        <section className="py-24 relative overflow-hidden bg-white">
        
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
            
                <div 
                    className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
                    style={{
                        background: `radial-gradient(circle, #3e76b2 0%, #93c5fd 50%, transparent 70%)`
                    }}
                />
                
                
                <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-50/50 blur-[100px] rounded-full" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"></div>
            {/* Ambient Background Glows - Tuned for Light Theme */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#3e76b2]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
                {/* Heading */}
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={fadeUp}
                    className="text-3xl md:text-5xl font-bold text-gray-900"
                >
                    Meet the <span className="text-[#3c6da1]">Developers</span>
                </motion.h2>
                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    variants={fadeUp}
                    className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg"
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
                            bg-white border border-gray-100 shadow-sm
                            hover:border-[#3c6da1]/30 hover:shadow-xl transition-all duration-500 h-full"
                        >
                            {/* Avatar with Halo Effect */}
                            <div className="relative w-32 h-32 mb-6 flex-shrink-0">
                                {/* Animated Glow Ring - Adjusted to softer blue */}
                                <div className="absolute inset-0 bg-[#3c6da1]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-50 p-1 bg-white">
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
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#3c6da1] transition-colors duration-300">
                                    {dev.name}
                                </h3>
                                <p className="text-[#3c6da1] text-xs font-bold mt-2 tracking-widest uppercase">
                                    {dev.role}
                                </p>
                                
                                <div className="mt-8 pt-6 border-t border-gray-100 w-full">
                                    <a
                                        href={dev.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#3c6da1] transition-all duration-300"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
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