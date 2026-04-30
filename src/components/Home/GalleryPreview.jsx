import dbConnect from "@/lib/mongodb";
import GalleryItem from "@/models/GalleryItem";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GalleryCard } from "./GalleryClient";

const GalleryPreview = async () => {
    let previewEvents = [];
    try {
        await dbConnect();
        const galleryData = await GalleryItem.find({}).sort({ createdAt: -1 }).lean();
        
        // Group by event name and take first 3
        const grouped = Object.values(
            galleryData.reduce((acc, item) => {
                if (!acc[item.eventName]) {
                    acc[item.eventName] = item;
                }
                return acc;
            }, {})
        );
        
        previewEvents = JSON.parse(JSON.stringify(grouped.slice(0, 3)));
    } catch (error) {
        console.error("Gallery fetch failed:", error);
    }

    return (
        <section id="gallery" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="max-w-2xl mb-16">
                    <div className="flex items-center gap-4 mb-4 text-blue-700">
                        <span className="w-8 h-px bg-[#1e3a8a]" />
                        <span className="text-xs text-[#1e3a8a] font-semibold uppercase tracking-[0.3em]">
                            Highlights
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        Moments From Our
                        <span className="text-[#1e3a8a]"> Journey</span>
                    </h2>

                    <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-lg">
                        A glimpse into our workshops, collaborations, and community
                        activities that shape the experience of our society.
                    </p>
                </div>

                {previewEvents.length === 0 ? (
                    <p className="text-center text-slate-500 py-20">
                        No gallery events available yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {previewEvents.map((item, index) => (
                            <GalleryCard key={item._id} item={item} index={index} />
                        ))}
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-16 text-center">
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#1e3a8a] text-white rounded-xl text-sm font-semibold hover:bg-[#1e3a8a] transition group"
                    >
                        Explore All Moments
                        <ArrowUpRight className="w-4 h-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;