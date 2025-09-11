// components/AboutPreview.js
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25, // delay each child
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPreview() {
    return (
        <section id="about" className="py-16 bg-white text-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

                {/* Left image with smooth animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="flex justify-center order-1 md:order-none"
                >
                    <div className="relative w-full h-64 md:h-80 max-w-md">
                        <img
                            src="/images/gallery/hero.jpg"
                            alt="Students collaborating in CSS"
                            className="rounded-2xl shadow-lg object-cover w-full h-full"
                        />
                    </div>
                </motion.div>

                {/* Right text with stagger animation */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.3 }}
                    className="space-y-6"
                >
                    <motion.h2
                        variants={item}
                        className="text-3xl md:text-4xl font-bold text-blue-900"
                    >
                        About the Computing Students Society
                    </motion.h2>

                    <motion.p
                        variants={item}
                        className="text-lg text-gray-700 leading-relaxed"
                    >
                        We are a community of passionate students who believe in learning by
                        doing. Through workshops, hackathons, and collaborative projects,
                        we help students grow their technical skills, build confidence,
                        and connect with like-minded peers.
                    </motion.p>

                    <motion.div variants={item}>
                        <Link
                            href="/about"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition shadow-md"
                        >
                            Read More About Us
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
