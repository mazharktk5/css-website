"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Youtube, Share2, Info, Clock } from "lucide-react";

export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/videos`);
            const data = await res.json();
            setVideos(data || []);
        } catch (err) {
            console.error("Failed to fetch videos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 pt-32 pb-20 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] opacity-20" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span className="w-12 h-px bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">
                            Digital Catalog // Video Series
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]"
                    >
                        WATCH. <br /> <span className="text-blue-500 not-italic">LEARN.</span> EVOLVE.
                    </motion.h1>
                </div>

                {/* Video Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {videos.map((video) => (
                            <motion.div
                                key={video._id}
                                variants={itemVariants}
                                className="group cursor-pointer"
                                onClick={() => setSelectedVideo(video)}
                            >
                                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/10 group-hover:border-blue-500/50 transition-all duration-500 shadow-2xl">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-500">
                                            <Play className="w-6 h-6 text-white fill-white transition-all transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>

                                    {/* Category Tag */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
                                            {video.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                                        {video.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed">
                                        {video.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!loading && videos.length === 0 && (
                    <div className="text-center py-40 border border-dashed border-white/10 rounded-[4rem]">
                        <Youtube className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-700 uppercase italic">Signal Lost</h3>
                        <p className="text-slate-500 mt-2 font-medium">No transmissions found in the archive.</p>
                    </div>
                )}

            </div>

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-2xl"
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all z-50"
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-6xl aspect-video rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(30,58,138,0.3)] bg-black border border-white/10 relative"
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
        </main>
    );
}
