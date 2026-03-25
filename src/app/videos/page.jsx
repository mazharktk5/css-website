"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Youtube } from "lucide-react";

export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/videos");
                const data = await res.json();
                setVideos(data || []);
            } catch (err) {
                console.error("Failed to fetch videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-40 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a]">

            {/* Hero */}
            <header className="relative pt-32 pb-20 bg-[#1e3a8a]/10">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm text-[#1e3a8a] font-medium tracking-wide"
                    >
                        Computing Students Society
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight"
                    >
                        CSS Video Library
                        <span className="block text-[#1e3a8a] mt-2 text-3xl md:text-4xl font-bold">
                            Watch, Learn & Build
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        Explore our collection of workshops, hackathons, and project recordings. Learn from the community and enhance your skills with real-world examples.
                    </motion.p>

                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 flex justify-center gap-8 flex-wrap"
                    >
                        <div className="px-6 py-4 text-center bg-white/20 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <p className="text-3xl font-black text-[#1e3a8a]">{videos.length}</p>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Total Videos</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Video Grid */}
            <main className="max-w-7xl mx-auto px-6 mt-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-video bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {videos.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            >
                                {videos.map((video, idx) => (
                                    <motion.div
                                        layout
                                        key={video._id || idx}
                                        variants={itemVariants}
                                        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-lg"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-56 w-full rounded-t-2xl overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center group-hover:bg-[#1e3a8a]/80 transition-all">
                                                    <Play className="w-8 h-8 text-white group-hover:text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="p-4 bg-white flex flex-col">
                                            <span className="text-[10px] font-bold uppercase text-[#1e3a8a] mb-1">{video.category}</span>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{video.title}</h3>
                                            <p className="text-slate-500 text-[11px] font-medium line-clamp-3 flex-grow">{video.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center">
                                <div className="p-12 bg-slate-50 rounded-full border border-slate-200 mb-10">
                                    <Youtube className="w-16 h-16 text-slate-300" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900">No Videos Found</h3>
                                <p className="text-slate-500 max-w-md mt-4 font-medium leading-relaxed">
                                    No videos are available at the moment. Please check back later.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </main>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-white/95 backdrop-blur-2xl"
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 border border-slate-200 flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all z-50"
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white"
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}