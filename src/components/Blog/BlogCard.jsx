"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/images/logo/css-logo.jpg";

export default function BlogCard({ post }) {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        setIsLiked(likedPosts.includes(post._id));
    }, [post._id]);

    const handleLike = async () => {
        const action = isLiked ? "unlike" : "like";
        
        try {
            const res = await fetch(`/api/posts/${post._id}/like`, { 
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes);
                
                let likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
                if (action === "like") {
                    likedPosts.push(post._id);
                } else {
                    likedPosts = likedPosts.filter(id => id !== post._id);
                }
                localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("Failed to update like status:", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/posts/${post._id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newComment })
            });

            if (res.ok) {
                const addedComment = await res.json();
                setComments(prev => [...prev, addedComment]);
                setNewComment("");
                if (!showComments) setShowComments(true);
            } else {
                const errorData = await res.json().catch(() => ({}));
                alert(`Error ${res.status}: ${errorData.error || "Failed to post comment"}`);
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
            alert("An error occurred while posting your comment.");
        }
        setSubmitting(false);
    };

    const handleShare = async () => {
        const shareData = {
            title: "CSS Society Announcement",
            text: post.content || "Check out this announcement from Computing Students Society!",
            url: window.location.origin + "/blog#" + post._id
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Share failed:", err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <motion.div
            id={post._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                        <Image
                            src={logo}
                            alt="CSS Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">Computing Students Society</h3>
                        <p className="text-[11px] text-slate-500 font-medium">{formatDate(post.createdAt)}</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Post Content (Text) */}
            {post.content && (
                <div className="px-4 pb-3">
                    <p className="text-[15px] text-slate-800 leading-normal whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>
            )}

            {/* Post Media (Image) */}
            {post.image && (
                <div className="relative w-full bg-slate-50 border-y border-slate-100 overflow-hidden">
                    <img 
                        src={post.image} 
                        alt="Post media" 
                        className="w-full h-auto max-h-[600px] object-contain mx-auto"
                    />
                </div>
            )}

            {/* Stats Area */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[13px] text-slate-500">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-sm">
                        <Heart size={10} fill="currentColor" />
                    </div>
                    <span className="font-medium">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
                </div>
                <div className="flex gap-3">
                   {comments.length > 0 && (
                       <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                           {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                       </button>
                   )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center gap-1">
                <button
                    onClick={handleLike}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all font-semibold text-sm ${
                        isLiked 
                        ? "text-blue-600 bg-blue-50/50" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Heart 
                        size={18} 
                        className={isLiked ? "fill-blue-600 stroke-blue-600" : ""}
                    />
                    <span>Like</span>
                </button>

                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors font-semibold text-sm"
                >
                    <MessageCircle size={18} />
                    <span>Comment</span>
                </button>

                <button 
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors font-semibold text-sm"
                >
                    <Share2 size={18} />
                    <span>Share</span>
                </button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50 border-t border-slate-100"
                    >
                        <div className="p-4 space-y-4">
                            {/* Comment Input */}
                            <form onSubmit={handleComment} className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full bg-white border border-slate-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || submitting}
                                    className="p-2 bg-blue-600 text-white rounded-full disabled:bg-slate-300 transition-all hover:bg-blue-700 active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-3">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                                            <div className="text-[10px] font-bold">U</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white border border-slate-100 rounded-2xl px-3 py-2 shadow-sm">
                                                <p className="text-[13px] text-slate-800 leading-tight">{comment.text}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 ml-2">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
