// components/EventsPreview.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import eventsData from "../../../src/data/events.json";

const EventsPreview = () => {
    const { upcoming } = eventsData;

    // Only show first 3 upcoming events
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
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                    Upcoming Events
                </h2>
                <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                    Here’s a glimpse of what’s coming up. Join us for exciting workshops,
                    hackathons, and meetups.
                </p>

                {/* Event Cards */}
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {previewEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Event Image */}
                            <div className="relative h-48">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>

                            {/* Event Info */}
                            <div className="p-6 text-left">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {event.description}
                                </p>

                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                    {formatDate(event.date)}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                    {event.time}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                    {event.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12">
                    <Link
                        href="/events"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition shadow-md"
                    >
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsPreview;
