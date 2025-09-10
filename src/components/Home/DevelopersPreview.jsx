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
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center"
                        >
                            <div className="relative w-28 h-28 mb-4">
                                <Image
                                    src={dev.image}
                                    alt={dev.name}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">{dev.name}</h3>
                            <p className="text-gray-600 text-sm">{dev.role}</p>
                            <a
                                href={dev.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                            >
                                <Linkedin className="w-5 h-5" /> LinkedIn
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
