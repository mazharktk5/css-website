// components/About/OurStory.jsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Star, Users } from "lucide-react";

const timeline = [
    {
        year: "2020",
        title: "The Beginning",
        description:
            "CSS was founded to bring together students passionate about technology and problem-solving.",
        icon: Calendar,
    },
    {
        year: "2022",
        title: "Growth & Recognition",
        description:
            "We organized hackathons, workshops, and tech talks that attracted students across the campus.",
        icon: Users,
    },
    {
        year: "2024",
        title: "Stronger Than Ever",
        description:
            "CSS became a hub of collaboration, innovation, and leadership for computing students.",
        icon: Star,
    },
];

export default function OurStory() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white text-gray-900">
            <div className="max-w-5xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-center text-blue-900"
                >
                    Our Story
                </motion.h2>

                {/* Timeline */}
                <div className="mt-12 relative border-l-4 border-blue-200">
                    {timeline.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                                className="mb-10 ml-6"
                            >
                                {/* Dot */}
                                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-700 rounded-full ring-4 ring-blue-200">
                                    <Icon size={14} className="text-white" />
                                </span>

                                {/* Content */}
                                <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                                    <span className="text-sm font-semibold text-blue-600">
                                        {item.year}
                                    </span>
                                    <h3 className="text-lg font-bold text-blue-900 mt-1">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-gray-700 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
