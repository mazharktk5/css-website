"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import ImageUpload from "@/components/Admin/ImageUpload";
import ConfirmModal from "@/components/Admin/ConfirmModal";
import { Trash2, Plus, MessageSquare, Image as ImageIcon, Loader2, ChevronDown, ChevronUp, User, Edit2 } from "lucide-react";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [editingPost, setEditingPost] = useState(null);

    // Confirm Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Delete",
        onConfirm: () => { },
    });

    const [formData, setFormData] = useState({
        content: "",
        image: ""
    });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            content: post.content || "",
            image: post.image || ""
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPost(null);
        setFormData({ content: "", image: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content && !formData.image) {
            alert("Please provide at least text content or an image.");
            return;
        }

        setSaving(true);
        const token = localStorage.getItem("admin_token");

        try {
            const url = editingPost ? `/api/posts/${editingPost._id}` : "/api/posts";
            const method = editingPost ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                handleCloseModal();
                fetchPosts();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save post");
            }
        } catch (error) {
            alert("An error occurred while saving.");
        }
        setSaving(false);
    };

    const deletePost = async (id) => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchPosts();
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            alert("An error occurred while deleting.");
        }
    };

    const deleteComment = async (postId, commentId) => {
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setPosts(posts.map(post => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            comments: post.comments.filter(c => c._id !== commentId)
                        };
                    }
                    return post;
                }));
            } else {
                alert("Failed to delete comment");
            }
        } catch (error) {
            alert("An error occurred while deleting.");
        }
    };

    const triggerDeletePost = (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Announcement",
            message: "Are you sure you want to permanently remove this announcement? This action cannot be undone.",
            confirmText: "Delete Post",
            onConfirm: () => deletePost(id)
        });
    };

    const triggerDeleteComment = (postId, commentId) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Comment",
            message: "This comment will be removed permanently. Proceed?",
            confirmText: "Delete Comment",
            onConfirm: () => deleteComment(postId, commentId)
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Blog & Announcements</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage public announcements and moderate comments.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={18} />
                        New Announcement
                    </button>
                </div>

                {/* Posts List */}
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all"
                            >
                                <div className="p-5 flex flex-col md:flex-row gap-6">
                                    {post.image && (
                                        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative border border-white/10 shrink-0">
                                            <img src={post.image} alt="Poster" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                            <ImageIcon size={12} className={post.image ? "text-blue-400" : "text-gray-600"} />
                                            <span className="mx-1">•</span>
                                            <MessageSquare size={12} className={post.content ? "text-purple-400" : "text-gray-600"} />
                                            <span className="mx-1">•</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm line-clamp-2 italic mb-1">
                                            {post.content || "No text content"}
                                        </p>
                                        <div className="flex items-center gap-6 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 underline underline-offset-4 decoration-blue-500/20">
                                                <span>{post.likes || 0} Likes</span>
                                            </div>
                                            <button 
                                                onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                                                className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <MessageSquare size={14} />
                                                <span>{post.comments?.length || 0} Comments</span>
                                                {expandedPost === post._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                                            title="Edit Post"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => triggerDeletePost(post._id)}
                                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Moderation Section */}
                                {expandedPost === post._id && (
                                    <div className="px-5 pb-5 pt-2 bg-white/[0.015] border-t border-white/[0.05]">
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Community Comments</h4>
                                            {post.comments?.length > 0 ? (
                                                post.comments.map((comment) => (
                                                    <div key={comment._id} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                                        <div className="flex gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                                                <User size={14} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                                                                <p className="text-[10px] text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => triggerDeleteComment(post._id, comment._id)}
                                                            className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                                                            title="Delete Comment"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-600 italic py-2">No comments on this post yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <p className="text-gray-500">No announcements found. Create your first one!</p>
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div 
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !saving && handleCloseModal()}
                        />
                        <div className="relative w-full max-w-xl bg-[#0d1220] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">
                                {editingPost ? "Edit Announcement" : "Create Announcement"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <ImageUpload 
                                    label="Announcement Poster (Optional)"
                                    value={formData.image} 
                                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                                />

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Post Text (Optional)</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Enter announcement details..."
                                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 min-h-[120px] transition-all"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={saving}
                                        className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl font-bold text-sm transition-all border border-white/[0.05]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || (!formData.content && !formData.image)}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (editingPost ? "Save Changes" : "Publish Now")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* Confirmation Modal */}
                <ConfirmModal 
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmModal.onConfirm}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    confirmText={confirmModal.confirmText}
                />
            </div>
        </AdminLayout>
    );
}
