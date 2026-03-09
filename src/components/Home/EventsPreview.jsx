"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight } from "lucide-react";

const EventsPreview = () => {
    const [previewEvents, setPreviewEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                const allEvents = Array.isArray(data) ? data : [];
                setPreviewEvents(allEvents.slice(0, 3));
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
        <section id="events" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="max-w-2xl mb-14">

                    <p className="text-sm font-semibold text-[#1e3a8a] uppercase tracking-wider mb-3">
                        Events
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        Recent Activities
                    </h2>

                    <p className="mt-4 text-slate-600 text-lg">
                        Workshops, sessions, and community events organized by the
                        Computer Science Society.
                    </p>

                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
                    </div>
                ) : (

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {previewEvents.map((event, index) => (
                            <motion.div
                                key={event._id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                            >

                                {/* Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={event.image || "/images/gallery/placeholder.jpg"}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6">

                                    <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                                            {formatDate(event.date)}
                                        </div>

                                        <span className="text-xs font-medium text-[#1e3a8a]">
                                            {event.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                                        {event.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">

                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Users className="w-4 h-4" />
                                            {event.participants || "Participants"}
                                        </div>

                                        {/* <ArrowRight className="w-5 h-5 text-[#1e3a8a]" /> */}

                                    </div>

                                </div>

                            </motion.div>
                        ))}

                    </div>
                )}

                {/* CTA */}
                <div className="mt-14 text-center">

                    <Link
                        href="/events"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-[#1e3a8a] text-white font-semibold rounded-lg hover:bg-[#163172] transition"
                    >
                        View All Events
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                </div>

            </div>
        </section>
    );
};

export default EventsPreview;