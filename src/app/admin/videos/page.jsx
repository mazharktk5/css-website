"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import {
    Youtube,
    Plus,
    Trash2,
    ExternalLink,
    Search,
    Loader2,
    Video as VideoIcon,
    AlertCircle,
    CheckCircle2,
    Edit3
} from "lucide-react";

export default function AdminVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [status, setStatus] = useState({ type: null, message: "" });

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        youtubeUrl: ""
    });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/videos`);
            const data = await res.json();
            setVideos(data || []);
        } catch (err) {
            console.error("Failed to fetch videos:", err);
        }
        setLoading(false);
    };

    const handleEditClick = (video) => {
        setEditingVideo(video);
        setFormData({ title: video.title, youtubeUrl: video.youtubeUrl });
        setIsAdding(true);
        setStatus({ type: null, message: "" });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelAddEdit = () => {
        setIsAdding(false);
        setEditingVideo(null);
        setFormData({ title: "", youtubeUrl: "" });
        setStatus({ type: null, message: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: "" });

        const token = localStorage.getItem("admin_token");

        try {
            const isEditing = !!editingVideo;
            const method = isEditing ? "PUT" : "POST";
            const bodyData = isEditing ? { ...formData, _id: editingVideo._id } : formData;

            const res = await fetch("/api/videos", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: "success", message: `Video ${isEditing ? "updated" : "added"} successfully!` });
                handleCancelAddEdit();
                fetchVideos();
            } else {
                setStatus({ type: "error", message: data.error || `Failed to ${isEditing ? "update" : "add"} video` });
            }
        } catch (err) {
            setStatus({ type: "error", message: "Connection failed" });
        }
        setLoading(false);
    };

    const confirmDelete = async () => {
        if (!videoToDelete) return;
        
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`/api/videos?id=${videoToDelete}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchVideos();
            } else {
                alert("Failed to delete video");
            }
        } catch (err) {
            alert("Failed to delete video");
        } finally {
            setVideoToDelete(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase italic">Video Archive</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage society video content and YouTube transmissions.</p>
                    </div>
                    <button
                        onClick={() => isAdding ? handleCancelAddEdit() : setIsAdding(true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${isAdding
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                            : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                            }`}
                    >
                        {isAdding ? <Plus className="w-4 h-4 rotate-45" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? "Cancel" : "Add New Video"}
                    </button>
                </div>

                {/* Status Messages */}
                {status.message && (
                    <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${status.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                        {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold tracking-tight">{status.message}</span>
                    </div>
                )}

                {/* Add/Edit Video Form */}
                {isAdding && (
                    <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Video Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Computing Orientation 2024"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">YouTube URL</label>
                                <input
                                    required
                                    type="url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-all"
                                    value={formData.youtubeUrl}
                                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                disabled={loading}
                                type="submit"
                                className="bg-white text-slate-950 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingVideo ? "Update Deployment" : "Initialize Deployment"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Videos List */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Active Transmissions</span>
                        <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                            <Search className="w-3.5 h-3.5 text-gray-500" />
                            <input type="text" placeholder="Search archive..." className="bg-transparent border-none text-[10px] text-gray-400 focus:outline-none w-32" />
                        </div>
                    </div>

                    <div className="divide-y divide-white/[0.04]">
                        {loading && videos.length === 0 ? (
                            <div className="p-20 text-center">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-500 text-sm font-medium">Scanning archives...</p>
                            </div>
                        ) : videos.length === 0 ? (
                            <div className="p-20 text-center">
                                <VideoIcon className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm font-medium">No videos found. Initialize your first transmission.</p>
                            </div>
                        ) : (
                            videos.map((video) => (
                                <div key={video._id} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-white/10">
                                            <img src={video.thumbnail} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-950/40" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Youtube className="w-6 h-6 text-white opacity-50" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold tracking-tight">{video.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-gray-500 text-[10px] font-medium">{video.videoId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={video.youtubeUrl}
                                            target="_blank"
                                            className="p-2 rounded-lg bg-white/[0.05] text-gray-400 hover:text-white transition-colors"
                                            title="Open link"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleEditClick(video)}
                                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400/60 hover:text-blue-400 transition-colors"
                                            title="Edit video"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setVideoToDelete(video._id)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
                                            title="Delete video"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {videoToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-[#0d1220] border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div>
                                <h3 className="text-white font-bold text-lg">Confirm Deletion</h3>
                                <p className="text-gray-400 text-sm mt-2">
                                    Are you sure you want to delete this video? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setVideoToDelete(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Delete Video
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
