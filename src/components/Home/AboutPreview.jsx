"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPreview() {
    return (
        <section 
            id="about" 
            className="py-20 overflow-hidden relative"
           
            style={{ background: 'radial-gradient(circle at top right, #0B0E14, #05070a)' }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex justify-center relative"
                >
                    {/* Decorative Accent Glow */}
                    <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full" />
                    
                    <div className="relative w-full h-64 md:h-96 max-w-md">
                        <img
                            src="/images/gallery/hero.jpg"
                            alt="Students collaborating"
                            className="rounded-2xl shadow-2xl object-cover w-full h-full border border-white/10"
                        />
                    </div>
                </motion.div>

                {/* Right text with Glassmorphism Container */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
                >
                    <motion.h2
                        variants={item}
                        className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
                    >
                        About the <span className="text-[#3c6da1]">Computing</span> Students Society
                    </motion.h2>

                    <motion.p
                        variants={item}
                        className="text-lg text-[#F8FAFC]/80 leading-relaxed mb-8"
                    >
                        We are a community of passionate students who believe in learning by
                        doing. Through workshops, hackathons, and collaborative projects,
                        we help students grow their technical skills, build confidence,
                        and connect with like-minded peers.
                    </motion.p>

                    <motion.div variants={item}>
                        <Link
                            href="/about"
                            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-[#3e76b2] rounded-xl hover:bg-[#007BFF]/80 hover:shadow-[0_0_20px_rgba(0,123,255,0.4)]"
                        >
                            Read More About Us
                            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#A855F7]/10 blur-[120px] rounded-full" />
        </section>
    );
}