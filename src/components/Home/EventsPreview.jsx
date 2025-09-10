// components/EventsPreview.js
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Laptop } from "lucide-react";

const events = [
    {
        title: "Workshops",
        desc: "Hands-on sessions where students explore coding, design, and emerging tech.",
        icon: <Laptop className="w-10 h-10 text-blue-600" />,
    },
    {
        title: "Hackathons",
        desc: "Collaborative coding marathons that spark creativity and innovation.",
        icon: <Users className="w-10 h-10 text-blue-600" />,
    },
    {
        title: "Community Meetups",
        desc: "Networking events that connect learners with peers and industry mentors.",
        icon: <Calendar className="w-10 h-10 text-blue-600" />,
    },
];

// fade + scale animation
const fadeScale = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
};

export default function EventsPreview() {
    return (
        <section id="events" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                {/* Heading */}
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    variants={fadeScale}
                    className="text-3xl md:text-4xl font-bold text-blue-900"
                >
                    Upcoming Events & Activities
                </motion.h2>

                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    variants={fadeScale}
                    className="mt-4 text-gray-700 max-w-2xl mx-auto"
                >
                    Stay ahead with hands-on workshops, hackathons, and networking
                    opportunities organized by the Computing Students Society.
                </motion.p>

                {/* Event Cards */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.2,
                                ease: "easeOut",
                            }}
                            variants={fadeScale}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center flex flex-col items-center"
                        >
                            <div className="p-3 bg-blue-100 rounded-xl mb-4">
                                {event.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-blue-800">
                                {event.title}
                            </h3>
                            <p className="mt-3 text-gray-600">{event.desc}</p>
                        </motion.div>
                    ))}
                </div>


                {/* CTA */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    variants={fadeScale}
                    className="mt-12"
                >
                    <Link
                        href="/events"
                        className="inline-block px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition shadow-md"
                    >
                        View All Events
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
