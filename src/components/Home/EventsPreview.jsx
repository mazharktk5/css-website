"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";

const EventsPreview = () => {
    const [previewEvents, setPreviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                const allEvents = Array.isArray(data) ? data : [];
                // Show past events on home page (first 3)
                const pastEvents = allEvents.filter(e => e.category === "past");
                setPreviewEvents(pastEvents.slice(0, 3));
            } catch {
                setPreviewEvents([]);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <section
            id="events"
            className="py-24 relative overflow-hidden bg-white"
        >
            {/* Background Decorative Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
                    style={{
                        background: `radial-gradient(circle, #3e76b2 0%, #93c5fd 50%, transparent 70%)`
                    }}
                />
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-gray-900"
                >
                    What <span className="text-[#3c6da1]">We&apos;ve Done </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg"
                >
                    A snapshot of workshops, sessions, and activities we&apos;ve successfully organized.
                </motion.p>

                {/* Event Cards */}
                {loading ? (
                    <div className="mt-16 flex justify-center">
                        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {previewEvents.map((event, index) => (
                            <motion.div
                                key={event._id || `event-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-2xl border border-gray-900 overflow-hidden hover:border-[#3c6da1]/30 transition-all duration-500 hover:shadow-xl"
                            >
                                {/* Event Image */}
                                <div className="relative h-52 overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent opacity-60" />
                                </div>

                                {/* Event Info */}
                                <div className="p-6 text-left">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3c6da1] transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                                        {event.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4 mr-3 text-[#3c6da1]" />
                                            {formatDate(event.date)}
                                        </div>

                                        {event.participants && (
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Users className="w-4 h-4 mr-3 text-[#3c6da1]" />
                                                {event.participants}+ Participants
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16">
                    <Link
                        href="/events"
                        className="inline-block px-10 py-4 bg-[#3c6da1] text-white rounded-xl font-bold hover:bg-[#3c6da1]/90 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                    >
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsPreview;
