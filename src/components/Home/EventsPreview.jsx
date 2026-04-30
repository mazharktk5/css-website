import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { EventCard } from "./EventsClient";

const EventsPreview = async () => {
    let previewEvents = [];
    try {
        await dbConnect();
        const allEvents = await Event.find({}).sort({ date: -1 }).limit(3).lean();
        previewEvents = JSON.parse(JSON.stringify(allEvents));
    } catch (error) {
        console.error("Failed to fetch events for preview:", error);
    }

    return (
        <section id="events" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="max-w-2xl mb-14">
                    <div className="flex items-center gap-4 mb-4 text-[#1e3a8a]">
                        <span className="w-8 h-px bg-[#1e3a8a]" />
                        <span className="text-xs text-[#1e3a8a] font-semibold uppercase tracking-[0.3em]">
                            Events
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        Recent <span className="text-[#1e3a8a]"> Activities</span>
                    </h2>

                    <p className="mt-4 text-slate-600 text-lg">
                        Workshops, sessions, and community events organized by the
                        Computing Students Society.
                    </p>
                </div>

                {previewEvents.length === 0 ? (
                    <p className="text-center text-slate-500 py-20">
                        No recent activities available yet.
                    </p>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {previewEvents.map((event, index) => (
                            <EventCard 
                                key={event._id} 
                                event={event} 
                                index={index} 
                            />
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