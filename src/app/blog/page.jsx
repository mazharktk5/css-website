"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/Blog/BlogCard";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Loader2, Newspaper } from "lucide-react";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts");
                const data = await res.json();
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 font-sans">
            {/* Hero Section */}
            <div className="relative pt-32 pb-12 px-6 overflow-hidden bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto relative text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-sm">
                            <Bell size={14} className="animate-bounce" />
                            <span>Stay Updated</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                            Announcements & <span className="text-[#1e3a8a]">Updates</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-slate-500 text-md leading-relaxed">
                            Never miss a beat. Official news and community updates from the Computing Students Society.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Feed Layout */}
            <div className="max-w-2xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 gap-4"
                        >
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-slate-400 font-medium">Fetching the latest feed...</p>
                        </motion.div>
                    ) : posts.length > 0 ? (
                        <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                            {posts.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-32 text-center flex flex-col items-center gap-6 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                <Newspaper size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">The feed is empty for now</h3>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
