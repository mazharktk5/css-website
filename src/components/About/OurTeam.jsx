// components/About/OurTeam.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

const team = [
    {
        name: "DR Waheed ur Rehman",
        role: "Chief Organizer",
        image: "/images/developers/mazhar.jpg",
        linkedin: "https://linkedin.com",
        email: "ayesha@university.edu",
    },
    {
        name: "Abubakar Sadiq",
        role: "President",
        image: "/images/developers/mazhar.jpg",
        linkedin: "https://linkedin.com",
        email: "ali@university.edu",
    },
    {
        name: "Muhammad Jawad",
        role: "Vice President",
        image: "/images/developers/mazhar.jpg",
        linkedin: "https://linkedin.com",
        email: "sara@university.edu",
    },
];

export default function OurTeam() {
    return (
        <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold text-center text-blue-900"
                >
                    Meet Our Team
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-4 text-lg text-gray-700 text-center max-w-2xl mx-auto"
                >
                    The passionate people driving our mission forward.
                </motion.p>

                {/* Team Grid */}
                <div className="mt-16 grid gap-12 sm:grid-cols-2 md:grid-cols-3 justify-center">
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center max-w-xs w-full"
                        >
                            {/* Avatar */}
                            <div className="relative w-28 h-28">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="rounded-full object-cover ring-4 ring-blue-100 group-hover:ring-blue-500 transition duration-300"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-center mt-6">
                                <h3 className="text-xl font-semibold text-blue-900 group-hover:text-blue-600 transition">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3 mt-6">
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                                >
                                    <Linkedin size={18} />
                                </a>
                                <a
                                    href={`mailto:${member.email}`}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                                >
                                    <Mail size={18} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
