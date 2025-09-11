// components/About/History.jsx
"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const history = [
    {
        year: "Sept 2024",
        title: "Foundation",
        description:
            "Computing Students Society was founded with the goal of empowering students through collaboration, innovation, and technology-driven events.",
    },
    {
        year: "Nov 2024",
        title: "First Event",
        description:
            "Organized our very first orientation and workshop session, giving students a glimpse into what CSS is all about.",
    },
    {
        year: "Mar 2025",
        title: "Hackathon Launch",
        description:
            "Hosted our first hackathon, bringing together bright minds to solve real-world challenges and showcase creativity.",
    },
    {
        year: "Sept 2025",
        title: "Community Growth",
        description:
            "Expanded membership across departments, making CSS one of the most active and recognized societies on campus.",
    },
];

export default function History() {
    return (
        <section className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900">
            <div className="max-w-6xl mx-auto px-6 lg:px-12">
                {/* Heading */}
                <motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-4xl md:text-5xl font-extrabold text-center text-blue-900"
                >
                    Our History
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto"
                >
                    A journey that began in 2024 and continues to inspire students every day.
                </motion.p>

                {/* Timeline */}
                <div className="relative mt-16">
                    {/* vertical line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2" />

                    <div className="space-y-16">
                        {history.map((event, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: idx * 0.2 }}
                                className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? "md:justify-start" : "md:justify-end"
                                    }`}
                            >
                                {/* Connector Dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full shadow-md flex items-center justify-center text-white">
                                    <Calendar size={14} />
                                </div>

                                {/* Card */}
                                <div
                                    className={`bg-white rounded-2xl shadow-lg p-6 max-w-sm ${idx % 2 === 0
                                        ? "md:mr-auto md:text-right"
                                        : "md:ml-auto md:text-left"
                                        }`}
                                >
                                    <h3 className="text-xl font-bold text-blue-900">
                                        {event.year} – {event.title}
                                    </h3>
                                    <p className="mt-2 text-gray-700 leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
