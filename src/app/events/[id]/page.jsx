"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Tag, ChevronRight } from "lucide-react";

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (!res.ok) {
                    setNotFound(true);
                    return;
                }
                const data = await res.json();
                setEvent(data);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
            </div>
        );
    }

    if (notFound || !event) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-5xl font-bold text-slate-900 mb-4">404</h1>
                <p className="text-slate-500 mb-8 text-lg">This event could not be found.</p>
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold hover:bg-[#163172] transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <div className="relative w-full h-[55vh] min-h-[420px]">
                <Image
                    src={event.image || "/images/gallery/placeholder.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 md:p-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black/30 backdrop-blur-md text-white rounded-xl text-sm font-medium hover:bg-black/50 transition border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    {event.category && (
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg text-xs font-semibold uppercase tracking-wider border border-white/10">
                            {event.category}
                        </span>
                    )}
                </div>

                {/* Title overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12">
                    <div className="max-w-5xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl"
                        >
                            {event.title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="max-w-5xl mx-auto px-6 md:px-8 py-5 border-b border-slate-100">
                <nav className="flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/" className="hover:text-[#1e3a8a] transition">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/events" className="hover:text-[#1e3a8a] transition">Events</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-700 font-medium truncate max-w-[200px]">{event.title}</span>
                </nav>
            </div>

            {/* Body */}
            <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
                <div className="grid lg:grid-cols-[1fr_320px] gap-12">

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {event.description && (
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-4">About This Event</h2>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">
                                    {event.description}
                                </p>
                            </div>
                        )}

                        {event.tags && event.tags.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-100 hover:border-[#1e3a8a]/30 hover:text-[#1e3a8a] transition"
                                        >
                                            <Tag className="w-3.5 h-3.5" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:sticky lg:top-24 lg:self-start"
                    >
                        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-5">
                            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Event Details</h3>

                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                                </div>
                                <p className="text-sm font-semibold text-slate-900">{formatDate(event.date)}</p>
                            </div>

                            {event.time && (
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-[#1e3a8a]" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">{event.time}</p>
                                </div>
                            )}

                            {event.location && (
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-[#1e3a8a]" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">{event.location}</p>
                                </div>
                            )}

                            {event.participants && (
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-[#1e3a8a]" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">{event.participants}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => router.back()}
                            className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-xl text-sm font-semibold hover:bg-[#163172] transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </button>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}
