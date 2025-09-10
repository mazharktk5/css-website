// components/About/MissionVision.jsx
"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function MissionVision() {
    return (
        <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 overflow-hidden">
            {/* subtle background accent */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#3b82f6_0%,_transparent_40%)]" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-4xl md:text-5xl font-extrabold text-center text-blue-900"
                >
                    Our Mission & Vision
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-lg text-gray-700 text-center max-w-2xl mx-auto"
                >
                    What drives us forward as a community of innovators and learners.
                </motion.p>

                {/* Cards */}
                <div className="mt-16 grid gap-10 md:grid-cols-2">
                    {/* Mission */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="group relative bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition overflow-hidden"
                    >
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-2xl transition" />

                        {/* Icon + Heading inline */}
                        <div className="flex items-center gap-3">
                            <Target className="w-10 h-10 text-blue-700" />
                            <h3 className="text-2xl font-bold text-blue-900">Our Mission</h3>
                        </div>

                        <p className="mt-4 text-gray-700 leading-relaxed">
                            To empower students with technical knowledge, hands-on
                            experience, and leadership opportunities that prepare them for
                            impactful careers in technology and beyond.
                        </p>
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.2 }}
                        className="group relative bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition overflow-hidden"
                    >
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-2xl transition" />

                        {/* Icon + Heading inline */}
                        <div className="flex items-center gap-3">
                            <Lightbulb className="w-10 h-10 text-yellow-500" />
                            <h3 className="text-2xl font-bold text-blue-900">Our Vision</h3>
                        </div>

                        <p className="mt-4 text-gray-700 leading-relaxed">
                            To create a thriving student-led community where innovation,
                            collaboration, and lifelong learning are at the heart of every
                            initiative.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
