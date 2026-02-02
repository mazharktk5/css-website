"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import eventsData from "../../../src/data/events.json";

const EventsPreview = () => {
    const { upcoming } = eventsData;
    const previewEvents = upcoming.slice(0, 3);

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
            className="py-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #05070a 0%, #0B0E14 100%)' }}
        >
            {/* Background Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#007BFF]/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
                {/* Heading */}
                <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC]">
                    Upcoming <span className="text-[#3c6da1]">Events</span>
                </h2>
                <p className="mt-4 text-[#F8FAFC]/70 max-w-2xl mx-auto">
                    Here’s a glimpse of what’s coming up. Join us for exciting workshops,
                    hackathons, and meetups.
                </p>

                {/* Event Cards */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {previewEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-[#A855F7]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                        >
                            {/* Event Image */}
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent opacity-60"></div>
                            </div>

                            {/* Event Info */}
                            <div className="p-6 text-left">
                                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3 group-hover:text-[#a5bfdb] transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-[#F8FAFC]/60 text-sm line-clamp-2 mb-6">
                                    {event.description}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center text-[#F8FAFC]/80 text-sm">
                                        <Calendar className="w-4 h-4 mr-3 text-[#3c6da1]" />
                                        {formatDate(event.date)}
                                    </div>
                                    <div className="flex items-center text-[#F8FAFC]/80 text-sm">
                                        <Clock className="w-4 h-4 mr-3 text-[#3c6da1]" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center text-[#F8FAFC]/80 text-sm">
                                        <MapPin className="w-4 h-4 mr-3 text-[#3c6da1]" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16">
                    <Link
                        href="/events"
                        className="inline-block px-8 py-4 bg-transparent border border-[#3c6da1] text-[#F8FAFC] rounded-xl font-semibold hover:bg-[#4e5f71] transition-all duration-300 shadow-lg"
                    >
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsPreview;